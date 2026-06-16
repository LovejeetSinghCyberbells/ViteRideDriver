import React, { useRef, useEffect } from 'react';
import {
    Animated,
    Pressable,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import colors from '../common/Colors';

const SIZE_MAP = {
    small: { trackWidth: 44, trackHeight: 26, thumbSize: 20, padding: 3 },
    medium: { trackWidth: 56, trackHeight: 32, thumbSize: 26, padding: 3 },
    large: { trackWidth: 68, trackHeight: 40, thumbSize: 32, padding: 4 },
};


const ToggleSwitch = ({
    value,
    onValueChange,
    activeColor = colors.secondaryColor,
    inactiveColor = colors.lightGreyColor,
    thumbColor = colors.whiteColor,
    size = 'medium',
    disabled = false,
    style,
}) => {
    const { trackWidth, trackHeight, thumbSize, padding } = SIZE_MAP[size];
    const translateX = trackWidth - thumbSize - padding * 2;

    // Animated values
    const thumbAnim = useRef(new Animated.Value(value ? translateX : 0)).current;
    const colorAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(thumbAnim, {
                toValue: value ? translateX : 0,
                useNativeDriver: true,
                bounciness: 6,
            }),
            Animated.timing(colorAnim, {
                toValue: value ? 1 : 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [value]);

    const trackColor = colorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveColor, activeColor],
    });

    const handlePress = () => {
        if (!disabled) onValueChange(!value);
    };

    return (
        <Pressable
            onPress={handlePress}
            accessibilityRole="switch"
            accessibilityState={{ checked: value, disabled }}
            style={[{ opacity: disabled ? 0.45 : 1 }, style]}
            hitSlop={8}
        >
            {/* Track */}
            <Animated.View
                style={[
                    styles.track,
                    {
                        width: trackWidth,
                        height: trackHeight,
                        borderRadius: trackHeight / 2,
                        padding: padding,
                        backgroundColor: trackColor,
                    },
                ]}
            >
                {/* Thumb */}
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            width: thumbSize,
                            height: thumbSize,
                            borderRadius: thumbSize / 2,
                            backgroundColor: thumbColor,
                            transform: [{ translateX: thumbAnim }],
                        },
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
};


const styles = StyleSheet.create({
    track: {
        justifyContent: 'center',
    },
    thumb: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 2,
        elevation: 3,
    },
});

export default ToggleSwitch;