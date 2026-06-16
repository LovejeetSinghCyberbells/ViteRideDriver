import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';


const RIDE_DATA = [
    {
        date: "Today",
        time: "9:15 AM",
        amount: "$18.75",
        from: "Downtown Plaza",
        to: "Central Mall",
        distance: "4.1 KM",
        timeToCoverDistance: "10 min"
    },
    {
        date: "Today",
        time: "11:45 AM",
        amount: "$32.20",
        from: "Airport Terminal",
        to: "Grand Hotel",
        distance: "8.7 KM",
        timeToCoverDistance: "18 min"
    },
    {
        date: "Today",
        time: "2:30 PM",
        amount: "$24.50",
        from: "123 Main St",
        to: "456 Market St",
        distance: "5.2 KM",
        timeToCoverDistance: "12 min"
    },
    {
        date: "Today",
        time: "4:10 PM",
        amount: "$15.90",
        from: "City Library",
        to: "Green Park",
        distance: "3.6 KM",
        timeToCoverDistance: "8 min"
    },
    {
        date: "Today",
        time: "7:25 PM",
        amount: "$41.80",
        from: "Riverfront Avenue",
        to: "Sunset Heights",
        distance: "11.3 KM",
        timeToCoverDistance: "22 min"
    }
];

const RideCard = ({ date, time, amount, from, to, distance, timeToCoverDistance }) => {
    return (
        <View style={styles.tripCard}>

            <View style={styles.cardHeader}>
                <View style={styles.dateTimeColumn}>
                    <Text style={styles.dateText}>{date}</Text>
                    <Text style={styles.timeText}>{time}</Text>
                </View>
                <Text style={styles.amountText}>{amount}</Text>
            </View>

            <View style={styles.locationsColumn}>
                <View style={styles.locationRow}>
                    <View style={[styles.locationIconBg, styles.locationIconBgGreen]}>
                        <MaterialDesignIcons name='location-on' size={20} color={colors.greenColor} />
                    </View>
                    <Text style={styles.locationText}>{from}</Text>
                </View>

                <View style={styles.locationRow}>
                    <View style={[styles.locationIconBg, styles.locationIconBgRed]}>
                        <MaterialDesignIcons name='location-on' size={20} color={colors.redColor} />
                    </View>
                    <Text style={styles.locationText}>{to}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <MaterialDesignIcons name='location-on' size={20} color={colors.whiteColor} />
                    <Text style={styles.statText}>{distance}</Text>
                </View>
                <View style={styles.statItem}>
                    <MaterialDesignIcons name='access-time' size={20} color={colors.whiteColor} />
                    <Text style={styles.statText}>{timeToCoverDistance}</Text>
                </View>
            </View>

        </View>
    )
}

export default function TripsScreen() {
    return (
        <SafeAreaView style={styles.safeArea} edges={'bottom'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {
                    RIDE_DATA.map((item, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <RideCard
                                date={item.date}
                                time={item.time}
                                amount={item.amount}
                                from={item.from}
                                to={item.to}
                                distance={item.distance}
                                timeToCoverDistance={item.timeToCoverDistance}
                            />
                        </View>
                    ))
                }
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
        paddingVertical: 60,
        paddingHorizontal:20,
        backgroundColor: colors.primaryColor,
    },
    tripCard: {
        backgroundColor: colors.cardWhiteOpacity,
        padding: 20,
        borderRadius: 10,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    dateTimeColumn: {
        flexDirection: 'column',
        gap: 4,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.lightGreyColor,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
    },

    locationsColumn: {
        flexDirection: 'column',
        gap: 10,
        marginTop: 30,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    locationIconBg: {
        width: 30,
        height: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationIconBgGreen: {
        backgroundColor: colors.lightGreenColor,
    },
    locationIconBgRed: {
        backgroundColor: colors.lightRedColor,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },

    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.whiteColor,
        marginTop: 30,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 30,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statText: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.whiteColor,
    },
});