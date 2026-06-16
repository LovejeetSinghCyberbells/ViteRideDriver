import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
import ReviewCard from '../../components/ReviewCard';

const SAMPLE_REVIEWS = [
    {
        id: '1',
        name: 'Chukwuemeka A.',
        tripCount: 9,
        date: 'Jun 5, 2026',
        rating: 5,
        comment: 'Driver was very punctual and the AC was working perfectly. No wahala at all, straight to the destination!',
        route: 'Victoria Island → Murtala Muhammed Airport',
    },
    {
        id: '2',
        name: 'Ngozi F.',
        tripCount: 14,
        date: 'Jun 1, 2026',
        rating: 4,
        comment: 'Good ride overall. The driver knew all the shortcuts to avoid Third Mainland Bridge traffic. Will book again.',
        route: 'Ikeja → Lekki Phase 1',
    },
    {
        id: '3',
        name: 'Babatunde O.',
        tripCount: 3,
        date: 'May 25, 2026',
        rating: 5,
        comment: 'Very professional driver. Car was neat and he even helped with my bags. Best ride experience in Lagos so far.',
        route: 'Surulere → Eko Atlantic',
    },
    {
        id: '4',
        name: 'Amaka I.',
        tripCount: 21,
        date: 'May 20, 2026',
        rating: 3,
        comment: 'Ride was okay but driver took a longer route through Ojuelegba. Would have preferred if he asked first.',
        route: 'Yaba → Apapa Port',
    },
    {
        id: '5',
        name: 'Emeka T.',
        tripCount: 6,
        date: 'May 15, 2026',
        rating: 5,
        comment: 'Smooth and safe ride. Driver was friendly and played good music. Arrived before the estimated time too!',
        route: 'Ajah → Onikan Stadium',
    },
];

export default function MyDetailsScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>My Details</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={require('../../assets/images/profile.png')}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.profileName}>Jenny Nolan</Text>
                    <Text style={styles.profileInfo}>Jenny@gmail.com</Text>
                    <Text style={styles.profileInfo}>+91 8256709876</Text>
                </View>

                <CommonButton
                    title={'Edit Profile'}
                    textColor={colors.whiteColor}
                    color={colors.secondaryColor}
                    style={styles.editButton}
                    isIcon={true}
                    iconColor={colors.whiteColor}
                    icon={'edit'}
                    onPress={()=>{navigation.navigate('EditProfileScreen')}}
                />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('ReviewsScreen') }}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.reviewsList}>
                    {SAMPLE_REVIEWS.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </View>
            </ScrollView>
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
        paddingBottom: 50,
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
    profileSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 105,
        height: 105,
        borderRadius: 16,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.whiteColor,
        marginTop: 10,
    },
    profileInfo: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
        color: colors.whiteColor,
        marginTop: 8,
    },
    editButton: {
        width: '50%',
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.whiteColor,
    },
    seeAll: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.secondaryColor,
    },
    reviewsList: {
        width: '100%',
        gap: 16,
        marginTop:20
    },
});