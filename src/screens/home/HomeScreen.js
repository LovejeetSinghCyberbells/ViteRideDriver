import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonToggleSwitch from '../../components/CommonToggleSwitch';
import CommonButton from '../../components/CommonButton';
import RideRequestSheet from '../../components/RideRequestSheet';

const STATUS_DATA = [
    { icon: 'power-settings-new', title: "Earnings", data: '$148.75', bgColor: colors.lightGreenColor, iconColor: colors.greenColor },
    { icon: 'access-time', title: "Hours Online", data: '6.5h', bgColor: colors.lightBlueColor, iconColor: colors.blueColor },
    { icon: 'trending-up', title: "Trips", data: '8', bgColor: colors.lightPurpleColor, iconColor: colors.purpleColor },
];

const statusCard = ({ icon, title, data, bgColor, iconColor }) => (
    <View style={styles.summaryCard}>
        <View style={[styles.IconContainer, { backgroundColor: bgColor }]}>
            <MaterialDesignIcons name={icon} size={30} color={iconColor} />
        </View>
        <View style={styles.summaryTextColumn}>
            <Text style={styles.summaryText}>{title}</Text>
            <Text style={styles.summaryHighlight}>{data}</Text>
        </View>
    </View>
);

export default function HomeScreen({ navigation }) {
    const [enabled, setEnabled] = useState(true);
    const [online, setOnline] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const rideSheetRef = useRef(null);

    useEffect(() => {
        // const interval = setInterval(() => {
        setSheetOpen(true);
        rideSheetRef.current?.open();
        // }, 1 * 60 * 1000);

        return () => clearInterval();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={'bottom'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.container, sheetOpen && { backgroundColor: '#04040450' }]}>
                    <View style={styles.locationTopBar}>
                        <View style={styles.locationContainer}>
                            <MaterialDesignIcons name='location-on' size={50} color={colors.secondaryColor} />
                            <View style={styles.locationTextColumn}>
                                <Text style={styles.labelText}>Current Location</Text>
                                <Text style={styles.labelHighlight}>Mandume Ndemufayo Ave, Windhoek</Text>
                            </View>
                        </View>
                        <CommonToggleSwitch value={enabled} onValueChange={setEnabled} />
                    </View>

                    <View style={styles.statusBgContainer}>
                        <View style={styles.statusContainer}>
                            <View style={styles.powerIconConatiner}>
                                <MaterialDesignIcons name='power-settings-new' size={24} color={colors.whiteColor} />
                            </View>
                            <View style={styles.statusTextColumn}>
                                <Text style={styles.statusText}>You're {online ? "Online" : "Offline"}</Text>
                                <Text style={styles.statusHighlight}>Waiting for ride requests...</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.todaySummaryConatiner}>
                        <Text style={styles.todaySummaryText}>Today's Summary</Text>
                        {STATUS_DATA.map((item, index) => (
                            <View key={index} style={{ marginTop: 15 }}>
                                {statusCard(item)}
                            </View>
                        ))}
                        <View style={styles.mapConatiner} />
                    </View>

                    <CommonButton
                        title={online ? 'Go Offline' : 'Go Online'}
                        onPress={() => setOnline(!online)}
                        color={colors.secondaryColor}
                        textColor={colors.primaryColor}
                        style={{ marginTop: 40 }}
                    />
                </View>
            </ScrollView>

            <RideRequestSheet
                ref={rideSheetRef}
                earnings="$ 24.50"
                pickupAddress="Mandume Ndemufayo Ave, Windhoek"
                dropoffAddress="Mandume Ndemufayo Ave, Windhoek"
                distance="5.2 miles"
                duration="12 min"
                countdownSeconds={60}
                backdropOpacity={0.2}
                onAccept={() => {
                    setSheetOpen(false);
                    navigation.navigate('RideScreen');
                }}
                onDecline={() => {
                    setSheetOpen(false);
                    console.log('Declined');
                }}
                onTimeout={() => {
                    setSheetOpen(false);
                    console.log('Timed out');
                }}
            />
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
    },
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 20,
        paddingVertical: 60,
        justifyContent: 'center'
    },
    locationTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        alignItems: 'center'
    },
    locationTextColumn: {
        justifyContent: 'flex-start'
    },
    labelText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.secondaryColor,
    },
    labelHighlight: {
        fontSize: 12,
        color: colors.whiteColor,
        fontWeight: '400',
    },
    statusBgContainer: {
        backgroundColor: colors.cardWhiteOpacity,
        padding: 20,
        borderRadius: 12,
        marginTop: 40
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 20,
        alignItems: 'center'
    },
    powerIconConatiner: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: colors.secondaryColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusTextColumn: {
        justifyContent: 'flex-start'
    },
    statusText: {
        fontSize: 20,
        fontWeight: '500',
        color: colors.whiteColor,
        lineHeight: 30
    },
    statusHighlight: {
        fontSize: 14,
        color: colors.whiteColor,
        fontWeight: '400',
        lineHeight: 20
    },
    todaySummaryConatiner: {
        backgroundColor: colors.cardWhiteOpacity,
        justifyContent: 'center',
        padding: 20,
        borderRadius: 15,
        marginTop: 40
    },
    todaySummaryText: {
        fontSize: 18,
        color: colors.whiteColor,
        fontWeight: '500',
        lineHeight: 27
    },
    IconContainer: {
        width: 50,
        height: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    summaryTextColumn: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.borderColor,
        lineHeight: 20,
        alignSelf: 'flex-start'
    },
    summaryHighlight: {
        fontSize: 16,
        color: colors.blackColor,
        fontWeight: '400',
        lineHeight: 24,
        alignSelf: 'flex-start'
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: colors.whiteColor,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        padding: 20,
        borderRadius: 15,
    },
    mapConatiner: {
        height: 200,
        backgroundColor: colors.whiteColor,
        marginTop: 20,
        borderRadius: 15,
    }
});