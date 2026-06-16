import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import CommonButton from '../../components/CommonButton';
import CommonTextField from '../../components/CommonTextField';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';


export default function LoginScreen() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <MaterialDesignIcons
                    name='chevron-left'
                    size={40}
                    color={colors.whiteColor}
                    style={{ marginEnd: 10 }}
                />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.titleText}>Login your account</Text>
                <Text style={styles.subTitleText}>Join millions of users today</Text>
                <View style={{ height: 40 }} />
                <CommonTextField
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <View style={{ height: 20 }} />
                <CommonTextField
                    placeholder="Create Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <View style={{ height: 20 }} />
                <CommonButton
                    title="Login"
                    color={colors.secondaryColor}
                    textColor={colors.primaryColor}
                    style={styles.button}
                    onPress={() => console.log('Login pressed')}
                />
                <View style={{ height: 40 }} />
                <Text style={styles.labelText}>
                    Don’t have an account?{' '}
                    <Text
                        style={styles.labelHighlight}
                        onPress={() => navigation.replace('SignUpScreen')}
                    >
                        Sign up
                    </Text>
                </Text>

            </View>
            <View style={styles.divider}>
                <View style={styles.orContainer}>
                    <Text style={styles.orText}>or</Text>
                </View>
            </View>
            <View>
                <CommonButton
                    title="Continue with Google"
                    color={colors.whiteColor}
                    textColor={colors.primaryColor}
                    style={styles.button}
                    isIcon={true}
                    icon='google'
                    iconColor={colors.primaryColor}
                    onPress={() => console.log('Continue with Google pressed')}

                />

                <CommonButton
                    title="Continue with Apple"
                    color={colors.blackColor}
                    textColor={colors.whiteColor}
                    style={styles.button}
                    isIcon={true}
                    icon='apple'
                    iconColor={colors.whiteColor}
                    onPress={() => console.log('Continue with Apple pressed')}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 20,
        justifyContent: 'space-evenly',
    },
    card: {
        backgroundColor: colors.cardWhiteOpacity, // Semi-transparent
        borderRadius: 38,
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginBottom: 40,
    },
    titleText: {
        fontSize: 24,
        fontWeight: '400',
        color: colors.whiteColor,
        textAlign: 'center',
    },
    subTitleText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '400',
        color: colors.secondaryColor,
        textAlign: 'center',
    },
    labelText: {
        fontSize: 15,
        fontWeight: '300',
        color: colors.whiteColor,
        textAlign: 'center',
    },
    labelHighlight: {
        color: colors.secondaryColor,
        fontWeight: '500',
    },
    divider: { height: 1, backgroundColor: colors.whiteColor, alignItems: 'center', justifyContent: 'center' },
    orContainer: { width: 50, height: 25, backgroundColor: colors.whiteColor, borderRadius: 40 },
    orText: {
        position: 'absolute',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryColor,
    },
});