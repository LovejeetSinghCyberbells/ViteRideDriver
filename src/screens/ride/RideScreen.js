import React, { useRef, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../common/Colors';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import RideBottomSheet from '../../components/RideBottomSheet';

export default function RideScreen({ navigation }) {
    const pickupSheetRef = useRef(null);

    useEffect(() => {
        openPickupSheet();
    }, []);

    const openPickupSheet = () => {
        pickupSheetRef.current?.open();
    };
    const closePickupSheet = () => {
        pickupSheetRef.current?.close();
    };
    return (
        <SafeAreaView style={styles.safeArea} edges={'bottom'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    source={require('../../assets/images/ride_bg.png')}
                    style={styles.container}
                    resizeMode="cover"
                >

                    <View style={{ flexDirection: 'row', gap: 20, backgroundColor: colors.appSettingCardWhiteOpacity, padding: 20, borderRadius: 15, width: '100%' }}>
                        <View style={{ width: 40, height: 40, backgroundColor: colors.appSettingCardWhiteOpacity, borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialDesignIcons
                                name='location-on'
                                size={20}
                                color={colors.primaryColor}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 20, color: colors.whiteColor }}>
                                To Pick-up
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 24, color: colors.whiteColor }}>
                                8 min • 2.1 miles</Text>
                        </View>
                    </View>

                    <RideBottomSheet
                        ref={pickupSheetRef}
                        pickupAddress="Mandume Ndemufayo Ave, Windhoek"
                        onCall={() => console.log('Calling passenger...')}
                        onMessage={() => console.log('Opening chat...')}
                        onSubmitOtp={(otp) => console.log('OTP submitted:', otp)}
                        onArrivedAtPickup={() => {
                            closePickupSheet();
                        }}
                        onTripFinished={() => navigation?.goBack()}
                    />

                </ImageBackground>
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
        paddingTop: 80,
        backgroundColor: colors.primaryColor,
    },
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
    },
    logoImage: {
        width: 254,
        height: 110,
    },
    labelText: {
        letterSpacing: 3,
        fontSize: 14,
        fontWeight: '300',
        color: 'white',
        marginTop: 12,
    },
    labelHighlight: {
        color: colors.secondaryColor,
    },
});