import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
import ReviewCard from '../../components/ReviewCard';
import Snackbar from '../../components/Snackbar';

const SAMPLE_REVIEWS = [
    {
        id: '1',
        name: 'Chukwuemeka A.',
        tripCount: 9,
        date: 'Jun 5, 2026',
        rating: 5,
        comment:
            'Driver was very punctual and the AC was working perfectly. No wahala at all, straight to the destination!',
        route: 'Victoria Island → Murtala Muhammed Airport',
    },
    {
        id: '2',
        name: 'Ngozi F.',
        tripCount: 14,
        date: 'Jun 1, 2026',
        rating: 4,
        comment:
            'Good ride overall. The driver knew all the shortcuts to avoid Third Mainland Bridge traffic. Will book again.',
        route: 'Ikeja → Lekki Phase 1',
    },
    {
        id: '3',
        name: 'Babatunde O.',
        tripCount: 3,
        date: 'May 25, 2026',
        rating: 5,
        comment:
            'Very professional driver. Car was neat and he even helped with my bags. Best ride experience in Lagos so far.',
        route: 'Surulere → Eko Atlantic',
    },
    {
        id: '4',
        name: 'Amaka I.',
        tripCount: 21,
        date: 'May 20, 2026',
        rating: 3,
        comment:
            'Ride was okay but driver took a longer route through Ojuelegba. Would have preferred if he asked first.',
        route: 'Yaba → Apapa Port',
    },
    {
        id: '5',
        name: 'Emeka T.',
        tripCount: 6,
        date: 'May 15, 2026',
        rating: 5,
        comment:
            'Smooth and safe ride. Driver was friendly and played good music. Arrived before the estimated time too!',
        route: 'Ajah → Onikan Stadium',
    },
];

export default function MyDetailsScreen({ navigation, route }) {
    const { profile, reviews } = route.params ?? {};

    const [snack, setSnack] = useState({
        visible: false,
        type: 'default',
        title: '',
        message: '',
    });

    const showError = (message, title = 'Error') => {
        setSnack({ visible: true, type: 'error', title, message });
    };

    const handleEditProfile = () => {
        try {
            if (!profile) {
                showError('Profile data unavailable. Please try again.');
                return;
            }
            navigation.navigate('EditProfileScreen', { profile });
        } catch (error) {
            showError(
                error?.message || 'Failed to open edit screen.',
                'Navigation Error'
            );
        }
    };

    const handleSeeAllReviews = () => {
        try {
            navigation.navigate('ReviewsScreen');
        } catch (error) {
            showError(
                error?.message || 'Failed to open reviews.',
                'Navigation Error'
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <MaterialDesignIcons
                        name="arrow-back-ios"
                        size={24}
                        color={colors.whiteColor}
                    />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>My Details</Text>
                <View style={styles.headerSpacer} />
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={30}
                extraHeight={120}
            >
                <View style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={require('../../assets/images/profile.png')}
                            style={styles.profileImage}
                        />
                    </View>

                    <Text style={styles.profileName} numberOfLines={1}>
                        {profile?.name ?? 'User'}
                    </Text>

                    <Text style={styles.profileInfo} numberOfLines={1}>
                        {profile?.email ?? '—'}
                    </Text>

                    <Text style={styles.profileInfo}>
                        {profile?.phone ?? '—'}
                    </Text>
                </View>

                {reviews && (
                    <View style={styles.ratingRow}>
                        <MaterialDesignIcons
                            name="star"
                            size={18}
                            color={colors.yellowColor}
                        />
                        <Text style={styles.ratingText}>
                            {reviews?.averageRating ?? 0}
                        </Text>
                        <Text style={styles.ratingCount}>
                            ({reviews?.totalReviews ?? 0} reviews)
                        </Text>
                    </View>
                )}

                <CommonButton
                    title="Edit Profile"
                    textColor={colors.whiteColor}
                    color={colors.secondaryColor}
                    style={styles.editButton}
                    isIcon
                    iconColor={colors.whiteColor}
                    icon="edit"
                    onPress={handleEditProfile}
                />

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    <TouchableOpacity
                        onPress={handleSeeAllReviews}
                        activeOpacity={0.8}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.reviewsList}>
                    {SAMPLE_REVIEWS.length > 0 ? (
                        SAMPLE_REVIEWS.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No reviews yet.</Text>
                    )}
                </View>
            </KeyboardAwareScrollView>

            <Snackbar
                {...snack}
                onDismiss={() => setSnack(s => ({ ...s, visible: false }))}
            />
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
        paddingHorizontal: '5%',
        marginBottom: 8,
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

    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingTop: 20,
        paddingBottom: 50,
    },

    profileSection: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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
        marginTop: 12,
        maxWidth: '80%',
        textAlign: 'center',
    },

    profileInfo: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 18,
        color: colors.whiteColor,
        marginTop: 6,
        maxWidth: '80%',
        textAlign: 'center',
    },

    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 10,
    },

    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.whiteColor,
    },

    ratingCount: {
        fontSize: 13,
        fontWeight: '400',
        color: colors.lightGreyColor,
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
        marginTop: 28,
        marginBottom: 4,
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
        marginTop: 16,
    },

    emptyText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
        textAlign: 'center',
        marginTop: 20,
    },
});