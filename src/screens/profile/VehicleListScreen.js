import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import VehicleCard from '../../components/VehicleCard';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllVehicle } from '../../app/features/vehicleSlice';

export default function VehicleListScreen({ navigation }) {
    const dispatch = useDispatch();
    const { vehicles, loading, error } = useSelector((state) => state.vehicle);



    useEffect(() => {
        dispatch(GetAllVehicle());
    }, [dispatch]);


    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color={colors.blueColor} style={{ flex: 1 }} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.redColor }}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Vehicles</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.vehicleList}>
                    {(vehicles ?? []).map(vehicle => (
                        <TouchableOpacity
                            key={vehicle._id}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('VehicleDetailScreen', { vehicle })}
                        >
                            <VehicleCard vehicle={vehicle} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddVehicleScreen',)}
                activeOpacity={0.85}
            >
                <MaterialDesignIcons name="add" size={28} color={colors.primaryColor} />
            </TouchableOpacity>
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
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingBottom: 100,
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
    headerSpacer: {
        width: 24,
    },
    vehicleList: {
        width: '100%',
        gap: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 50,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
});