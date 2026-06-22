import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../components/CommonButton';
import CommonTextField from '../../components/CommonTextField';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import { Login } from '../../app/features/authSlice';
import { useDispatch } from 'react-redux';
import Snackbar from '../../components/Snackbar';

export default function LoginScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState({
        visible: false,
        type: 'default',
        title: '',
        message: '',
    });

    const showError = (message, title = 'Error') => {
        setSnack({ visible: true, type: 'error', title, message });
    };

    const showSuccess = (message, title = 'Success') => {
        setSnack({ visible: true, type: 'success', title, message });
    };

    const validate = () => {
        if (!email.trim()) {
            showError('Please enter your email.');
            return false;
        }
        if (!password.trim()) {
            showError('Please enter your password.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const response = await dispatch(
                Login({ email: email.trim(), password: password.trim() })
            ).unwrap();

            if (response?.status === 'success' || response?.success) {
                showSuccess(
                    response?.message || 'Welcome back to ViteRide.',
                    'Login Successful!'
                );
            } else {
                showError(
                    response?.message || 'Something went wrong.',
                    'Login Failed'
                );
            }
        } catch (error) {
            const message =
                typeof error === 'string'
                    ? error
                    : error?.message || 'Failed to login. Please try again.';

            showError(message, 'Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.screen}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            enableOnAndroid
            extraScrollHeight={30}
            extraHeight={120}
        >
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <MaterialDesignIcons
                    name="chevron-left"
                    size={40}
                    color={colors.whiteColor}
                    style={{ marginEnd: 10 }}
                />
            </TouchableOpacity>

            <View style={styles.card}>
                <Text style={styles.titleText}>Login your account</Text>
                <Text style={styles.subTitleText}>
                    Join millions of users today
                </Text>

                <View style={{ height: 40 }} />

                <CommonTextField
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={{ height: 20 }} />

                <CommonTextField
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={{ height: 20 }} />

                <CommonButton
                    title="Login"
                    color={colors.secondaryColor}
                    textColor={colors.primaryColor}
                    style={styles.button}
                    onPress={handleLogin}
                    loading={loading}
                />

                <View style={{ height: 40 }} />

                <Text style={styles.labelText}>
                    Don't have an account?{' '}
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
                    isIcon
                    icon="google"
                    iconColor={colors.primaryColor}
                    onPress={() => console.log('Continue with Google pressed')}
                />

                <CommonButton
                    title="Continue with Apple"
                    color={colors.blackColor}
                    textColor={colors.whiteColor}
                    style={styles.button}
                    isIcon
                    icon="apple"
                    iconColor={colors.whiteColor}
                    onPress={() => console.log('Continue with Apple pressed')}
                />
            </View>

            <Snackbar
                {...snack}
                onDismiss={() => setSnack(prev => ({ ...prev, visible: false }))}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primaryColor,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'space-evenly',
    },
    card: {
        backgroundColor: colors.cardWhiteOpacity,
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
    divider: {
        height: 1,
        backgroundColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    orContainer: {
        width: 50,
        height: 25,
        backgroundColor: colors.whiteColor,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orText: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.primaryColor,
    },
    button: {
        marginVertical: 8,
    },
});