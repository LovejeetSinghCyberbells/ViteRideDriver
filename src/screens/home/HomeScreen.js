import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, PermissionsAndroid, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import { Map as MapView, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonToggleSwitch from '../../components/CommonToggleSwitch';
import CommonButton from '../../components/CommonButton';
import RideRequestSheet from '../../components/RideRequestSheet';
import { Dimensions } from 'react-native';
import {
  DUMMY_CURRENT,
  DUMMY_PICKUP,
  DUMMY_DROPOFF,
  DUMMY_TO_PICKUP_ROUTE,
  DUMMY_DROPOFF_ROUTE,
} from '../ride/DummyRouteData';
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const DEFAULT_CENTER = {
  latitude: -1.2921,
  longitude: 36.8219,
};

const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const STREET_LEVEL_ZOOM = 13;

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto',
});

const STATUS_DATA = [
  { icon: 'power-settings-new', title: "Earnings", data: '$148.75', bgColor: colors.lightGreenColor, iconColor: colors.greenColor },
  { icon: 'access-time', title: "Hours Online", data: '6.5h', bgColor: colors.lightBlueColor, iconColor: colors.blueColor },
  { icon: 'trending-up', title: "Trips", data: '8', bgColor: colors.lightPurpleColor, iconColor: colors.purpleColor },
];

const statusCard = ({ icon, title, data, bgColor, iconColor }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
      <MaterialDesignIcons name={icon} size={30} color={iconColor} />
    </View>
    <View style={styles.summaryTextColumn}>
      <Text style={styles.summaryText}>{title}</Text>
      <Text style={styles.summaryHighlight}>{data}</Text>
    </View>
  </View>
);

async function reverseGeocode(latitude, longitude) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'ViteRideDriver/1.0' } }
    );
    const json = await res.json();
    const { road, suburb, city, town, village, country } = json.address ?? {};
    const locality = city || town || village || suburb || '';
    const street = road || '';
    return [street, locality, country].filter(Boolean).join(', ');
  } catch {
    return null;
  }
}

