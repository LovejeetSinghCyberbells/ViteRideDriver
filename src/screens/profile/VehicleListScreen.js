import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import VehicleCard from '../../components/VehicleCard';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllVehicle } from '../../app/features/vehicleSlice';
import Snackbar from '../../components/Snackbar';

export default function VehicleListScreen({ navigation }) {
    const dispatch = useDispatch();
    const { vehicles, loading } = useSelector(state => state.vehicle);

    const [snack, setSnack] = useState({
        visible: false,
        type: 'default',
        title: '',
        message: '',
    });

    const showError = (message, title = 'Error') => {
        setSnack({ visible: true, type: 'error', title, message });
    };

    const fetchVehicles = async () => {
        try {
            await dispatch(GetAllVehicle()).unwrap();
        } catch (error) {
            showError(
                error?.message || 'Failed to load vehicles. Please try again.',
                'Vehicle Error'
            );
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

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
                <Text style={styles.screenTitle}>Vehicles</Text>
                <View style={styles.headerSpacer} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.blueColor} />
                </View>
            ) : (
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid
                    extraScrollHeight={30}
                    extraHeight={120}
                >
                    {vehicles?.length > 0 ? (
                        <View style={styles.vehicleList}>
                            {vehicles.map(vehicle => (
                                <TouchableOpacity
                                    key={vehicle._id}
                                    activeOpacity={0.85}
                                    onPress={() =>
                                        navigation.navigate(
                                            'VehicleDetailScreen',
                                            { vehicle }
                                        )
                                    }
                                >
                                    <VehicleCard vehicle={vehicle} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialDesignIcons
                                name="directions-car"
                                size={64}
                                color={colors.lightGreyColor}
                            />
                            <Text style={styles.emptyTitle}>No Vehicles Yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Tap the + button below to add your first vehicle.
                            </Text>
                        </View>
                    )}
                </KeyboardAwareScrollView>
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddVehicleScreen')}
                activeOpacity={0.85}
            >
                <MaterialDesignIcons
                    name="add"
                    size={28}
                    color={colors.primaryColor}
                />
            </TouchableOpacity>

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
        paddingBottom: 120,
    },

    vehicleList: {
        width: '100%',
        gap: 12,
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryColor,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: '10%',
        marginTop: '40%',
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.whiteColor,
        textAlign: 'center',
    },

    emptySubtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
        textAlign: 'center',
        lineHeight: 20,
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