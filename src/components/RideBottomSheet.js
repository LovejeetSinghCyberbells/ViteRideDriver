import React, { forwardRef, useImperativeHandle, useCallback, useRef, useState, useEffect } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.42;
const ANIMATION_DURATION = 300;

const STATUS = {
    ARRIVE_TO_PICKUP: 'arriveToPickUp',
    ARRIVED_AT_PICKUP: 'arrivedAtPickUp',
    START_TRIP: 'startTrip',
    FINISH_TRIP: 'finishTrip',
};

const RideBottomSheet = forwardRef((props, ref) => {
    const {
        pickupAddress,
        onCall,
        onMessage,
        onSubmitOtp,
        onTripFinished,
    } = props;

    const [visible, setVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [status, setStatus] = useState(STATUS.ARRIVE_TO_PICKUP);
    const [buttonTitle, setButtonTitle] = useState('Arrived at Pick-up');

    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
        open: animateIn,
        close: animateOut,
    }), []);

    const animateOut = useCallback((callback) => {
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
            setOtp('');
            callback?.();
        });
    }, [translateY, backdropAnim]);

    const animateIn = useCallback(() => {
        setVisible(true);
        setOtp('');
        setStatus(STATUS.ARRIVE_TO_PICKUP);
        setButtonTitle('Arrived at Pick-up');

        translateY.setValue(SHEET_HEIGHT);
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

    const backdropColor = backdropAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'],
    });

    // Main Button Handler
    const handleMainButton = () => {
        if (status === STATUS.ARRIVE_TO_PICKUP) {
            setStatus(STATUS.ARRIVED_AT_PICKUP);
            setButtonTitle('Start Trip');
        }
        else if (status === STATUS.ARRIVED_AT_PICKUP) {
            setStatus(STATUS.FINISH_TRIP);
        } else if (status === STATUS.FINISH_TRIP) {
            onTripFinished?.();
            animateOut();
        }
    };

    const handleSubmitOtp = () => {
        if (otp.length === 6 && onSubmitOtp) {
            onSubmitOtp(otp);
            // Optional: Auto proceed to Start Trip after OTP
            // setStatus(STATUS.START_TRIP);
            // setButtonTitle('Finish Trip');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={animateOut}
        >
            <Animated.View style={[StyleSheet.absoluteFillObject, { backgroundColor: backdropColor }]}>
                <Pressable style={StyleSheet.absoluteFillObject} onPress={animateOut} />
            </Animated.View>

            <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
                {/* Handle */}
                <View style={styles.handleBar} />

                {status !== STATUS.FINISH_TRIP && (
                    <>
                        {/* Title & Address */}
                        <Text style={styles.title}>Pick-up Location</Text>
                        <Text style={styles.address}>{pickupAddress || 'No address provided'}</Text>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.actionButton} onPress={onCall} activeOpacity={0.8}>
                                <MaterialDesignIcons name="call" size={18} color={colors.blackColor} />
                                <Text style={styles.actionButtonText}>Call</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={onMessage} activeOpacity={0.8}>
                                <MaterialDesignIcons name="chat-bubble-outline" size={18} color={colors.blackColor} />
                                <Text style={styles.actionButtonText}>Message</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* OTP Input - Show only after arriving */}
                {(status === STATUS.ARRIVED_AT_PICKUP || status === STATUS.START_TRIP) && (
                    <View style={styles.otpRow}>
                        <TextInput
                            style={styles.otpInput}
                            placeholder="Enter OTP"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                        <CommonButton
                            title="Submit"
                            textColor={colors.whiteColor}
                            style={[
                                styles.submitButton,
                                {
                                    backgroundColor:
                                        status === STATUS.START_TRIP
                                            ? colors.primaryColor
                                            : colors.secondaryColor,
                                },
                            ]} />
                    </View>
                )}

                {/* Main Status Button */}
                {status !== STATUS.FINISH_TRIP && (
                    status === STATUS.ARRIVE_TO_PICKUP ? (
                        <TouchableOpacity
                            style={styles.arrivedButton}
                            onPress={handleMainButton}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.arrivedText}>
                                Arrived at Pick-up
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <CommonButton
                            title={buttonTitle}
                            textColor={colors.primaryColor}
                            style={{
                                backgroundColor: colors.secondaryColor,
                            }}
                            onPress={handleMainButton}
                        />
                    )
                )}

                {status === STATUS.FINISH_TRIP && (
                    <View style={styles.finishContainer}>
                        {/* Driver Header */}
                        <View style={styles.finishHeader}>
                            <View style={styles.driverInfo}>
                                <View style={styles.avatar}>
                                    <MaterialDesignIcons
                                        name="person-outline"
                                        size={28}
                                        color={colors.greyColor}
                                    />
                                </View>

                                <View>
                                    <Text style={styles.driverName}>Finish</Text>
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
                            Sam Nujoma Dr, Klein Windhoek, Namibia
                        </Text>

                        <View style={{ marginTop: 30 }}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressTitle}>
                                    Trip in Progress
                                </Text>

                                <Text style={styles.progressTime}>
                                    5 min
                                </Text>
                            </View>

                            <View style={styles.progressTrack}>
                                <View style={styles.progressFill} />
                            </View>
                        </View>

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
            </Animated.View>
        </Modal>
    );
});

RideBottomSheet.displayName = 'RideBottomSheet';

export default RideBottomSheet;

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
        backgroundColor: colors.cardWhiteOpacity,
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
        backgroundColor: colors.lightGreyColor,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
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
    otpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    otpInput: {
        flex: 1,
        height: 52,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: colors.whiteColor,
        paddingHorizontal: 20,
        fontSize: 15,
        color: colors.whiteColor,
        backgroundColor: 'transparent',
    },
    submitButton: {
        height: 52,
        width: 130,
        paddingHorizontal: 28,
        borderRadius: 30,
        backgroundColor: colors.secondaryColor, // your yellow/orange color
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.whiteColor,
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
    arrivedText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.secondaryColor,
    },


    finishContainer: {
        marginTop: 10,
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
        backgroundColor: 'rgba(255,255,255,0.4)',
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

    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    progressTitle: {
        fontSize: 15,
        color: colors.lightGreyColor,
    },

    progressTime: {
        fontSize: 16,
        color: colors.whiteColor,
    },

    progressTrack: {
        height: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
    },

    progressFill: {
        width: '60%',
        height: '100%',
        backgroundColor: colors.whiteColor,
    },
});