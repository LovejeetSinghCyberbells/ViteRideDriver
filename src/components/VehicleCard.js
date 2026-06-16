import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

export default function VehicleCard({ vehicle }) {
    const {
        vehicleType,
        carNo,
        vehicleCompany,
        vehicleModel,
        vehiclePhoto,
    } = vehicle;

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.photoBox}>
                    {vehiclePhoto ? (
                        <Image source={{ uri: vehiclePhoto }} style={styles.vehiclePhoto} />
                    ) : (
                        <MaterialDesignIcons name="directions-car" size={32} color={colors.secondaryColor} />
                    )}
                </View>

                <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>
                        {vehicleCompany} {vehicleModel}
                    </Text>
                    <Text style={styles.vehicleType}>{vehicleType}</Text>
                </View>

                <View style={styles.typeBadge}>
                    <MaterialDesignIcons
                        name={
                            vehicleType?.toLowerCase() === 'bike' ? 'two-wheeler' :
                            vehicleType?.toLowerCase() === 'suv' ? 'airport-shuttle' :
                            'directions-car'
                        }
                        size={14}
                        color={colors.secondaryColor}
                    />
                    <Text style={styles.typeBadgeText}>{vehicleType}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.plateRow}>
                <MaterialDesignIcons name="confirmation-number" size={16} color={'rgba(255,255,255,0.4)'} />
                <Text style={styles.plateLabel}>Plate Number</Text>
                <View style={styles.plateBadge}>
                    <Text style={styles.plateText}>{carNo}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardWhiteOpacity,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        borderRadius: 16,
        padding: 16,
        gap: 12,
        width: '100%',
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    photoBox: {
        width: 64,
        height: 64,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    vehiclePhoto: {
        width: 64,
        height: 64,
        borderRadius: 14,
    },
    vehicleInfo: {
        flex: 1,
        gap: 4,
    },
    vehicleName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.whiteColor,
        lineHeight: 20,
    },
    vehicleType: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 16,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,188,0,0.12)',
        borderWidth: 0.5,
        borderColor: 'rgba(255,188,0,0.3)',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.secondaryColor,
    },
    divider: {
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    plateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    plateLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.45)',
        flex: 1,
    },
    plateBadge: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    plateText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.whiteColor,
        letterSpacing: 1.5,
    },
});