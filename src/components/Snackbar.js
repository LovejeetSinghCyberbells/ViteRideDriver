import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

const ICONS = {
    success: { name: 'check-circle', color: colors.greenColor},
    error: { name: 'error', color: colors.redColor },
    info: { name: 'info', color: colors.blueColor},
    default: { name: 'notifications', color: colors.secondaryColor },
};

const ACCENT = {
    success: colors.greenColor,
    error: colors.redColor,
    info: colors.blueColor,
    default: colors.secondaryColor,
};

export default function Snackbar({ visible, type = 'default', title, message, action, onAction, onDismiss, duration = 3000 }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-80)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
            if (duration) {
                const t = setTimeout(() => dismiss(), duration);
                return () => clearTimeout(t);
            }
        } else {
            dismiss();
        }
    }, [visible]);

    const dismiss = () => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: -80, duration: 200, useNativeDriver: true }),
        ]).start(() => onDismiss?.());
    };
    const icon = ICONS[type];
    const accent = ACCENT[type];

    return (
        <Animated.View style={[styles.snackbar, { opacity, transform: [{ translateY }] }]}>
            <View style={[styles.accent, { backgroundColor: accent }]} />
            <View style={[styles.iconWrap, { backgroundColor: accent + '26' }]}>
                <MaterialDesignIcons name={icon.name} size={20} color={icon.color} />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>{title}</Text>
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
            {action && (
                <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
                    <Text style={[styles.action, { color: colors.secondaryColor }]}>{action}</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={dismiss} activeOpacity={0.7} style={styles.closeBtn}>
                <MaterialDesignIcons name="close" size={18} color={colors.lightGreyColor} />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    snackbar: {
        position: 'absolute',
        top: 20,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 10,
        overflow: 'hidden',
    },
    accent: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 4,
    },
    iconWrap: {
        width: 36, height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: { flex: 1 },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.whiteColor,
    },
    message: {
        fontSize: 12,
        color: colors.lightGreyColor,
        marginTop: 2,
    },
    action: {
        fontSize: 13,
        fontWeight: '500',
        paddingHorizontal: 6,
    },
    closeBtn: {
        width: 28, height: 28,
        borderRadius: 8,
        backgroundColor: colors.cardWhiteOpacity,
        alignItems: 'center',
        justifyContent: 'center',
    },
});