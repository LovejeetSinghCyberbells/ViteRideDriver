import React, {
    forwardRef,
    useImperativeHandle,
    useCallback,
    useRef,
    useState,
    useEffect,
} from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.58;
const ANIMATION_DURATION = 300;
const COUNTDOWN_SECONDS = 10;


const RideRequestSheet = forwardRef(
    (
        {
            earnings = '$24.50',
            pickupAddress = 'Mandume Ndemufayo Ave, Windhoek',
            dropoffAddress = 'Mandume Ndemufayo Ave, Windhoek',
            distance = '5.2 miles',
            duration = '12 min',
            countdownSeconds = COUNTDOWN_SECONDS,
            onAccept,
            onDecline,
            onTimeout,
        },
        ref
    ) => {
        const [visible, setVisible] = useState(false);
        const [countdown, setCountdown] = useState(countdownSeconds);

        const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
        const backdropAnim = useRef(new Animated.Value(0)).current;
        const countdownProgress = useRef(new Animated.Value(1)).current;
        const countdownTimer = useRef(null);
        const countdownAnim = useRef(null);

        const stopCountdown = () => {
            if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
                countdownTimer.current = null;
            }
            if (countdownAnim.current) {
                countdownAnim.current.stop();
            }
        };

        const startCountdown = useCallback(() => {
            setCountdown(countdownSeconds);
            countdownProgress.setValue(1);

            countdownAnim.current = Animated.timing(countdownProgress, {
                toValue: 0,
                duration: countdownSeconds * 1000,
                easing: Easing.linear,
                useNativeDriver: false,
            });
            countdownAnim.current.start();

            countdownTimer.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        stopCountdown();
                        animateOut(() => onTimeout && onTimeout());
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, [countdownSeconds]);

        const animateOut = useCallback((callback) => {
            stopCountdown();
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: SHEET_HEIGHT,
                    duration: ANIMATION_DURATION,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: ANIMATION_DURATION,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setVisible(false);
                callback && callback();
            });
        }, [translateY, backdropAnim]);

        const animateIn = useCallback(() => {
            translateY.setValue(SHEET_HEIGHT);
            backdropAnim.setValue(0);
            setVisible(true);
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: ANIMATION_DURATION,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: ANIMATION_DURATION,
                    useNativeDriver: true,
                }),
            ]).start(() => startCountdown());
        }, [translateY, backdropAnim, startCountdown]);

        useImperativeHandle(ref, () => ({
            open: animateIn,
            close: () => animateOut(),
        }), [animateIn, animateOut]);

        useEffect(() => () => stopCountdown(), []);

        const handleAccept = () => animateOut(() => onAccept && onAccept());
        const handleDecline = () => animateOut(() => onDecline && onDecline());

        const backdropColor = backdropAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
        });

        const ringBorderColor = countdownProgress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['#FF4444', '#F5A800', '#F5A800'],
        });

        return (
            <Modal
                visible={visible}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => animateOut()}
            >
                <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: backdropColor }]}>
                    <Pressable style={StyleSheet.absoluteFillObject} />
                </Animated.View>

                <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
                    <View style={styles.handleBar} />

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>New Ride Request</Text>
                        <View style={styles.countdownBadge}>
                            <MaterialDesignIcons name="access-time" size={14} color={colors.secondaryColor} />
                            <Text style={styles.countdownText}>{countdown}s</Text>
                        </View>
                    </View>

                    <View style={styles.earningsCard}>
                        <Text style={styles.earningsLabel}>You'll Earn</Text>
                        <Text style={styles.earningsAmount}>{earnings}</Text>
                    </View>

                    <View style={styles.locationRow}>
                        <View style={[styles.locationIconBg, { backgroundColor: '#E8F0FE' }]}>
                            <MaterialDesignIcons name="location-on" size={18} color="#3D5AFE" />
                        </View>
                        <View>
                            <Text style={styles.locationLabel}>Pick-up</Text>
                            <Text style={styles.locationAddress}>{pickupAddress}</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <View style={[styles.locationIconBg, { backgroundColor: '#FDECEA' }]}>
                            <MaterialDesignIcons name="navigation" size={18} color="#E53935" />
                        </View>
                        <View>
                            <Text style={styles.locationLabel}>Drop-off</Text>
                            <Text style={styles.locationAddress}>{dropoffAddress}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <View>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>{distance}</Text>
                        </View>
                        <View style={styles.statRight}>
                            <Text style={styles.statLabel}>Duration</Text>
                            <Text style={styles.statValue}>{duration}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.declineButton} onPress={handleDecline} activeOpacity={0.8}>
                            <Text style={styles.declineText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} activeOpacity={0.8}>
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Modal>
        );
    }
);

RideRequestSheet.displayName = 'RideRequestSheet';
export default RideRequestSheet;


const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
        backgroundColor:colors.primaryColor,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 30,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 24,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.lightGreyColor,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.whiteColor,
    },
    countdownBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.cardWhiteOpacity,
        borderWidth: 1,
        borderColor: colors.secondaryColor,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    countdownText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.secondaryColor,
    },
    earningsCard: {
        backgroundColor: colors.lightGreyColor,
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 24,
    },
    earningsLabel: {
        fontSize: 13,
        color: colors.blackColor,
        marginBottom: 4,
        fontWeight: '400',
    },
    earningsAmount: {
        fontSize: 36,
        fontWeight: '700',
        color: colors.primaryColor,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    locationIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationLabel: {
        fontSize: 11,
        color:colors.lightGreyColor,
        fontWeight: '400',
        marginBottom: 2,
    },
    locationAddress: {
        fontSize: 14,
        color: colors.whiteColor,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: colors.lightGreyColor,
        marginVertical: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statLabel: {
        fontSize: 12,
        color: colors.lightGreyColor,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.whiteColor,
    },
    statRight: {
        alignItems: 'flex-end',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    declineButton: {
        flex: 1,
        height: 52,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    declineText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.whiteColor,
    },
    acceptButton: {
        flex: 1,
        height: 52,
        borderRadius: 30,
        backgroundColor: colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    acceptText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryColor,
    },
});