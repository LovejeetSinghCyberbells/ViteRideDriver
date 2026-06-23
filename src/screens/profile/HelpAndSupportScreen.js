import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

export default function HelpAndSupportScreen({ navigation }) {
    const handleContactSupport = () => {
        Linking.openURL('mailto:support@viteride.com?subject=Help%20Request');
    };

    const handleCallSupport = () => {
        Linking.openURL('tel:+911234567890'); // Replace with actual support number
    };

    const handleReportIssue = () => {
        Alert.alert(
            "Report an Issue",
            "Would you like to report a ride issue, driver behavior, or technical problem?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Report", onPress: () => navigation.navigate('ReportIssue') } // Adjust navigation as needed
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Identity / Welcome Block */}
                <View style={styles.identityBlock}>
                    <View style={styles.appIconWrapper}>
                        <MaterialDesignIcons name="help-outline" size={48} color={colors.whiteColor} />
                    </View>
                    <Text style={styles.appName}>Need Help?</Text>
                    <Text style={styles.appTagline}>We're here for you 24/7</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="support-agent" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Quick Contact</Text>
                    </View>
                    <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
                        <MaterialDesignIcons name="phone" size={20} color={colors.whiteColor} />
                        <Text style={styles.contactButtonText}>Call Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
                        <MaterialDesignIcons name="email" size={20} color={colors.whiteColor} />
                        <Text style={styles.contactButtonText}>Email Support</Text>
                    </TouchableOpacity>
                </View>

                {/* FAQs */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="question-answer" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    </View>
                    <Text style={styles.faqQuestion}>How do I cancel a ride?</Text>
                    <Text style={styles.sectionContent}>
                        You can cancel a ride from the trip details screen before the driver arrives. Cancellation fees may apply depending on timing.
                    </Text>

                    <Text style={styles.faqQuestion}>How do I track my ride?</Text>
                    <Text style={styles.sectionContent}>
                        Once matched, go to the "Current Ride" screen to see live driver location, ETA, and vehicle details.
                    </Text>

                    <Text style={styles.faqQuestion}>What should I do if I forgot something in the car?</Text>
                    <Text style={styles.sectionContent}>
                        Contact your driver through the in-app chat or reach out to support within 24 hours.
                    </Text>

                    <TouchableOpacity style={styles.linkRow}>
                        <Text style={styles.linkText}>View all FAQs →</Text>
                    </TouchableOpacity>
                </View>

                {/* Safety & Emergency */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="shield" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Safety & Emergency</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        Your safety is our priority. During any active ride, tap the SOS button on the ride screen to instantly connect with emergency services and share your location with trusted contacts.
                    </Text>
                </View>

                {/* Report Issue */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="report-problem" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>Report an Issue</Text>
                    </View>
                    <Text style={styles.sectionContent}>
                        Found a problem with a ride, driver behavior, payment, or the app? Let us know so we can fix it quickly.
                    </Text>
                    <TouchableOpacity style={styles.actionButton} onPress={handleReportIssue}>
                        <Text style={styles.actionButtonText}>Report Now</Text>
                    </TouchableOpacity>
                </View>

                {/* More Help */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionTitleRow}>
                        <MaterialDesignIcons name="info" size={18} color={colors.secondaryColor} />
                        <Text style={styles.sectionTitle}>More Help</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="email" size={16} color={colors.lightGreyColor} />
                        <Text style={styles.contactText}>support@viteride.com</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="phone" size={16} color={colors.lightGreyColor} />
                        <Text style={styles.contactText}>+91 12345 67890</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <MaterialDesignIcons name="language" size={16} color={colors.lightGreyColor} />
                        <Text style={[styles.contactText, styles.linkText]} onPress={() => Linking.openURL('https://www.viteride.com/help')}>
                            Help Center
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>We're here to help you ride with confidence.</Text>
                    <Text style={styles.footerSubText}>ViteRide Support Team</Text>
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
        marginBottom: 12,
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
        marginBottom: 12,
    },

    faqQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.whiteColor,
        marginTop: 12,
        marginBottom: 4,
    },

    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 14,
        borderRadius: 10,
        marginVertical: 6,
        gap: 10,
    },
    contactButtonText: {
        color: colors.whiteColor,
        fontWeight: '600',
        fontSize: 15,
    },

    actionButton: {
        backgroundColor: colors.secondaryColor,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    actionButtonText: {
        color: colors.whiteColor,
        fontWeight: '600',
        fontSize: 15,
    },

    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
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
    linkRow: {
        marginTop: 12,
    },

    footer: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 6,
    },
    footerText: {
        fontSize: 13,
        color: colors.lightGreyColor,
        textAlign: 'center',
    },
    footerSubText: {
        fontSize: 12,
        color: colors.lightGreyColor,
        opacity: 0.6,
    },
});