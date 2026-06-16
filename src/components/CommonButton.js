import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

export default function CommonButton({
    title,
    color = colors.primaryColor,        // Default primary color
    textColor = colors.whiteColor,    // Default white text
    onPress,
    style,                    // Allow custom style override
    disabled = false,
    isIcon = false,
    icon,
    iconColor =colors.whiteColor, 

}) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: color },
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {isIcon &&  <MaterialDesignIcons
                        name={icon}
                        size={25}
                        color={iconColor}
                        style={{marginEnd:10}}
                    />}
            <Text style={[styles.titleText, { color: textColor }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        width:'100%',
        height: 56,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginVertical: 8,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
});