import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import VehicleCard from '../../components/VehicleCard';
const SAMPLE_VEHICLES = [
    {
        id: '1',
        vehicleType: 'Sedan',
        carNo: 'LG 234 ABC',
        vehicleCompany: 'Toyota',
        vehicleModel: 'Camry',
        vehicleColor: 'White',
        vehiclePhoto: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    },
    {
        id: '2',
        vehicleType: 'SUV',
        carNo: 'AB 567 KJA',
        vehicleCompany: 'Honda',
        vehicleModel: 'CR-V',
        vehicleColor: 'Silver',
        vehiclePhoto: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    },
    {
        id: '3',
        vehicleType: 'Hatchback',
        carNo: 'KN 891 EFG',
        vehicleCompany: 'Hyundai',
        vehicleModel: 'i20',
        vehicleColor: 'Blue',
        vehiclePhoto: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
    },
    {
        id: '4',
        vehicleType: 'Bike',
        carNo: 'OY 112 MNO',
        vehicleCompany: 'Bajaj',
        vehicleModel: 'Boxer',
        vehicleColor: 'Red',
        vehiclePhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    },
    {
        id: '5',
        vehicleType: 'SUV',
        carNo: 'PH 445 XYZ',
        vehicleCompany: 'Toyota',
        vehicleModel: 'Highlander',
        vehicleColor: 'Black',
        vehiclePhoto: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400',
    },
    {
        id: '6',
        vehicleType: 'Sedan',
        carNo: 'RV 678 GHI',
        vehicleCompany: 'Mercedes',
        vehicleModel: 'E-Class',
        vehicleColor: 'Black',
        vehiclePhoto: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    },
    {
        id: '7',
        vehicleType: 'SUV',
        carNo: 'EN 321 JKL',
        vehicleCompany: 'Ford',
        vehicleModel: 'Explorer',
        vehicleColor: 'Grey',
        vehiclePhoto: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?w=400',
    },
    {
        id: '8',
        vehicleType: 'Hatchback',
        carNo: 'KD 754 MNP',
        vehicleCompany: 'Volkswagen',
        vehicleModel: 'Golf',
        vehicleColor: 'White',
        vehiclePhoto: 'https://images.unsplash.com/photo-1541443131876-6e23b67e09f8?w=400',
    },
    {
        id: '9',
        vehicleType: 'Bike',
        carNo: 'OS 990 QRS',
        vehicleCompany: 'Honda',
        vehicleModel: 'CB300R',
        vehicleColor: 'Black',
        vehiclePhoto: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400',
    },
    {
        id: '10',
        vehicleType: 'Sedan',
        carNo: 'LA 103 TUV',
        vehicleCompany: 'BMW',
        vehicleModel: '3 Series',
        vehicleColor: 'Blue',
        vehiclePhoto: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    },
    {
        id: '11',
        vehicleType: 'SUV',
        carNo: 'AN 247 WXY',
        vehicleCompany: 'Lexus',
        vehicleModel: 'RX 350',
        vehicleColor: 'Pearl White',
        vehiclePhoto: 'https://images.unsplash.com/photo-1609752868372-47a0e43d5039?w=400',
    },
    {
        id: '12',
        vehicleType: 'Sedan',
        carNo: 'IM 588 ZAB',
        vehicleCompany: 'Kia',
        vehicleModel: 'Optima',
        vehicleColor: 'Silver',
        vehiclePhoto: 'https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?w=400',
    },
    {
        id: '13',
        vehicleType: 'Hatchback',
        carNo: 'BN 631 CDE',
        vehicleCompany: 'Nissan',
        vehicleModel: 'Micra',
        vehicleColor: 'Orange',
        vehiclePhoto: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
    },
    {
        id: '14',
        vehicleType: 'SUV',
        carNo: 'OG 872 FGH',
        vehicleCompany: 'Jeep',
        vehicleModel: 'Grand Cherokee',
        vehicleColor: 'Dark Grey',
        vehiclePhoto: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400',
    },
    {
        id: '15',
        vehicleType: 'Bike',
        carNo: 'PL 915 IJK',
        vehicleCompany: 'Yamaha',
        vehicleModel: 'MT-15',
        vehicleColor: 'Blue',
        vehiclePhoto: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=400',
    },
    {
        id: '16',
        vehicleType: 'Sedan',
        carNo: 'DL 159 LMN',
        vehicleCompany: 'Audi',
        vehicleModel: 'A4',
        vehicleColor: 'Glacier White',
        vehiclePhoto: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400',
    },
    {
        id: '17',
        vehicleType: 'SUV',
        carNo: 'KW 463 OPQ',
        vehicleCompany: 'Chevrolet',
        vehicleModel: 'Tahoe',
        vehicleColor: 'Black',
        vehiclePhoto: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400',
    },
    {
        id: '18',
        vehicleType: 'Hatchback',
        carNo: 'SO 714 RST',
        vehicleCompany: 'Suzuki',
        vehicleModel: 'Swift',
        vehicleColor: 'Red',
        vehiclePhoto: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=400',
    },
    {
        id: '19',
        vehicleType: 'Sedan',
        carNo: 'EB 826 UVW',
        vehicleCompany: 'Peugeot',
        vehicleModel: '508',
        vehicleColor: 'Magnetic Blue',
        vehiclePhoto: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400',
    },
    {
        id: '20',
        vehicleType: 'Bike',
        carNo: 'FC 999 XYZ',
        vehicleCompany: 'Kawasaki',
        vehicleModel: 'Ninja 400',
        vehicleColor: 'Lime Green',
        vehiclePhoto: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400',
    },
];

export default function VehicleListScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Vehicles</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.vehicleList}>
                    {SAMPLE_VEHICLES.map(vehicle => (
                        <TouchableOpacity
                            key={vehicle.id}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('VehicleDetailScreen', { vehicle })}
                        >
                            <VehicleCard vehicle={vehicle} />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddVehicleScreen')}
                activeOpacity={0.85}
            >
                <MaterialDesignIcons name="add" size={28} color={colors.primaryColor} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 60,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingBottom: 100,
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
    headerSpacer: {
        width: 24,
    },
    vehicleList: {
        width: '100%',
        gap: 12,
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