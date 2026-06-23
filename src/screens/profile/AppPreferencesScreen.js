import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonToggleSwitch from '../../components/CommonToggleSwitch';

export default function AppPreferencesScreen({ navigation }) {
    const [preferences, setPreferences] = useState({
        pushNotifications: true,
        emailUpdates: true,
        appSound: true,
        vibration: true,
        darkMode: false,
    });

    const togglePreference = (key) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>App Preferences</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="notifications" size={20} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Notifications</Text>
                    </View>

                    <View style={styles.preferenceRow}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="chat" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Push Notifications</Text>
                        </View>
                        <CommonToggleSwitch
                            value={preferences.pushNotifications}
                            onValueChange={() => togglePreference('pushNotifications')}
                        />
                    </View>

                    <View style={styles.preferenceRow}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="email" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Email Updates</Text>
                        </View>
                        <CommonToggleSwitch
                            value={preferences.emailUpdates}
                            onValueChange={() => togglePreference('emailUpdates')}
                        />
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="volume-up" size={20} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Sound & Vibration</Text>
                    </View>

                    <View style={styles.preferenceRow}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="volume-up" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>App Sound</Text>
                        </View>
                        <CommonToggleSwitch
                            value={preferences.appSound}
                            onValueChange={() => togglePreference('appSound')}
                        />
                    </View>

                    <View style={styles.preferenceRow}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="vibration" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Vibration</Text>
                        </View>
                        <CommonToggleSwitch
                            value={preferences.vibration}
                            onValueChange={() => togglePreference('vibration')}
                        />
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="display-settings" size={20} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Display & Language</Text>
                    </View>

                    <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="language" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Language</Text>
                        </View>
                        <Text style={styles.valueText}>English</Text>
                        <MaterialDesignIcons name="arrow-forward-ios" size={16} color={colors.lightGreyColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="straighten" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Distance Unit</Text>
                        </View>
                        <Text style={styles.valueText}>Kilometers</Text>
                        <MaterialDesignIcons name="arrow-forward-ios" size={16} color={colors.lightGreyColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="security" size={20} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Privacy & Security</Text>
                    </View>

                    <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="lock" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Privacy Settings</Text>
                        </View>
                        <MaterialDesignIcons name="arrow-forward-ios" size={16} color={colors.lightGreyColor} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="history" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Clear Ride History</Text>
                        </View>
                        <MaterialDesignIcons name="arrow-forward-ios" size={16} color={colors.lightGreyColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="more-horiz" size={20} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>More</Text>
                    </View>

                    <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.8}>
                        <View style={styles.preferenceLeft}>
                            <MaterialDesignIcons name="delete-outline" size={20} color={colors.lightGreyColor} />
                            <Text style={styles.preferenceText}>Clear Cache</Text>
                        </View>
                        <MaterialDesignIcons name="arrow-forward-ios" size={16} color={colors.lightGreyColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Changes are saved automatically
                    </Text>
                </View>
            </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 50,
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    sectionCard: {
        backgroundColor: colors.cardColor ?? 'rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.whiteColor,
    },

    preferenceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    preferenceLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    preferenceText: {
        fontSize: 15,
        color: colors.whiteColor,
        fontWeight: '500',
    },
    valueText: {
        fontSize: 14,
        color: colors.lightGreyColor,
        marginRight: 8,
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 13,
        color: colors.lightGreyColor,
        opacity: 0.7,
    },
});