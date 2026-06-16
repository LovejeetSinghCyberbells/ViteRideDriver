import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import CommonButton from '../../components/CommonButton';
import CommonTextField from '../../components/CommonTextField';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';


export default function SignUpScreen() {
    const navigation = useNavigation();

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

    const handleTermsCheck = () => {
        setCheckPrivacyAndTerms(!checkPrivacyAndTerms);
    };

    const handleSubmit = () => {
        if(step === 1){
            setStep(2);
            return;
        }
        if (!checkPrivacyAndTerms) return;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                activeOpacity={0.8}
            >
                <MaterialDesignIcons
                    name='chevron-left'
                    size={40}
                    color={colors.whiteColor}
                    style={{ marginEnd: 10 }}
                />
            </TouchableOpacity>
            <View style={{ gap: 40 }}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>
                        {step === 1 ? "Create your account" : "Tell us about your vehicle"}
                    </Text>
                    <Text style={styles.subTitleText}>Join millions of users today</Text>
                    <View style={{ height: 20 }} />
                    <Text style={[styles.subTitleText, { alignSelf: 'flex-end', marginBottom: 20 }]}>
                        Step {step === 1 ? "1" : "2"} of 2
                    </Text>

                    {step === 1 && (
                        <View>
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
                                secureTextEntry={true}
                            />
                            <View style={{ height: 20 }} />
                            <CommonTextField
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={true}
                            />
                        </View>
                    )}

                    {step === 2 && (
                        <View>
                            <CommonTextField
                                placeholder="Vehicle Make"
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
                                <TouchableOpacity
                                    onPress={() => setCheckPrivacyAndTerms(prev => !prev)}
                                >
                                    <View style={{
                                        width: 25,
                                        height: 25,
                                        backgroundColor: colors.whiteColor,
                                        borderRadius: 8
                                    }}>
                                        {checkPrivacyAndTerms && (
                                            <MaterialDesignIcons
                                                name='check'
                                                size={25}
                                                color={colors.blackColor}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <Text style={[styles.labelText, { textAlign: 'left', flex: 1 }]}>
                                    I agree to the <Text style={styles.labelHighlight}>Terms of Service</Text> and <Text style={styles.labelHighlight}>Privacy Policy.</Text> I understand that background checks and vehicle inspections are required.
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 20 }} />
                    <CommonButton
                        title={step === 1 ? "Next" : "Create Account"}
                        color={colors.secondaryColor}
                        textColor={colors.primaryColor}
                        style={styles.button}
                        onPress={step === 2 ? handleSubmit : () => setStep(2)}
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
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 20,
        justifyContent: 'space-evenly',
    },
    card: {
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 38,
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: colors.borderColor,
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
});