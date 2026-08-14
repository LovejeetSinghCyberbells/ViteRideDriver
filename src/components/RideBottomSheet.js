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
    Keyboard,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';
import CommonButton from './CommonButton';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const OFFSCREEN_Y = SCREEN_HEIGHT;
const MAX_SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;
const SHEET_PADDING_BOTTOM = 30;
const ANIMATION_DURATION = 300;
const OTP_LENGTH = 6;

const STATUS = {
    ARRIVE_TO_PICKUP: 'arriveToPickUp',
    ARRIVED_AT_PICKUP: 'arrivedAtPickUp',
    TRIP_IN_PROGRESS: 'tripInProgress',
    FINISH_TRIP: 'finishTrip',
};

const STEPS = [
    { key: STATUS.ARRIVE_TO_PICKUP, label: 'Pickup' },
    { key: STATUS.ARRIVED_AT_PICKUP, label: 'Verify' },
    { key: STATUS.TRIP_IN_PROGRESS, label: 'En route' },
    { key: STATUS.FINISH_TRIP, label: 'Done' },
];
const STEP_INDEX = STEPS.reduce(
    (acc, step, i) => ({ ...acc, [step.key]: i }),
    {},
);

const RideBottomSheet = forwardRef((props, ref) => {
    const {
        pickupAddress,
        dropoffAddress,
        onCall,
        onMessage,
        onSubmitOtp,
        onArrivedAtPickup,
        onTripStart,
        onTripFinished,
        pickupLegCompleted = false,
        tripStarted = false,
        tripCompleted = false,
    } = props;

    const [visible, setVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState(STATUS.ARRIVE_TO_PICKUP);
    const [buttonTitle, setButtonTitle] = useState('Arrived at Pick-up');
    const [measuredContentHeight, setMeasuredContentHeight] = useState(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [otpKey, setOtpKey] = useState(0);

    // Keyboard height tracking
    useEffect(() => {
        const showEvent =
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent =
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSub = Keyboard.addListener(showEvent, e => {
            setKeyboardHeight(e.endCoordinates?.height ?? 0);
        });
        const hideSub = Keyboard.addListener(hideEvent, () =>
            setKeyboardHeight(0),
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const isPickupStage = status === STATUS.ARRIVE_TO_PICKUP;
    const isOtpStage = status === STATUS.ARRIVED_AT_PICKUP;
    const isTripActive =
        status === STATUS.TRIP_IN_PROGRESS || status === STATUS.FINISH_TRIP;

    const sheetTitle = isTripActive ? 'Drop-off Location' : 'Pick-up Location';
    const sheetAddress = isTripActive
        ? dropoffAddress || 'Sam Nujoma Dr, Klein Windhoek, Namibia'
        : pickupAddress || 'No address provided';
    const helperText = isOtpStage
        ? 'Enter the passenger OTP to start the trip.'
        : isTripActive
            ? 'Trip is in progress. Reach the destination and finish the ride.'
            : 'Arriving at the pickup point.';
    const activeStepIndex = STEP_INDEX[status] ?? 0;

    const translateY = useRef(new Animated.Value(OFFSCREEN_Y)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const otpInputRef = useRef(null);

    // Sync status from parent props
    useEffect(() => {
        if (tripCompleted) {
            setStatus(STATUS.FINISH_TRIP);
            setButtonTitle('Finish Trip');
        } else if (tripStarted) {
            setStatus(STATUS.TRIP_IN_PROGRESS);
            setButtonTitle('Trip in Progress');
        }
    }, [pickupLegCompleted, tripStarted, tripCompleted]);

    // Focus OTP input reliably when we enter OTP stage
    useEffect(() => {
        if (status === STATUS.ARRIVED_AT_PICKUP && visible) {
            const timer = setTimeout(() => {
                if (otpInputRef.current) {
                    otpInputRef.current.focus();
                }
            }, 450);
            return () => clearTimeout(timer);
        }
    }, [status, visible, otpKey]);

    const animateOut = useCallback(
        callback => {
            // Block closing while OTP is required or trip is active
            if (
                status === STATUS.ARRIVED_AT_PICKUP ||
                status === STATUS.TRIP_IN_PROGRESS
            ) {
                return;
            }

            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: OFFSCREEN_Y,
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
                setOtp('');
                callback?.();
            });
        },
        [translateY, backdropAnim, status],
    );

    const animateIn = useCallback(() => {
        setVisible(true);
        setOtp('');
        setMeasuredContentHeight(null);
        setOtpKey(k => k + 1);

        translateY.setValue(OFFSCREEN_Y);
        backdropAnim.setValue(0);

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
        ]).start();
    }, [translateY, backdropAnim]);

    useImperativeHandle(
        ref,
        () => ({
            open: animateIn,
            close: animateOut,
        }),
        [animateIn, animateOut],
    );

    const backdropColor = backdropAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
    });

    const handleMainButton = () => {
        if (status === STATUS.ARRIVE_TO_PICKUP) {
            setStatus(STATUS.ARRIVED_AT_PICKUP);
            setButtonTitle('Start Trip');
            onArrivedAtPickup?.();
            setOtpKey(k => k + 1);
            return;
        }

        if (status === STATUS.ARRIVED_AT_PICKUP) {
            if (otp.length !== OTP_LENGTH) return;
            onSubmitOtp?.(otp);
            onTripStart?.();
            setStatus(STATUS.TRIP_IN_PROGRESS);
            setButtonTitle('Trip in Progress');
            return;
        }

        if (status === STATUS.FINISH_TRIP) {
            onTripFinished?.();
            animateOut();
        }
    };

    const handleSubmitOtp = () => {
        if (otp.length !== OTP_LENGTH) return;
        onSubmitOtp?.(otp);
        onTripStart?.();
        setStatus(STATUS.TRIP_IN_PROGRESS);
        setButtonTitle('Trip in Progress');
    };

    const handleOtpChange = text =>
        setOtp(text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH));

    const focusOtp = useCallback(() => {
        // Force blur then focus – helps on some Android devices
        otpInputRef.current?.blur();
        setTimeout(() => {
            otpInputRef.current?.focus();
        }, 50);
    }, []);

    const handleContentLayout = useCallback(event => {
        const measured = event.nativeEvent.layout.height;
        setMeasuredContentHeight(prev => (prev === measured ? prev : measured));
    }, []);

    const sheetHeightStyle = measuredContentHeight
        ? {
            height: Math.min(
                measuredContentHeight + SHEET_PADDING_BOTTOM,
                MAX_SHEET_HEIGHT,
            ),
        }
        : { height: MAX_SHEET_HEIGHT };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={animateOut}
        >
            <View style={styles.container}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        { backgroundColor: backdropColor },
                    ]}
                >
                    {/* Only allow backdrop dismiss on the first stage */}
                    <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={
                            status === STATUS.ARRIVE_TO_PICKUP
                                ? animateOut
                                : undefined
                        }
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.sheet,
                        sheetHeightStyle,
                        {
                            bottom: keyboardHeight,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <View onLayout={handleContentLayout}>
                        <View style={styles.handleBar} />

                        {/* Stepper */}
                        <View style={styles.stepperRow}>
                            {STEPS.map((step, index) => {
                                const isComplete = index < activeStepIndex;
                                const isActive = index === activeStepIndex;
                                return (
                                    <React.Fragment key={step.key}>
                                        <View style={styles.stepperItem}>
                                            <View
                                                style={[
                                                    styles.stepDot,
                                                    (isComplete || isActive) &&
                                                    styles.stepDotFilled,
                                                ]}
                                            >
                                                {isComplete ? (
                                                    <MaterialDesignIcons
                                                        name="check"
                                                        size={12}
                                                        color={colors.primaryColor}
                                                    />
                                                ) : (
                                                    <Text
                                                        style={[
                                                            styles.stepDotText,
                                                            isActive &&
                                                            styles.stepDotTextActive,
                                                        ]}
                                                    >
                                                        {index + 1}
                                                    </Text>
                                                )}
                                            </View>
                                            <Text
                                                style={[
                                                    styles.stepLabel,
                                                    isActive &&
                                                    styles.stepLabelActive,
                                                ]}
                                            >
                                                {step.label}
                                            </Text>
                                        </View>
                                        {index < STEPS.length - 1 && (
                                            <View
                                                style={[
                                                    styles.stepConnector,
                                                    isComplete &&
                                                    styles.stepConnectorFilled,
                                                ]}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </View>

                        {status !== STATUS.FINISH_TRIP && (
                            <>
                                <Text style={styles.title}>{sheetTitle}</Text>
                                <Text style={styles.address}>{sheetAddress}</Text>
                                <Text style={styles.helperText}>{helperText}</Text>

                                {!isTripActive && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={onCall}
                                            activeOpacity={0.8}
                                        >
                                            <MaterialDesignIcons
                                                name="call"
                                                size={18}
                                                color={colors.blackColor}
                                            />
                                            <Text style={styles.actionButtonText}>
                                                Call
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={onMessage}
                                            activeOpacity={0.8}
                                        >
                                            <MaterialDesignIcons
                                                name="chat-bubble-outline"
                                                size={18}
                                                color={colors.blackColor}
                                            />
                                            <Text style={styles.actionButtonText}>
                                                Message
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}

                        {/* OTP Section */}
                        {status === STATUS.ARRIVED_AT_PICKUP && (
                            <View style={styles.otpSection}>
                                <Pressable style={styles.otpBoxRow} onPress={focusOtp}>
                                    {/* Visual boxes only – no TextInput inside this flex row */}
                                    <View style={styles.otpBoxesContainer}>
                                        {Array.from({ length: OTP_LENGTH }).map((_, i) => {
                                            const filled = otp.length > i;
                                            const isCursor = otp.length === i;
                                            return (
                                                <View
                                                    key={i}
                                                    style={[
                                                        styles.otpBox,
                                                        filled && styles.otpBoxFilled,
                                                        isCursor && styles.otpBoxCursor,
                                                    ]}
                                                >
                                                    <Text style={styles.otpBoxText}>
                                                        {otp[i] ?? ''}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    {/* Absolute overlay – does NOT participate in flex layout */}
                                    <TextInput
                                        key={otpKey}
                                        ref={otpInputRef}
                                        value={otp}
                                        onChangeText={handleOtpChange}
                                        keyboardType="number-pad"
                                        maxLength={OTP_LENGTH}
                                        style={styles.otpInputOverlay}
                                        autoFocus={true}
                                        caretHidden={true}
                                        showSoftInputOnFocus={true}
                                        importantForAutofill="no"
                                        contextMenuHidden={true}
                                        selectTextOnFocus={false}
                                        blurOnSubmit={false}
                                    />
                                </Pressable>

                                <CommonButton
                                    title="Submit"
                                    textColor={colors.whiteColor}
                                    style={[
                                        styles.submitButton,
                                        otp.length !== OTP_LENGTH && styles.submitButtonDisabled,
                                    ]}
                                    onPress={handleSubmitOtp}
                                    disabled={otp.length !== OTP_LENGTH}
                                />
                            </View>
                        )}

                        {/* Main Status Button */}
                        {status !== STATUS.FINISH_TRIP && !isOtpStage && (
                            isPickupStage ? (
                                <TouchableOpacity
                                    style={[
                                        styles.arrivedButton,
                                        !pickupLegCompleted &&
                                        styles.arrivedButtonDisabled,
                                    ]}
                                    onPress={handleMainButton}
                                    activeOpacity={0.85}
                                    disabled={!pickupLegCompleted}
                                >
                                    <Text style={styles.arrivedText}>
                                        {buttonTitle}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.progressBar}>
                                    <MaterialDesignIcons
                                        name="directions-car"
                                        size={18}
                                        color={colors.whiteColor}
                                    />
                                    <Text style={styles.progressBarText}>
                                        {buttonTitle}
                                    </Text>
                                </View>
                            )
                        )}

                        {/* Finish Trip UI */}
                        {status === STATUS.FINISH_TRIP && (
                            <View style={styles.finishContainer}>
                                <View style={styles.finishHeader}>
                                    <View style={styles.driverInfo}>
                                        <View style={styles.avatar}>
                                            <MaterialDesignIcons
                                                name="person-outline"
                                                size={28}
                                                color={colors.primaryColor}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.driverName}>
                                                Finish
                                            </Text>
                                            <Text style={styles.vehicleText}>
                                                🚕 ABC 1234
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.callCircle}
                                        onPress={onCall}
                                    >
                                        <MaterialDesignIcons
                                            name="call"
                                            size={24}
                                            color={colors.primaryColor}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.divider} />

                                <Text style={styles.locationLabel}>
                                    Drop-off Location
                                </Text>
                                <Text style={styles.locationText}>
                                    {dropoffAddress ||
                                        'Sam Nujoma Dr, Klein Windhoek, Namibia'}
                                </Text>

                                <CommonButton
                                    title="Finish Trip"
                                    textColor={colors.primaryColor}
                                    style={{
                                        backgroundColor: colors.secondaryColor,
                                        marginTop: 35,
                                    }}
                                    onPress={handleMainButton}
                                />
                            </View>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
});

RideBottomSheet.displayName = 'RideBottomSheet';

export default RideBottomSheet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: MAX_SHEET_HEIGHT,
        backgroundColor: colors.primaryColor,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 30,
        shadowColor: colors.blackColor,
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 24,
    },
    handleBar: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.35)',
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 18,
    },

    // Stepper
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    stepperItem: {
        alignItems: 'center',
        width: 54,
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    stepDotFilled: {
        backgroundColor: colors.secondaryColor,
        borderColor: colors.secondaryColor,
    },
    stepDotText: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.6)',
    },
    stepDotTextActive: {
        color: colors.primaryColor,
    },
    stepLabel: {
        marginTop: 6,
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.55)',
        textAlign: 'center',
    },
    stepLabelActive: {
        color: colors.whiteColor,
        fontWeight: '700',
    },
    stepConnector: {
        flex: 1,
        height: 1.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: 12,
        marginHorizontal: -4,
    },
    stepConnectorFilled: {
        backgroundColor: colors.secondaryColor,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.whiteColor,
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
        marginBottom: 8,
    },
    helperText: {
        fontSize: 13,
        fontWeight: '400',
        color: colors.whiteColor,
        opacity: 0.8,
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        borderRadius: 12,
        borderWidth: 1.5,
        backgroundColor: colors.whiteColor,
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.blackColor,
    },

    // --- OTP ---
    otpSection: {
        marginBottom: 12,
    },
    otpBoxRow: {
        height: 52,                 // fixed height
        marginBottom: 16,
        position: 'relative',
    },
    otpBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 52,
    },
    otpBox: {
        width: 44,
        height: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        flexShrink: 0,              // never shrink
    },
    otpBoxFilled: {
        borderColor: colors.secondaryColor,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    otpBoxCursor: {
        borderColor: colors.whiteColor,
    },
    otpBoxText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.whiteColor,
    },
    otpInputOverlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.01,
        color: 'transparent',
        backgroundColor: 'transparent',
        zIndex: 10,
    },
    submitButton: {
        height: 52,
        borderRadius: 30,
        backgroundColor: colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.4,
    },

    arrivedButton: {
        height: 52,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    arrivedButtonDisabled: {
        borderColor: 'rgba(255,255,255,0.25)',
    },
    arrivedText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.secondaryColor,
    },
    progressBar: {
        height: 52,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    progressBarText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.whiteColor,
        opacity: 0.85,
    },

    // Finish
    finishContainer: {
        marginTop: 4,
    },
    finishHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    driverName: {
        fontSize: 22,
        fontWeight: '600',
        color: colors.whiteColor,
    },
    vehicleText: {
        fontSize: 16,
        color: colors.lightGreyColor,
        marginTop: 4,
    },
    callCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginVertical: 16,
    },
    locationLabel: {
        fontSize: 15,
        color: colors.lightGreyColor,
        marginBottom: 6,
    },
    locationText: {
        fontSize: 17,
        color: colors.whiteColor,
    },
});