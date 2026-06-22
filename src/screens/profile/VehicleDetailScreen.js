import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
import { useDispatch } from 'react-redux';
import Snackbar from '../../components/Snackbar';
import { DeleteVehicle } from '../../app/features/vehicleSlice';

export default function VehicleDetailScreen({ navigation, route }) {
    const { vehicle } = route.params ?? {};
    const {
        vehicleType,
        licensePlate,
        make,
        model,
        color,
        isActive,
        _id,
        vehiclePhoto,
    } = vehicle ?? {};

    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [snack, setSnack] = useState({
        visible: false,
        type: 'default',
        title: '',
        message: '',
    });

    const showError = (message, title = 'Error') => {
        setSnack({ visible: true, type: 'error', title, message });
    };

    const showSuccess = (message, title = 'Success') => {
        setSnack({ visible: true, type: 'success', title, message });
    };

    const getVehicleIcon = () => {
        const type = vehicleType?.toLowerCase();
        if (type === 'bike') return 'two-wheeler';
        if (type === 'suv') return 'airport-shuttle';
        return 'directions-car';
    };

    const handleDeleteVehicle = async () => {
        try {
            setDeleteLoading(true);

            const response = await dispatch(DeleteVehicle(_id)).unwrap();

            if (response?.success || response?.message) {
                showSuccess(
                    response?.message || 'Your vehicle has been removed.',
                    'Vehicle Deleted!'
                );
                setTimeout(() => navigation.goBack(), 1200);
            } else {
                showError(
                    response?.message || 'Failed to delete vehicle.',
                    'Delete Failed'
                );
            }
        } catch (error) {
            const message =
                typeof error === 'string'
                    ? error
                    : error?.message || 'Failed to delete vehicle. Please try again.';

            showError(message, 'Delete Failed');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MaterialDesignIcons
                        name="arrow-back-ios"
                        size={24}
                        color={colors.whiteColor}
                    />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Vehicle Details</Text>
                <View style={styles.headerSpacer} />
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={30}
                extraHeight={120}
            >
                <View style={styles.heroContainer}>
                    {vehiclePhoto ? (
                        <Image
                            source={{ uri: vehiclePhoto }}
                            style={styles.heroImage}
                        />
                    ) : (
                        <View style={styles.heroPlaceholder}>
                            <MaterialDesignIcons
                                name={getVehicleIcon()}
                                size={64}
                                color={colors.secondaryColor}
                            />
                        </View>
                    )}
                    <View style={styles.typeBadge}>
                        <MaterialDesignIcons
                            name={getVehicleIcon()}
                            size={13}
                            color={colors.secondaryColor}
                        />
                        <Text style={styles.typeBadgeText}>{vehicleType ?? '—'}</Text>
                    </View>
                </View>

                <View style={styles.nameSection}>
                    <Text style={styles.vehicleName} numberOfLines={1}>
                        {make} {model}
                    </Text>
                    <View style={styles.platePill}>
                        <Text style={styles.platePillText}>
                            {licensePlate ?? '—'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons
                                name="business"
                                size={18}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <Text style={styles.infoLabel}>Company</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {make ?? '—'}
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons
                                name="directions-car"
                                size={18}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <Text style={styles.infoLabel}>Model</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {model ?? '—'}
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons
                                name="category"
                                size={18}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <Text style={styles.infoLabel}>Type</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {vehicleType ?? '—'}
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons
                                name="palette"
                                size={18}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <Text style={styles.infoLabel}>Color</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {color ?? '—'}
                        </Text>
                    </View>
                </View>

                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconBox}>
                            <MaterialDesignIcons
                                name="confirmation-number"
                                size={18}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Plate Number</Text>
                            <Text style={styles.detailValue}>
                                {licensePlate ?? '—'}
                            </Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                            <MaterialDesignIcons
                                name="verified"
                                size={14}
                                color={colors.greenColor}
                            />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconBox}>
                            <MaterialDesignIcons
                                name="radio-button-checked"
                                size={18}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Status</Text>
                            <Text style={styles.detailValue}>
                                {isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.activeBadge,
                                !isActive && styles.inactiveBadge,
                            ]}
                        >
                            <View
                                style={[
                                    styles.activeDot,
                                    !isActive && styles.inactiveDot,
                                ]}
                            />
                            <Text
                                style={[
                                    styles.activeText,
                                    !isActive && styles.inactiveText,
                                ]}
                            >
                                {isActive ? 'In Use' : 'Not In Use'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <CommonButton
                        title="Remove Vehicle"
                        textColor={colors.redColor}
                        color={colors.lightRedColor}
                        isIcon
                        icon="delete"
                        iconColor={colors.redColor}
                        onPress={handleDeleteVehicle}
                        loading={deleteLoading}
                        style={styles.actionButton}
                    />
                    <CommonButton
                        title="Edit Vehicle"
                        textColor={colors.whiteColor}
                        color={colors.secondaryColor}
                        isIcon
                        icon="edit"
                        iconColor={colors.whiteColor}
                        style={styles.actionButton}
                        onPress={() =>
                            navigation.navigate('AddVehicleScreen', {
                                vehicle,
                                isEdit: true,
                            })
                        }
                    />
                </View>
            </KeyboardAwareScrollView>

            <Snackbar
                {...snack}
                onDismiss={() => setSnack(s => ({ ...s, visible: false }))}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 50,
    },

    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        marginBottom: 8,
    },

    screenTitle: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '600',
        color: colors.whiteColor,
        flex: 1,
        textAlign: 'center',
    },

    headerSpacer: {
        width: 24,
    },

    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: '5%',
        paddingTop: 20,
        paddingBottom: 50,
    },

    heroContainer: {
        width: '100%',
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
    },

    heroImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    heroPlaceholder: {
        flex: 1,
        backgroundColor: colors.cardWhiteOpacity,
        alignItems: 'center',
        justifyContent: 'center',
    },

    typeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.45)',
        borderWidth: 0.5,
        borderColor: 'rgba(255,188,0,0.4)',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },

    typeBadgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.secondaryColor,
    },

    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
    },

    vehicleName: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.whiteColor,
        flex: 1,
    },

    platePill: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 12,
        flexShrink: 0,
    },

    platePillText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.whiteColor,
        letterSpacing: 1.5,
    },

    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },

    infoCard: {
        width: '47.5%',
        backgroundColor: colors.cardWhiteOpacity,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        borderRadius: 14,
        padding: 14,
        gap: 6,
    },

    infoIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,188,0,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    infoLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.45)',
        marginTop: 4,
    },

    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.whiteColor,
    },

    detailCard: {
        backgroundColor: colors.cardWhiteOpacity,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    detailIconBox: {
        width: 40,
        height: 40,
        borderRadius: 11,
        backgroundColor: 'rgba(255,188,0,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    detailTextGroup: {
        flex: 1,
        gap: 2,
    },

    detailLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.45)',
    },

    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.whiteColor,
        letterSpacing: 0.5,
    },

    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.lightGreenColor,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexShrink: 0,
    },

    verifiedText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.greenColor,
    },

    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: colors.lightBlueColor,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        flexShrink: 0,
    },

    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.blueColor,
    },

    activeText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.blueColor,
    },

    inactiveBadge: {
        backgroundColor: colors.lightRedColor,
    },

    inactiveDot: {
        backgroundColor: colors.redColor,
    },

    inactiveText: {
        color: colors.redColor,
    },

    actionRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },

    actionButton: {
        flex: 1,
    },
});