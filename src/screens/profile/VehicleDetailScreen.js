import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';

export default function VehicleDetailScreen({ navigation, route }) {
    const { vehicle } = route.params;
    const {
        vehicleType,
        carNo,
        vehicleCompany,
        vehicleModel,
        vehiclePhoto,
        vehicleColor,
    } = vehicle;

    const getVehicleIcon = () => {
        const type = vehicleType?.toLowerCase();
        if (type === 'bike') return 'two-wheeler';
        if (type === 'suv') return 'airport-shuttle';
        return 'directions-car';
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Vehicle Details</Text>
                <View />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Photo */}
                <View style={styles.heroContainer}>
                    {vehiclePhoto ? (
                        <Image source={{ uri: vehiclePhoto }} style={styles.heroImage} />
                    ) : (
                        <View style={styles.heroPlaceholder}>
                            <MaterialDesignIcons name={getVehicleIcon()} size={64} color={colors.secondaryColor} />
                        </View>
                    )}
                    <View style={styles.typeBadge}>
                        <MaterialDesignIcons name={getVehicleIcon()} size={13} color={colors.secondaryColor} />
                        <Text style={styles.typeBadgeText}>{vehicleType}</Text>
                    </View>
                </View>

                {/* Vehicle Name */}
                <View style={styles.nameSection}>
                    <Text style={styles.vehicleName}>{vehicleCompany} {vehicleModel}</Text>
                    <View style={styles.platePill}>
                        <Text style={styles.platePillText}>{carNo}</Text>
                    </View>
                </View>

                {/* Info Cards */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons name="business" size={18} color={colors.secondaryColor} />
                        </View>
                        <Text style={styles.infoLabel}>Company</Text>
                        <Text style={styles.infoValue}>{vehicleCompany}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons name="directions-car" size={18} color={colors.secondaryColor} />
                        </View>
                        <Text style={styles.infoLabel}>Model</Text>
                        <Text style={styles.infoValue}>{vehicleModel}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons name="category" size={18} color={colors.secondaryColor} />
                        </View>
                        <Text style={styles.infoLabel}>Type</Text>
                        <Text style={styles.infoValue}>{vehicleType}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <MaterialDesignIcons name="palette" size={18} color={colors.secondaryColor} />
                        </View>
                        <Text style={styles.infoLabel}>Color</Text>
                        <Text style={styles.infoValue}>{vehicleColor ?? 'N/A'}</Text>
                    </View>
                </View>

                {/* Plate Number Row */}
                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconBox}>
                            <MaterialDesignIcons name="confirmation-number" size={18} color={colors.secondaryColor} />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Plate Number</Text>
                            <Text style={styles.detailValue}>{carNo}</Text>
                        </View>
                        <View style={styles.verifiedBadge}>
                            <MaterialDesignIcons name="verified" size={14} color={colors.greenColor} />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    </View>
                </View>

                {/* Status Row */}
                <View style={styles.detailCard}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconBox}>
                            <MaterialDesignIcons name="radio-button-checked" size={18} color={colors.secondaryColor} />
                        </View>
                        <View style={styles.detailTextGroup}>
                            <Text style={styles.detailLabel}>Status</Text>
                            <Text style={styles.detailValue}>Active</Text>
                        </View>
                        <View style={styles.activeBadge}>
                            <View style={styles.activeDot} />
                            <Text style={styles.activeText}>In Use</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
                    <CommonButton title={'Remove Vehicle'} textColor={colors.redColor} color={colors.lightRedColor} isIcon={true}
                        icon={'delete'} iconColor={colors.redColor} style={{ width: '48%' }} />
                    <CommonButton title={'Edit Vehicle'} textColor={colors.whiteColor} color={colors.secondaryColor} isIcon={true}
                        icon={'edit'} iconColor={colors.whiteColor} style={{ width: '48%' }} onPress={()=>{navigation.navigate('AddVehicleScreen')}}/>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 60,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 16,
        marginTop: 20,
        paddingBottom: 50,
    },
    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    screenTitle: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '600',
        color: colors.whiteColor,
        flex: 1,
        textAlign: 'center',
    },

    // Hero
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

    // Name section
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
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
    },
    platePillText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.whiteColor,
        letterSpacing: 1.5,
    },

    // Info grid
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

    // Detail cards
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

    // Delete
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        backgroundColor: colors.lightRedColor,
        borderRadius: 14,
        paddingVertical: 14,
    },
    deleteText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.redColor,
    },
});