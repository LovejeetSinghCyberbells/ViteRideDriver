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
import { RegisterAccount } from '../../app/features/authSlice';
import { useDispatch } from 'react-redux';
import Snackbar from '../../components/Snackbar';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 375;

export default function SignUpScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleYear, setVehicleYear] = useState('');
    const [licencePlate, setLicencePlate] = useState('');
    const [checkPrivacyAndTerms, setCheckPrivacyAndTerms] = useState(false);
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

    const handleTermsCheck = () => {
        setCheckPrivacyAndTerms(prev => !prev);
    };

    const validateStep1 = () => {
        if (!name.trim()) {
            showError('Please enter your name.');
            return false;
        }
        if (!email.trim()) {
            showError('Please enter your email.');
            return false;
        }
        if (!phone.trim()) {
            showError('Please enter your phone number.');
            return false;
        }
        if (!password.trim()) {
            showError('Please enter a password.');
            return false;
        }
        if (!confirmPassword.trim()) {
            showError('Please confirm your password.');
            return false;
        }
        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!vehicleMake.trim()) {
            showError('Please enter the vehicle company.');
            return false;
        }
        if (!vehicleModel.trim()) {
            showError('Please enter the vehicle model.');
            return false;
        }
        if (!vehicleYear.trim()) {
            showError('Please enter the vehicle year.');
            return false;
        }
        if (!licencePlate.trim()) {
            showError('Please enter the vehicle license plate.');
            return false;
        }
        if (!checkPrivacyAndTerms) {
            showError('Please accept the Privacy Policy and Terms of Service.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (step === 1) {
            if (validateStep1()) setStep(2);
            return;
        }

        if (!validateStep2()) return;

        const userData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password: password.trim(),
            confirmPassword: confirmPassword.trim(),
            vehicleMake: vehicleMake.trim(),
            vehicleModel: vehicleModel.trim(),
            vehicleYear: vehicleYear.trim(),
            licensePlate: licencePlate.trim(),
            vehicleType: 'Sedan',
            vehicleColor: 'Black',
        };

        try {
            setLoading(true);

            const response = await dispatch(RegisterAccount(userData)).unwrap();

            if (response?.success) {
                showSuccess(
                    response?.message || 'Welcome to ViteRide.',
                    'Registration Successful!'
                );
                setTimeout(() => navigation.replace('Login'), 1200);
            } else {
                showError(
                    response?.message || 'Something went wrong.',
                    'Registration Failed'
                );
            }
        } catch (error) {
            const message =
                typeof error === 'string'
                    ? error
                    : error?.message || 'Failed to register. Please try again.';

            showError(message, 'Registration Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <KeyboardAwareScrollView
                style={styles.screen}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={30}
                extraHeight={120}
                showsVerticalScrollIndicator={false}
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

                <View style={{ gap: 40 }}>
                    <View style={styles.card}>
                        <Text style={styles.titleText}>
                            {step === 1
                                ? 'Create your account'
                                : 'Tell us about your vehicle'}
                        </Text>

                        <Text style={styles.subTitleText}>
                            Join millions of users today
                        </Text>

                        <View style={{ height: 20 }} />

                        <Text
                            style={[
                                styles.subTitleText,
                                { alignSelf: 'flex-end', marginBottom: 20 },
                            ]}
                        >
                            Step {step} of 2
                        </Text>

                        {step === 1 && (
                            <>
                                <CommonTextField
                                    placeholder="Enter your Name"
                                    value={name}
                                    onChangeText={setName}
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="Create Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <CommonTextField
                                    placeholder="Vehicle Company"
                                    value={vehicleMake}
                                    onChangeText={setVehicleMake}
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="Vehicle Model"
                                    value={vehicleModel}
                                    onChangeText={setVehicleModel}
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="Vehicle Year"
                                    value={vehicleYear}
                                    onChangeText={setVehicleYear}
                                    keyboardType="numeric"
                                />

                                <View style={{ height: 20 }} />

                                <CommonTextField
                                    placeholder="License Plate"
                                    value={licencePlate}
                                    onChangeText={setLicencePlate}
                                />

                                <View style={{ height: 20 }} />

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TouchableOpacity onPress={handleTermsCheck}>
                                        <View
                                            style={{
                                                width: 25,
                                                height: 25,
                                                backgroundColor: colors.whiteColor,
                                                borderRadius: 8,
                                            }}
                                        >
                                            {checkPrivacyAndTerms && (
                                                <MaterialDesignIcons
                                                    name="check"
                                                    size={25}
                                                    color={colors.blackColor}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>

                                    <Text
                                        style={[
                                            styles.labelText,
                                            { textAlign: 'left', flex: 1 },
                                        ]}
                                    >
                                        I agree to the{' '}
                                        <Text style={styles.labelHighlight}>
                                            Terms of Service
                                        </Text>{' '}
                                        and{' '}
                                        <Text style={styles.labelHighlight}>
                                            Privacy Policy
                                        </Text>
                                        .
                                    </Text>
                                </View>
                            </>
                        )}

                        <View style={{ height: 20 }} />

                        <CommonButton
                            title={step === 1 ? 'Next' : 'Create Account'}
                            color={colors.secondaryColor}
                            textColor={colors.primaryColor}
                            onPress={handleSubmit}
                            loading={loading}
                        />
                    </View>

                    <Text style={styles.labelText}>
                        Already have an account?{' '}
                        <Text
                            style={styles.labelHighlight}
                            onPress={() => navigation.replace('Login')}
                        >
                            Log in
                        </Text>
                    </Text>
                </View>

                <Snackbar
                    {...snack}
                    onDismiss={() => setSnack(s => ({ ...s, visible: false }))}
                />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
    },

    screen: {
        flex: 1,
        backgroundColor: colors.primaryColor,
    },

    container: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: width * 0.05,
        paddingTop: 10,
        paddingBottom: 30,
    },

    card: {
        marginTop: 40,
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 38,
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.borderColor,
    },

    titleText: {
        fontSize: isSmallDevice ? 22 : 24,
        fontWeight: '400',
        color: colors.whiteColor,
        textAlign: 'center',
    },

    subTitleText: {
        marginTop: 10,
        fontSize: isSmallDevice ? 14 : 16,
        fontWeight: '400',
        color: colors.secondaryColor,
        textAlign: 'center',
    },

    labelText: {
        fontSize: isSmallDevice ? 14 : 15,
        fontWeight: '300',
        color: colors.whiteColor,
        textAlign: 'center',
    },

    labelHighlight: {
        color: colors.secondaryColor,
        fontWeight: '500',
    },
});