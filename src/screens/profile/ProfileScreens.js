import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import { GetProfile } from '../../app/features/profileSlice';
import { logout } from '../../app/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '../../components/Snackbar';
import { clearUserData } from '../../units/asyncStorageManager';

const APP_SETTINGS = [
    {
        icon: 'settings',
        title: 'App Preferences',
        navigateTo: 'AppPreferencesScreen'
    },
    {
        icon: 'help-outline',
        title: 'Help & Support',
        navigateTo: 'HelpAndSupportScreen'  
    },
    {
        icon: 'info-outline',
        title: 'About App',
        navigateTo: 'AboutAppScreen'
    },
];

const AppSettingCard = ({ icon, title, onPress }) => (
    <TouchableOpacity
        style={styles.settingCard}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <View style={styles.settingLeft}>
            <MaterialDesignIcons name={icon} size={20} color={colors.whiteColor} />
            <Text style={styles.settingTitle}>{title}</Text>
        </View>
        <MaterialDesignIcons
            name="arrow-forward-ios"
            size={16}
            color={colors.whiteColor}
        />
    </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
    const dispatch = useDispatch();
    const { profile, reviews, loading } = useSelector(state => state.profile);

    const [snack, setSnack] = useState({
        visible: false,
        type: 'default',
        title: '',
        message: '',
    });

    const showError = (message, title = 'Error') => {
        setSnack({ visible: true, type: 'error', title, message });
    };

    const fetchProfile = async () => {
        try {
            const result = await dispatch(GetProfile()).unwrap();

            if (!result || result?.success === false) {
                showError(
                    result?.message || 'Failed to load profile.',
                    'Profile Error'
                );
            }
        } catch (error) {
            showError(
                error?.message || 'Failed to load profile. Please try again.',
                'Profile Error'
            );
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);


    const handleLogout = async () => {
        try {
            await clearUserData();
            dispatch(logout());
        } catch (error) {
            console.log('Logout Error:', error);
        }
    };

    const activeVehicle = profile?.activeVehicle;

    return (
        <SafeAreaView style={styles.safeArea}>
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
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('MyDetailsScreen', {
                                profile,
                                reviews,
                            })
                        }
                        style={styles.profileCard}
                        activeOpacity={0.8}
                    >
                        <View style={styles.profileLeft}>
                            <View style={styles.profileImageContainer}>
                                <MaterialDesignIcons
                                    name="person-outline"
                                    size={32}
                                    color={colors.blueColor}
                                />
                            </View>

                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName} numberOfLines={1}>
                                    {profile?.name ?? 'User'}
                                </Text>
                                <Text style={styles.profileEmail} numberOfLines={1}>
                                    {profile?.email ?? '—'}
                                </Text>
                                <Text style={styles.profileRating}>
                                    ⭐️ {reviews?.averageRating ?? 0}{' '}
                                    <Text style={styles.profileRatingCount}>
                                        ({reviews?.totalReviews ?? 0} reviews)
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        <MaterialDesignIcons
                            name="arrow-forward-ios"
                            size={16}
                            color={colors.lightGreyColor}
                        />
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Vehicle</Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('VehicleListScreen')}
                        style={styles.vehicleCard}
                        activeOpacity={0.8}
                    >
                        <View style={styles.vehicleLeft}>
                            <View style={styles.vehicleIconContainer}>
                                <MaterialDesignIcons
                                    name="directions-car-filled"
                                    size={20}
                                    color={colors.yellowColor}
                                />
                            </View>
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleName} numberOfLines={1}>
                                    {activeVehicle
                                        ? `${activeVehicle.make ?? ''} ${activeVehicle.model ?? ''} ${activeVehicle.year ?? ''}`.trim()
                                        : 'No vehicle added'}
                                </Text>
                                <Text style={styles.vehiclePlate} numberOfLines={1}>
                                    {activeVehicle?.licensePlate ?? '—'}
                                </Text>
                            </View>
                        </View>

                        <MaterialDesignIcons
                            name="arrow-forward-ios"
                            size={16}
                            color={colors.lightGreyColor}
                        />
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>App Settings</Text>

                    {APP_SETTINGS.map((setting, index) => (
                        <AppSettingCard
                            key={index}
                            icon={setting.icon}
                            title={setting.title}
                            onPress={() => navigation.navigate(setting.navigateTo)}
                        />
                    ))}

                    <TouchableOpacity
                        style={styles.logoutContainer}
                        activeOpacity={0.8}
                        onPress={handleLogout}
                    >
                        <MaterialDesignIcons
                            name="logout"
                            size={20}
                            color={colors.redColor}
                        />
                        <Text style={[styles.settingTitle, { color: colors.redColor }]}>
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            )}

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
    },

    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryColor,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: '5%',
        backgroundColor: colors.primaryColor,
    },

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: '5%',
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 15,
    },

    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        marginRight: 10,
    },

    profileImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightBlueColor,
        flexShrink: 0,
    },

    profileInfo: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 2,
    },

    profileName: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.whiteColor,
    },

    profileEmail: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },

    profileRating: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },

    profileRatingCount: {
        fontSize: 12,
        color: colors.lightGreyColor,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 27,
        color: colors.whiteColor,
        marginTop: 30,
        marginBottom: 4,
    },

    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        padding: '5%',
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 15,
    },

    vehicleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
        marginRight: 10,
    },

    vehicleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightYellowColor,
        flexShrink: 0,
    },

    vehicleInfo: {
        flex: 1,
    },

    vehicleName: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
    },

    vehiclePlate: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },

    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        padding: '5%',
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.whiteColor,
    },

    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },

    settingTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
        flexShrink: 1,
    },

    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 60,
        padding: '5%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.redColor,
    },
});