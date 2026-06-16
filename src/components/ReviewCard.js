import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

export default function ReviewCard({ review }) {
    const {
        name,
        tripCount,
        date,
        rating = 5,
        comment,
        route,
    } = review;

    const initials = name
        ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : '??';

    return (
        <View style={styles.card}>
            <View style={styles.cardTop}>
                <View style={styles.reviewer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View>
                        <Text style={styles.reviewerName}>{name}</Text>
                        <Text style={styles.reviewerSub}>
                            Rider{tripCount ? ` · ${tripCount} trips` : ''}
                        </Text>
                    </View>
                </View>
                <Text style={styles.date}>{date}</Text>
            </View>

            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                    <MaterialDesignIcons
                        key={i}
                        name={i <= rating ? 'star' : 'star-border'}
                        size={16}
                        color={i <= rating ? colors.secondaryColor : 'rgba(255,255,255,0.25)'}
                    />
                ))}
            </View>

            {comment ? (
                <Text style={styles.comment}>{comment}</Text>
            ) : null}

            {route ? (
                <>
                    <View style={styles.divider} />
                    <View style={styles.routeBadge}>
                        <MaterialDesignIcons
                            name="place"
                            size={13}
                            color="rgba(255,255,255,0.5)"
                        />
                        <Text style={styles.routeText}>{route}</Text>
                    </View>
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardWhiteOpacity,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        borderRadius: 16,
        padding: 16,
        gap: 10,
        width: '100%',
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reviewer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.whiteColor,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.whiteColor,
        lineHeight: 18,
    },
    reviewerSub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        lineHeight: 16,
        marginTop: 2,
    },
    date: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 3,
    },
    comment: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 20,
    },
    divider: {
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    routeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.15)',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
    },
    routeText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.55)',
    },
});