async function requestLocationPermission() {
  if (Platform.OS !== 'android') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'ViteRide Driver needs your location to show ride requests near you.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    }
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export default function HomeScreen({ navigation }) {
  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  const [enabled, setEnabled] = useState(true);
  const [online, setOnline] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const rideSheetRef = useRef(null);

  const [locationLabel, setLocationLabel] = useState('Turn on location to update');
  const [locationLoading, setLocationLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapLoadError, setMapLoadError] = useState(false);

  const watchIdRef = useRef(null);
  const cancelledRef = useRef(false);

  const toGeoCoord = (p) => [p.longitude, p.latitude];

  // Force camera zoom when map loads and coords are available
  useEffect(() => {
    if (mapLoaded && coords && cameraRef.current) {
      cameraRef.current.setStop({
        center: toGeoCoord(coords),
        zoom: STREET_LEVEL_ZOOM,
        animationMode: 'flyTo',
        animationDuration: 1500,
      });
    }
  }, [mapLoaded, coords]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const fetchLocation = (cancelled) => {
    setLocationLoading(true);

    Geolocation.getCurrentPosition(
      async ({ coords: c }) => {
        if (cancelled.current) return;
        setCoords({ latitude: c.latitude, longitude: c.longitude });
        const label = await reverseGeocode(c.latitude, c.longitude);
        if (!cancelled.current) {
          setLocationLabel(label ?? `${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}`);
          setLocationLoading(false);
        }
      },
      (err) => {
        if (cancelled.current) return;
        console.warn('High accuracy failed, trying network…', err.message);

        Geolocation.getCurrentPosition(
          async ({ coords: c }) => {
            if (cancelled.current) return;
            setCoords({ latitude: c.latitude, longitude: c.longitude });
            const label = await reverseGeocode(c.latitude, c.longitude);
            if (!cancelled.current) {
              setLocationLabel(label ?? `${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}`);
              setLocationLoading(false);
            }
          },
          (err2) => {
            if (!cancelled.current) {
              setLocationLabel('Unable to get location');
              setLocationLoading(false);
              console.warn('Geolocation fallback error:', err2.message);
            }
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
  };

  const startWatch = (cancelled) => {
    watchIdRef.current = Geolocation.watchPosition(
      async ({ coords: c }) => {
        if (cancelled.current) return;
        setCoords({ latitude: c.latitude, longitude: c.longitude });
        const label = await reverseGeocode(c.latitude, c.longitude);
        if (!cancelled.current && label) setLocationLabel(label);
      },
      (err) => console.warn('Watch error:', err.message),
      { enableHighAccuracy: true, distanceFilter: 50, interval: 10000, fastestInterval: 5000 }
    );
  };

  useEffect(() => {
    cancelledRef.current = false;

    const startLocationWatch = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLocationLabel('Location permission denied');
        setLocationLoading(false);
        return;
      }
      fetchLocation(cancelledRef);
      startWatch(cancelledRef);
    };

    const stopLocationWatch = () => {
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setLocationLabel('Location updates paused');
      setLocationLoading(false);
      setCoords(null);
    };

    if (enabled) {
      startLocationWatch();
    } else {
      stopLocationWatch();
    }

    return () => {
      cancelledRef.current = true;
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [enabled]);

  // Open ride request sheet once
  useEffect(() => {
    setSheetOpen(true);
    rideSheetRef.current?.open();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, sheetOpen && { backgroundColor: '#04040450' }]}>
          {/* Location Top Bar */}
          <View style={styles.locationTopBar}>
            <View style={styles.locationContainer}>
              <MaterialDesignIcons
                name="location-on"
                size={isSmallDevice ? 40 : 50}
                color={enabled ? colors.secondaryColor : colors.borderColor}
              />
              <View style={styles.locationTextColumn}>
                <Text style={styles.labelText}>Current Location</Text>
                {locationLoading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color={colors.secondaryColor} />
                    <Text style={[styles.labelHighlight, { marginLeft: 6 }]}>
                      Locating…
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.labelHighlight} numberOfLines={2}>
                    {locationLabel}
                  </Text>
                )}
              </View>
            </View>
            <CommonToggleSwitch value={enabled} onValueChange={setEnabled} />
          </View>

          {/* Status */}
          <View style={styles.statusBgContainer}>
            <View style={styles.statusContainer}>
              <View style={styles.powerIconContainer}>
                <MaterialDesignIcons name="power-settings-new" size={24} color={colors.whiteColor} />
              </View>
              <View style={styles.statusTextColumn}>
                <Text style={styles.statusText}>You're {online ? 'Online' : 'Offline'}</Text>
                <Text style={styles.statusHighlight}>
                  {online ? 'Ready for ride requests' : 'Waiting for ride requests…'}
                </Text>
              </View>
            </View>
          </View>

          {/* Today's Summary */}
          <View style={styles.todaySummaryContainer}>
            <Text style={styles.todaySummaryText}>Today's Summary</Text>
            {STATUS_DATA.map((item, index) => (
              <View key={index} style={{ marginTop: 15 }}>
                {statusCard(item)}
              </View>
            ))}

            {/* Map */}
            <View style={styles.mapContainer}>
              {locationLoading || !coords ? (
                <View style={styles.mapLoadingState}>
                  <ActivityIndicator size="large" color={colors.secondaryColor} />
                  <Text style={styles.mapLoadingText}>
                    {locationLoading ? 'Finding your location…' : 'Waiting for location…'}
                  </Text>
                </View>
              ) : (
                <>
                  <MapView
                    ref={mapRef}
                    style={styles.map}
                    mapStyle={MAP_STYLE_URL}
                    logoEnabled={false}
                    onDidFinishLoadingMap={() => setMapLoaded(true)}
                    onDidFailLoadingMap={(e) => {
                      setMapLoadError(true);
                      console.warn('Map style failed to load:', e);
                    }}
                  >
                    <Camera
                      ref={cameraRef}
                      center={toGeoCoord(coords)}           // Updated prop name
                      zoom={STREET_LEVEL_ZOOM}              // Updated prop name
                      animationMode="flyTo"
                      animationDuration={1200}
                      trackUserLocation="default"           // Modern replacement for followUserLocation
                    />
                    <UserLocation animated showsUserHeadingIndicator />
                  </MapView>

                  {mapLoadError && (
                    <View style={styles.mapErrorBanner} pointerEvents="none">
                      <Text style={styles.mapErrorText}>
                        Map failed to load — check your network connection
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          <CommonButton
            title={online ? 'Go Offline' : 'Go Online'}
            onPress={() => setOnline(!online)}
            color={colors.secondaryColor}
            textColor={colors.primaryColor}
            style={{ marginTop: 30 }}
          />
        </View>
      </ScrollView>

      <RideRequestSheet
        ref={rideSheetRef}
        earnings="$ 24.50"
        pickupAddress={locationLabel}
        dropoffAddress="Mandume Ndemufayo Ave, Windhoek"
        distance="5.2 miles"
        duration="12 min"
        countdownSeconds={60}
        backdropOpacity={0.2}
        onAccept={() => {
  setSheetOpen(false);
  navigation.navigate('RideScreen', {
    current: DUMMY_CURRENT,
    pickup: DUMMY_PICKUP,
    dropoff: DUMMY_DROPOFF,
    selectedRide: 'economy',
    pickUpRoute: DUMMY_TO_PICKUP_ROUTE,
    dropOffRoute: DUMMY_DROPOFF_ROUTE,
  });
}}
        onDecline={() => {
          setSheetOpen(false);
          console.log('Declined');
        }}
        onTimeout={() => {
          setSheetOpen(false);
          console.log('Timed out');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryColor },
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.04,
  },
  locationTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationContainer: { flexDirection: 'row', flex: 1, marginRight: 10, alignItems: 'center' },
  locationTextColumn: { flex: 1, marginLeft: 10 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  labelText: { fontSize: isSmallDevice ? 13 : 14, fontWeight: '500', color: colors.secondaryColor },
  labelHighlight: { fontSize: isSmallDevice ? 11 : 12, color: colors.whiteColor, fontWeight: '400' },

  statusBgContainer: {
    backgroundColor: colors.cardWhiteOpacity,
    padding: width * 0.05,
    borderRadius: 12,
    marginTop: 25,
  },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  powerIconContainer: {
    width: isSmallDevice ? 45 : 50,
    height: isSmallDevice ? 45 : 50,
    borderRadius: 100,
    backgroundColor: colors.secondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextColumn: { flex: 1, marginLeft: 15 },
  statusText: { fontSize: isSmallDevice ? 18 : 20, fontWeight: '500', color: colors.whiteColor },
  statusHighlight: { fontSize: isSmallDevice ? 13 : 14, color: colors.whiteColor, fontWeight: '400' },

  todaySummaryContainer: {
    backgroundColor: colors.cardWhiteOpacity,
    padding: width * 0.05,
    borderRadius: 15,
    marginTop: 25,
  },
  todaySummaryText: { fontSize: isSmallDevice ? 16 : 18, color: colors.whiteColor, fontWeight: '500' },

  iconContainer: {
    width: isSmallDevice ? 45 : 50,
    height: isSmallDevice ? 45 : 50,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryTextColumn: { marginLeft: 10, flex: 1 },
  summaryText: { fontSize: isSmallDevice ? 13 : 14, fontWeight: '400', color: colors.borderColor },
  summaryHighlight: { fontSize: isSmallDevice ? 15 : 16, color: colors.blackColor, fontWeight: '400' },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    padding: width * 0.04,
    borderRadius: 15,
  },

  mapContainer: {
    height: height * 0.25,
    minHeight: 180,
    maxHeight: 300,
    backgroundColor: colors.whiteColor,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  mapLoadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardWhiteOpacity,
    paddingHorizontal: 20,
  },
  mapLoadingText: {
    marginTop: 10,
    color: colors.secondaryColor,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapErrorBanner: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mapErrorText: {
    color: colors.whiteColor,
    fontSize: 12,
    textAlign: 'center',
  },
});