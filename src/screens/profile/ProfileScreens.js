import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import { GetProfile } from '../../app/features/profileSlice';
import { useDispatch, useSelector } from 'react-redux';

const APP_SETTINGS = [
    {
        icon: 'settings',
        title: 'App Preferences',
    },
    {
        icon: 'help-outline',
        title: 'Help & Support',
    },
    {
        icon: 'info-outline',
        title: 'About App',
    },
];

const AppSettingCard = ({ icon, title }) => {
    return (
        <View style={styles.settingCard}>
            <View style={styles.settingLeft}>
                <MaterialDesignIcons
                    name={icon}
                    size={20}
                    color={colors.whiteColor}
                />
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <MaterialDesignIcons
                name="arrow-forward-ios"
                size={20}
                color={colors.whiteColor}
            />
        </View>
    );
};

export default function ProfileScreen({ navigation }) {
    const dispatch = useDispatch();
    const { profile, reviews, loading, error } = useSelector((state) => state.profile);
    


    useEffect(() => {
        dispatch(GetProfile());
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
        <SafeAreaView style={styles.safeArea} edges={'bottom'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity onPress={() => { navigation.navigate('MyDetailsScreen',{profile,reviews}) }} style={styles.profileCard} activeOpacity={0.8}>
                    <View style={styles.profileLeft}>
                        <View style={styles.profileImageContainer}>
                            <MaterialDesignIcons
                                name="person-outline"
                                size={32}
                                color={colors.blueColor}
                            />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{profile.name ?? 'user'} </Text>
                            <Text style={styles.profileEmail}>{profile.email ?? 'user@gmail.com'}</Text>
                            <Text style={styles.profileRating}>⭐️{reviews.averageRating ?? 0} ({reviews.totalReviews ?? 0} reviews)</Text>
                        </View>
                    </View>

                    <MaterialDesignIcons
                        name="arrow-forward-ios"
                        size={20}
                        color={colors.lightGreyColor}
                    />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Vehicle</Text>

                <TouchableOpacity onPress={() => { navigation.navigate('VehicleListScreen') }} style={styles.vehicleCard} activeOpacity={0.8}>
                    <View style={styles.vehicleLeft}>
                        <View style={styles.vehicleIconContainer}>
                            <MaterialDesignIcons
                                name="directions-car-filled"
                                size={20}
                                color={colors.yellowColor}
                            />
                        </View>
                        <View>
                            <Text style={styles.vehicleName}>Toyota Camry 2022</Text>
                            <Text style={styles.vehiclePlate}>ABC 1234</Text>
                        </View>
                    </View>

                    <MaterialDesignIcons
                        name="arrow-forward-ios"
                        size={20}
                        color={colors.lightGreyColor}
                    />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>App Settings</Text>

                {APP_SETTINGS.map((setting, index) => (
                    <AppSettingCard
                        key={index}
                        icon={setting.icon}
                        title={setting.title}
                    />
                ))}

                <View style={styles.logoutContainer}>
                    <MaterialDesignIcons
                        name='logout'
                        size={20}
                        color={colors.redColor}
                    />
                    <Text style={[styles.settingTitle, { color: colors.redColor }]}>Log Out</Text>
                </View>
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
        paddingHorizontal: 20,
        paddingVertical: 50,
        backgroundColor: colors.primaryColor,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 40,
        padding: 20,
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 15,
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    profileImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightBlueColor,
    },
    profileInfo: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 2,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '400',
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 27,
        color: colors.whiteColor,
        marginTop: 30,
    },
    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 20,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 15,
    },
    vehicleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    vehicleIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightYellowColor,
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
        marginTop: 20,
        padding: 20,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.whiteColor,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
    },
    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginTop: 80,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.redColor
    }
});