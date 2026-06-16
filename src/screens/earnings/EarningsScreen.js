import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

const OVERVIEW_DATA = [
    {
        icon: 'calendar-today',
        iconColor: colors.blueColor,
        iconBgColor: colors.lightBlueColor,
        title: 'This Week ',
        amount: '$876.50',
        percentage: '+8.2%',
    },
    {
        icon: 'calendar-today',
        iconColor: colors.purpleColor,
        iconBgColor: colors.lightPurpleColor,
        title: 'This Month',
        amount: '$3,245.00',
        percentage: '+15.4%',
    },
    {
        icon: 'workspace-premium',
        iconColor: colors.redColor,
        iconBgColor: colors.lightRedColor,
        title: 'All Time',
        amount: '$24,567.00',
        percentage: '',
    },
];

const OverviewCard = ({ icon, iconColor, iconBgColor, title, amount, percentage }) => {
    return (
        <View style={styles.overviewCard}>
            <View style={styles.overviewLeft}>
                <View style={[styles.overviewIconContainer, { backgroundColor: iconBgColor }]}>
                    <MaterialDesignIcons
                        name={icon}
                        size={20}
                        color={iconColor}
                    />
                </View>
                <View>
                    <Text style={styles.overviewTitle}>{title}</Text>
                    <Text style={styles.overviewAmount}>{amount}</Text>
                </View>
            </View>

            {percentage ? (
                <Text style={styles.overviewPercentage}>{percentage}</Text>
            ) : null}
        </View>
    );
};

export default function EarningsScreen() {
    return (
        <SafeAreaView style={styles.safeArea} edges={'bottom'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.todayEarningsCard}>
                    <Text style={styles.todayLabel}>Today's Earnings</Text>
                    <Text style={styles.todayAmount}>$ 148.75</Text>
                    <View style={styles.growthContainer}>
                        <MaterialDesignIcons
                            name="trending-up"
                            size={24}
                            color={colors.secondaryColor}
                        />
                        <Text style={styles.growthText}>+12% from yesterday</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Overview</Text>

                {OVERVIEW_DATA.map((item, index) => (
                    <OverviewCard
                        key={index}
                        icon={item.icon}
                        iconColor={item.iconColor}
                        iconBgColor={item.iconBgColor}
                        title={item.title}
                        amount={item.amount}
                        percentage={item.percentage}
                    />
                ))}

                <Text style={styles.sectionTitle}>Today's Breakdown</Text>

                <View style={styles.breakdownCard}>
                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Trip Earnings</Text>
                        <Text style={styles.breakdownAmount}>$142.50</Text>
                    </View>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Tips</Text>
                        <Text style={styles.breakdownAmount}>$6.25</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Total</Text>
                        <Text style={styles.breakdownAmount}>$148.75</Text>
                    </View>
                </View>

                <View style={styles.nextPayoutCard}>
                    <Text style={styles.nextPayoutTitle}>Next Payout</Text>
                    <Text style={styles.nextPayoutDate}>
                        Monday, December 30 • $876.50
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
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical:50,
        backgroundColor: colors.primaryColor,
    },
    todayEarningsCard: {
        marginTop: 40,
        padding: 20,
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.whiteColor,
        gap: 10,
    },
    todayLabel: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    todayAmount: {
        fontSize: 56,
        fontWeight: '600',
        lineHeight: 80,
        color: colors.whiteColor,
    },
    growthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    growthText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.secondaryColor,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 27,
        color: colors.whiteColor,
        marginTop: 30,
    },
    overviewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 20,
        backgroundColor: colors.whiteColor,
        borderRadius: 15,
    },
    overviewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    overviewIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overviewTitle: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.borderColor,
    },
    overviewAmount: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.blackColor,
    },
    overviewPercentage: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.primaryColor,
    },
    breakdownCard: {
        marginTop: 20,
        padding: 20,
        backgroundColor: colors.whiteColor,
        borderRadius: 15,
        gap: 20,
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 20,
    },
    breakdownLabel: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.darkGrey,
    },
    breakdownAmount: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.blackColor,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.lightGreyColor,
    },
    nextPayoutCard: {
        marginTop: 20,
        padding: 20,
        backgroundColor: colors.lightBlueColor,
        borderRadius: 15,
        gap: 20,
    },
    nextPayoutTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.blackColor,
    },
    nextPayoutDate: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.blackColor,
    },
});