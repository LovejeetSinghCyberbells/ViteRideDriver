import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '100';

export default function AboutAppScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity  activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>About App</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.identityBlock}>
                    <View style={styles.appIconWrapper}>
                        <MaterialDesignIcons name="directions-car" size={48} color={colors.whiteColor} />
                    </View>
                    <Text style={styles.appName}>ViteRide</Text>
                    <Text style={styles.appTagline}>Your ride, your way — fast & reliable.</Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>Version {APP_VERSION}  •  Build {BUILD_NUMBER}</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="info" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Overview</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        ViteRide is a modern ride-booking platform built to connect passengers with trusted, verified drivers in real time. Designed with speed, safety, and simplicity at its core — whether you're commuting daily, heading to the airport, or exploring a new city, ViteRide gets you there comfortably and on time.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="flag" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Our Mission</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        Our mission is to make urban mobility seamless, affordable, and accessible for everyone. We believe that reliable transportation should not be a privilege — it should be a right. ViteRide is our commitment to that belief, one ride at a time.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="help-outline" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>How It Works</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        Getting a ride with ViteRide is simple. Open the app, enter your destination, and choose a ride option that suits your need and budget. A nearby verified driver will be matched to you instantly, and you can track your ride in real time from pickup to drop-off.
                        {'\n\n'}
                        Once your ride is complete, payment is processed automatically through your saved method. You can then rate your driver and share feedback to help us maintain quality across the platform.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="shield" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Safety First</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        Your safety is our highest priority. Every driver on ViteRide undergoes a thorough background check and vehicle inspection before being approved on the platform. Our in-app SOS button gives you direct access to emergency services at any time during a ride.
                        {'\n\n'}
                        All rides are GPS-tracked and recorded. You can share your live trip with trusted contacts directly from the app. We continuously monitor platform activity to detect and act on any suspicious behavior.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="payments" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Payments & Pricing</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        ViteRide supports multiple payment methods including credit and debit cards, UPI, net banking, and cash. Fare estimates are provided upfront before you confirm your booking so there are no surprises.
                        {'\n\n'}
                        Pricing is based on distance, time, and current demand. During peak hours, surge pricing may apply and will always be clearly indicated before you book. All transaction records are accessible in your Payment History.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="drive-eta" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Driver Partnership</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        ViteRide partners with independent drivers who want to earn on their own schedule. We provide tools, support, and a steady stream of ride requests to help our driver partners grow their income.
                        {'\n\n'}
                        Interested in driving with ViteRide? Download the ViteRide Driver app and complete the registration process to get started. Our onboarding team is available to assist you at every step.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="devices" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Technology & Platform</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        ViteRide is available on Android and iOS. Our platform is built on a robust, scalable architecture designed to handle thousands of concurrent rides without performance degradation.
                        {'\n\n'}
                        We use end-to-end encryption for all user data, real-time GPS mapping for accurate tracking, and intelligent algorithms for fast and fair driver-rider matching. Our engineering team continuously ships updates to improve performance and introduce new features.
                    </Text>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="business" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>About the Company</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        ViteRide is developed and operated by ViteRide Inc., a technology company focused on next-generation mobility solutions. Founded in 2024, we are headquartered in Chandigarh, India, and currently serve multiple cities across the region.
                        {'\n\n'}
                        We are a team of engineers, designers, and mobility enthusiasts united by the goal of transforming how people move through their cities.
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="email" size={15} color={colors.lightGreyColor} />
                        <Text style={styles.contactText}>hello@viteride.com</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="support-agent" size={15} color={colors.lightGreyColor} />
                        <Text style={styles.contactText}>support@viteride.com</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="language" size={15} color={colors.lightGreyColor} />
                        <Text
                            style={[styles.contactText, styles.linkText]}
                            onPress={() => Linking.openURL('https://www.viteride.com')}
                        >
                            www.viteride.com
                        </Text>
                    </View>
                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="location-on" size={15} color={colors.lightGreyColor} />
                        <Text style={styles.contactText}>123 Mobility Lane, Chandigarh, IN 160062</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="gavel" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Legal</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        Use of ViteRide is subject to our Terms of Service and Privacy Policy. By using this application, you acknowledge that you have read and agree to these documents.
                        {'\n\n'}
                        ViteRide complies with applicable data protection laws including the Digital Personal Data Protection Act, 2023 (India). For legal inquiries, contact us at legal@viteride.com.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 ViteRide Inc. All rights reserved.</Text>
                    <Text style={styles.footerSubText}>Made with ♥ for riders everywhere</Text>
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

    identityBlock: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 10,
    },
    appIconWrapper: {
        width: 90,
        height: 90,
        borderRadius: 22,
        backgroundColor: colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    appName: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.whiteColor,
        marginBottom: 6,
    },
    appTagline: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
        marginBottom: 12,
    },
    versionBadge: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 20,
    },
    versionText: {
        fontSize: 12,
        color: colors.lightGreyColor,
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
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.whiteColor,
    },
    sectionContent: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 22,
        color: colors.lightGreyColor,
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical: 14,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    contactText: {
        fontSize: 13,
        color: colors.lightGreyColor,
        lineHeight: 20,
        flex: 1,
    },
    linkText: {
        color: colors.secondaryColor,
        textDecorationLine: 'underline',
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 16,
        gap: 6,
    },
    footerText: {
        fontSize: 12,
        color: colors.lightGreyColor,
        opacity: 0.6,
    },
    footerSubText: {
        fontSize: 12,
        color: colors.lightGreyColor,
        opacity: 0.4,
    },
});