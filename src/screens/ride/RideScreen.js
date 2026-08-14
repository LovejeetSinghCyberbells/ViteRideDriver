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

const PHASE_CONFIG = {
    pickup: { label: 'Heading to pickup', icon: 'navigation' },
    verify: { label: 'Verifying passenger', icon: 'verified-user' },
    trip: { label: 'Trip in progress', icon: 'directions-car' },
    complete: { label: 'Trip complete', icon: 'check-circle' },
};

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

    const dropoffCoordinates = useMemo(
        () => dropOffRoute?.coordinates ?? [],
        [dropOffRoute?.coordinates],
    );
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
              ? [
                    pickup.longitude + DRIVER_START_OFFSET.lonDelta,
                    pickup.latitude + DRIVER_START_OFFSET.latDelta,
                ]
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
            setActiveRouteCoordinates(
                dropoffCoordinates?.length ? dropoffCoordinates : toPickupCoordinates,
            );
        } else {
            setShouldShowPickupRoute(true);
            setActiveRouteCoordinates(toPickupCoordinates);
        }
    }, [tripStarted, dropoffCoordinates, toPickupCoordinates]);

    const {
        carPosition: carPositionToPickup,
        carBearing: carBearingToPickup,
        etaMinutes: etaToPickupMinutes,
    } = useCarAnimation(
        toPickupCoordinates,
        handlePickupLegComplete,
        pickupLegDurationMinutes,
    );

    const {
        carPosition: carPositionTrip,
        carBearing: carBearingTrip,
        progressPct: tripProgressPct,
        etaMinutes: tripEtaMinutes,
    } = useCarAnimation(
        tripStarted ? dropoffCoordinates : null,
        handleTripLegComplete,
        duration,
    );

    const activeCarPosition = tripStarted ? carPositionTrip : carPositionToPickup;
    const activeCarBearing = tripStarted ? carBearingTrip : carBearingToPickup;
    const shouldRenderPickupInfo = !tripStarted && !pickupLegComplete;

    const phase = tripCompleted
        ? 'complete'
        : tripStarted
          ? 'trip'
          : arrivedAtPickup
            ? 'verify'
            : 'pickup';
    const phaseInfo = PHASE_CONFIG[phase];

    const showEtaChip =
        (shouldRenderPickupInfo && !arrivedAtPickup && activeCarPosition) ||
        (tripStarted && !tripCompleted);
    const etaMinutes = tripStarted ? tripEtaMinutes : etaToPickupMinutes;
    const etaDistanceKm = tripStarted
        ? (dropOffRoute?.distance ?? 0)
        : distanceToPickupKm;
    const etaLabel = tripStarted ? 'To drop-off' : 'To pick-up';

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

    useEffect(() => {
        if (!mapLoaded || !activeCarPosition) return;

        const now = Date.now();
        if (now - lastFollowUpdateRef.current < FOLLOW_UPDATE_INTERVAL_MS) return;
        lastFollowUpdateRef.current = now;

        cameraRef.current?.easeTo({
            center: activeCarPosition,
            zoom: FOLLOW_ZOOM,
            bearing: activeCarBearing,
            pitch: FOLLOW_PITCH,
            duration: 400,
        });
    }, [activeCarPosition, activeCarBearing, mapLoaded]);

    const routeGeoJson = useMemo(() => {
        const legCoordinates =
            activeRouteCoordinates ??
            (tripStarted ? dropoffCoordinates : toPickupCoordinates);
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
                                                lineColor: colors.primaryColor,
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
                                <MarkerView
                                    coordinate={toGeoCoord(pickup)}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <View style={styles.pickupMarker}>
                                        <View style={styles.pickupMarkerRing} />
                                        <View style={styles.pickupMarkerDot} />
                                    </View>
                                </MarkerView>
                            )}

                            {dropoff && (
                                <MarkerView
                                    coordinate={toGeoCoord(dropoff)}
                                    anchor={{ x: 0.5, y: 1 }}
                                >
                                    <View style={styles.dropoffMarker}>
                                        <MaterialDesignIcons
                                            name="place"
                                            size={20}
                                            color={colors.whiteColor}
                                        />
                                    </View>
                                    <View style={styles.dropoffMarkerStem} />
                                </MarkerView>
                            )}

                            {activeCarPosition && (
                                <CarAnimatedMarker
                                    position={activeCarPosition}
                                    bearing={activeCarBearing}
                                />
                            )}
                        </>
                    )}
                </MapView>

                <View style={styles.topOverlay} pointerEvents="none">
                    <View style={styles.statusChip}>
                        <MaterialDesignIcons
                            name={phaseInfo.icon}
                            size={16}
                            color={colors.whiteColor}
                        />
                        <Text style={styles.statusChipText} numberOfLines={1}>
                            {phaseInfo.label}
                        </Text>
                    </View>

                    {showEtaChip && (
                        <View style={styles.etaChip}>
                            <View style={styles.etaIconBadge}>
                                <MaterialDesignIcons
                                    name="location-on"
                                    size={16}
                                    color={colors.primaryColor}
                                />
                            </View>
                            <View>
                                <Text style={styles.etaTitle}>{etaLabel}</Text>
                                <Text style={styles.etaSubtitle}>
                                    {Math.max(1, Math.round(etaMinutes ?? 0))} min ·{' '}
                                    {etaDistanceKm.toFixed(1)} km
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                <RideBottomSheet
                    ref={pickupSheetRef}
                    pickupAddress={
                        pickup?.address || 'Mandume Ndemufayo Ave, Windhoek'
                    }
                    dropoffAddress={
                        dropoff?.address ||
                        'Sam Nujoma Dr, Klein Windhoek, Namibia'
                    }
                    progressPct={tripProgressPct}
                    etaMinutes={tripEtaMinutes}
                    onCall={() => console.log('Calling passenger...')}
                    onMessage={() => console.log('Opening chat...')}
                    onSubmitOtp={otp => console.log('OTP submitted:', otp)}
                    onArrivedAtPickup={() => setArrivedAtPickup(true)}
                    onTripStart={() => {
                        setTripStarted(true);
                        setShouldShowPickupRoute(false);
                        setActiveRouteCoordinates(
                            dropoffCoordinates?.length
                                ? dropoffCoordinates
                                : toPickupCoordinates,
                        );
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

    topOverlay: {
        position: 'absolute',
        top: 56,
        left: 16,
        right: 16,
        gap: 10,
    },
    statusChip: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.primaryColor,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 6,
    },
    statusChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.whiteColor,
        maxWidth: 220,
    },
    etaChip: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.primaryColor,
        paddingVertical: 8,
        paddingHorizontal: 10,
        paddingRight: 16,
        borderRadius: 16,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 6,
    },
    etaIconBadge: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    etaTitle: {
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 15,
        color: colors.whiteColor,
        opacity: 0.75,
    },
    etaSubtitle: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
        color: colors.whiteColor,
    },

    pickupMarker: {
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickupMarkerRing: {
        position: 'absolute',
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.secondaryColor,
        opacity: 0.28,
    },
    pickupMarkerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.secondaryColor,
        borderWidth: 2,
        borderColor: colors.whiteColor,
    },
    dropoffMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.whiteColor,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    dropoffMarkerStem: {
        alignSelf: 'center',
        width: 2,
        height: 8,
        backgroundColor: colors.primaryColor,
    },
});