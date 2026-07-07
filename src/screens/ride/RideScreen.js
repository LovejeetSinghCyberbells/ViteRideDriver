import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../common/Colors';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import RideBottomSheet from '../../components/RideBottomSheet';
import { useCarAnimation } from './hooks/useCarAnimation';
import CarAnimatedMarker from './components/CarAnimatedMarker';

import {
    Map as MapView,
    Camera,
    GeoJSONSource as ShapeSource,
    Layer,
    Marker as MarkerView,
} from '@maplibre/maplibre-react-native';

const MAP_STYLE =
    'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DEFAULT_CENTER = { latitude: 30.7333, longitude: 76.7794 };

const DRIVER_START_OFFSET = { lonDelta: -0.014, latDelta: 0.011 };

const FOLLOW_ZOOM = 15;
const FOLLOW_PITCH = 45;
const FOLLOW_UPDATE_INTERVAL_MS = 550;

const toGeoCoord = p => [p.longitude, p.latitude];

const haversineKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function RideScreen({ navigation, route }) {
    const {
        current = null,
        pickup = null,
        dropoff = null,
        pickUpRoute = null,
        dropOffRoute = null,
    } = route?.params ?? {};

    const cameraRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const dropoffCoordinates = useMemo(() => dropOffRoute?.coordinates ?? [], [dropOffRoute?.coordinates]);
    const duration = dropOffRoute?.duration ?? 3;

    const cameraInitDone = useRef(false);

    const [arrivedAtPickup, setArrivedAtPickup] = useState(false);
    const [tripStarted, setTripStarted] = useState(false);
    const [pickupLegComplete, setPickupLegComplete] = useState(false);
    const [tripCompleted, setTripCompleted] = useState(false);
    const [activeRouteCoordinates, setActiveRouteCoordinates] = useState(null);
    const [shouldShowPickupRoute, setShouldShowPickupRoute] = useState(true);

    const pickupCoord = pickup ? toGeoCoord(pickup) : null;

    const toPickupCoordinates = useMemo(() => {
        if (pickUpRoute?.coordinates?.length >= 2) return pickUpRoute.coordinates;

        const startCoord = current
            ? toGeoCoord(current)
            : pickup
                ? [pickup.longitude + DRIVER_START_OFFSET.lonDelta, pickup.latitude + DRIVER_START_OFFSET.latDelta]
                : null;

        if (!startCoord || !pickupCoord) return null;
        return [startCoord, pickupCoord];
    }, [pickUpRoute, current, pickup, pickupCoord]);

    const distanceToPickupKm = useMemo(() => {
        if (pickUpRoute?.distance != null) return pickUpRoute.distance;
        if (!toPickupCoordinates || toPickupCoordinates.length < 2) return 0;
        const [lon1, lat1] = toPickupCoordinates[0];
        const [lon2, lat2] = toPickupCoordinates[toPickupCoordinates.length - 1];
        return haversineKm(lat1, lon1, lat2, lon2);
    }, [pickUpRoute, toPickupCoordinates]);

    const pickupLegDurationMinutes = useMemo(() => {
        if (pickUpRoute?.duration != null) return pickUpRoute.duration;
        const estimate = (distanceToPickupKm / 28) * 60;
        return Math.min(3, Math.max(0.6, estimate));
    }, [pickUpRoute, distanceToPickupKm]);

    const handlePickupLegComplete = useCallback(() => {
        setPickupLegComplete(true);
    }, []);
    const handleTripLegComplete = useCallback(() => {
        setTripCompleted(true);
    }, []);

    useEffect(() => {
        if (tripStarted) {
            setShouldShowPickupRoute(false);
            setActiveRouteCoordinates(dropoffCoordinates?.length ? dropoffCoordinates : toPickupCoordinates);
        } else {
            setShouldShowPickupRoute(true);
            setActiveRouteCoordinates(toPickupCoordinates);
        }
    }, [tripStarted, dropoffCoordinates, toPickupCoordinates]);

    const {
        carPosition: carPositionToPickup,
        carBearing: carBearingToPickup,
        etaMinutes: etaToPickupMinutes,
    } = useCarAnimation(toPickupCoordinates, handlePickupLegComplete, pickupLegDurationMinutes);

    const {
        carPosition: carPositionTrip,
        carBearing: carBearingTrip,
        progressPct: tripProgressPct,
        etaMinutes: tripEtaMinutes,
    } = useCarAnimation(
        tripStarted ? dropoffCoordinates : null,
        handleTripLegComplete,
        duration
    );

    const activeCarPosition = tripStarted ? carPositionTrip : carPositionToPickup;
    const activeCarBearing = tripStarted ? carBearingTrip : carBearingToPickup;
    const shouldRenderPickupInfo = !tripStarted && !pickupLegComplete;

    const pickupSheetRef = useRef(null);
    const lastFollowUpdateRef = useRef(0);

    useEffect(() => {
        openPickupSheet();
    }, []);

    useEffect(() => {
        if (pickupLegComplete && !tripStarted) {
            openPickupSheet();
        }
    }, [pickupLegComplete, tripStarted]);

    const openPickupSheet = () => pickupSheetRef.current?.open();

    const onMapLoaded = useCallback(() => {
        setMapLoaded(true);
        if (cameraInitDone.current) return;
        cameraInitDone.current = true;

        if (!activeCarPosition) {
            cameraRef.current?.jumpTo({
                center: toGeoCoord(DEFAULT_CENTER),
                zoom: 13,
            });
        }
    }, [activeCarPosition]);

    // ── Smooth Live Follow Camera + Correct Vehicle Direction ───────────
    useEffect(() => {
        if (!mapLoaded || !activeCarPosition) return;

        const now = Date.now();
        if (now - lastFollowUpdateRef.current < FOLLOW_UPDATE_INTERVAL_MS) return;
        lastFollowUpdateRef.current = now;

        cameraRef.current?.easeTo({
            center: activeCarPosition,
            zoom: FOLLOW_ZOOM,
            bearing: activeCarBearing,        // Map rotation
            pitch: FOLLOW_PITCH,
            duration: 400,
        });
    }, [activeCarPosition, activeCarBearing, mapLoaded]);

    const routeGeoJson = useMemo(() => {
        const legCoordinates = activeRouteCoordinates ?? (tripStarted ? dropoffCoordinates : toPickupCoordinates);
        if (!legCoordinates || legCoordinates.length < 2) return null;
        return {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: legCoordinates },
        };
    }, [activeRouteCoordinates, tripStarted, dropoffCoordinates, toPickupCoordinates]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <MapView
                    style={styles.map}
                    mapStyle={MAP_STYLE}
                    onDidFinishLoadingMap={onMapLoaded}
                >
                    <Camera ref={cameraRef} />

                    {mapLoaded && (
                        <>
                            {routeGeoJson && (
                                <>
                                    <ShapeSource id="routeShadow" data={routeGeoJson}>
                                        <Layer
                                            type="line"
                                            id="routeShadowLayer"
                                            style={{
                                                lineColor: 'rgba(0,0,0,0.13)',
                                                lineWidth: 10,
                                                lineCap: 'round',
                                                lineJoin: 'round',
                                            }}
                                        />
                                    </ShapeSource>
                                    <ShapeSource id="routeLine" data={routeGeoJson}>
                                        <Layer
                                            type="line"
                                            id="routeLineLayer"
                                            style={{
                                                lineColor: '#2563eb',
                                                lineWidth: 6,
                                                lineCap: 'round',
                                                lineJoin: 'round',
                                                lineOpacity: 0.95,
                                            }}
                                        />
                                    </ShapeSource>
                                </>
                            )}

                            {pickup && (
                                <MarkerView coordinate={toGeoCoord(pickup)} anchor={{ x: 0.5, y: 1 }}>
                                    <View style={styles.pickupMarker}>
                                        <View style={styles.pickupMarkerDot} />
                                    </View>
                                </MarkerView>
                            )}

                            {dropoff && (
                                <MarkerView coordinate={toGeoCoord(dropoff)} anchor={{ x: 0.5, y: 1 }}>
                                    <View style={styles.dropoffMarker}>
                                        <Text style={{ fontSize: 22 }}>📍</Text>
                                    </View>
                                </MarkerView>
                            )}

                            {/* Car Marker - bearing passed correctly */}
                            {activeCarPosition && (
                                <CarAnimatedMarker
                                    position={activeCarPosition}
                                    bearing={activeCarBearing}
                                />
                            )}
                        </>
                    )}
                </MapView>

                {shouldRenderPickupInfo && !arrivedAtPickup && activeCarPosition && (
                    <View style={styles.infoBox}>
                        <View style={styles.infoIcon}>
                            <MaterialDesignIcons name='location-on' size={20} color={colors.primaryColor} />
                        </View>
                        <View style={styles.infoText}>
                            <Text style={styles.infoTitle}>To Pick-up</Text>
                            <Text style={styles.infoSubtitle}>
                                {Math.max(1, Math.round(etaToPickupMinutes ?? 0))} min • {distanceToPickupKm.toFixed(1)} km
                            </Text>
                        </View>
                    </View>
                )}

                {tripStarted && (
                    <View style={styles.infoBox}>
                        <View style={styles.infoIcon}>
                            <MaterialDesignIcons name='location-on' size={20} color={colors.primaryColor} />
                        </View>
                        <View style={styles.infoText}>
                            <Text style={styles.infoTitle}>To Drop-off</Text>
                            <Text style={styles.infoSubtitle}>
                                {Math.max(1, Math.round(tripEtaMinutes ?? 0))} min • {(dropOffRoute?.distance ?? 0).toFixed(1)} km
                            </Text>
                        </View>
                    </View>
                )}

                <RideBottomSheet
                    ref={pickupSheetRef}
                    pickupAddress={pickup?.address || 'Mandume Ndemufayo Ave, Windhoek'}
                    dropoffAddress={dropoff?.address || 'Sam Nujoma Dr, Klein Windhoek, Namibia'}
                    progressPct={tripProgressPct}
                    etaMinutes={tripEtaMinutes}
                    onCall={() => console.log('Calling passenger...')}
                    onMessage={() => console.log('Opening chat...')}
                    onSubmitOtp={(otp) => console.log('OTP submitted:', otp)}
                    onArrivedAtPickup={() => setArrivedAtPickup(true)}
                    onTripStart={() => {
                        setTripStarted(true);
                        setShouldShowPickupRoute(false);
                        setActiveRouteCoordinates(dropoffCoordinates?.length ? dropoffCoordinates : toPickupCoordinates);
                    }}
                    onTripFinished={() => navigation?.goBack()}
                    pickupLegCompleted={pickupLegComplete}
                    tripStarted={tripStarted}
                    tripCompleted={tripCompleted}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
    },
    map: {
        flex: 1,
        minHeight: 500,
    },
    infoBox: {
        position: 'absolute',
        top: 60,
        marginHorizontal: 20,
        flexDirection: 'row',
        gap: 20,
        backgroundColor: colors.primaryColorOpacity,
        padding: 20,
        borderRadius: 15,
        width: '90%',
    },
    infoIcon: {
        width: 40,
        height: 40,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    infoSubtitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
    },
});