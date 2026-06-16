import { StyleSheet, View, Image, Text } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import CommonButton from '../../components/CommonButton';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';

const features = [
    {
        icon: 'attach-money',
        title: 'Earn on your schedule',
        subtitle: 'Set your own hours, make great money',
    },
    {
        icon: 'timer',
        title: 'Flexible hours',
        subtitle: 'Drive when you want, where you want',
    },
    {
        icon: 'shield',
        title: 'Safety first',
        subtitle: '24/7 support and insurance coverage',
    },
];

const FeatureItem = ({ icon, title, subtitle }) => {
    return (
        <View style={styles.itemBg}>
            <View style={styles.itemInner}>
                <View style={styles.itemIconBg}>
                    <MaterialDesignIcons name={icon} color="white" size={28} />
                </View>
                <View style={styles.itemTextView}>
                    <Text style={styles.itemLabelText}>{title}</Text>
                    <Text style={styles.itemDescText}>{subtitle}</Text>
                </View>
            </View>
        </View>
    );
};

export default function OnboardingScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />

                <Text style={styles.labelText}>
                    Ride <Text style={styles.labelHighlight}>Anywhere</Text> Anytime
                </Text>

                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <FeatureItem
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            subtitle={feature.subtitle}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <CommonButton
                    title="Sign In"
                    color={colors.secondaryColor}
                    textColor={colors.primaryColor}
                    style={styles.button}
                    onPress={() => {
                        navigation.push('Login'); 
                    }}
                />
                <CommonButton
                    title="Create Account"
                    color={colors.whiteColor}
                    textColor={colors.primaryColor}
                    style={styles.button}
                    onPress={() => {
                         navigation.push('SignUpScreen'); 
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 20,
        justifyContent: 'center',
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
    logoImage: {
        width: 220,
        height: 90,
        alignSelf: 'center',
        marginBottom: 12,
    },
    labelText: {
        fontSize: 15,
        fontWeight: '300',
        color: colors.whiteColor,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 32,
    },
    labelHighlight: {
        color: colors.secondaryColor,
        fontWeight: '500',
    },

    featuresContainer: {
        gap: 14,
    },
    itemBg: {
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    itemInner: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    itemIconBg: {
        backgroundColor: colors.cardWhiteOpacity,
        width: 48,
        height: 48,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTextView: {
        flex: 1,
        marginLeft: 14,
    },
    itemLabelText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.whiteColor,
        marginBottom: 2,
    },
    itemDescText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
    },

    // Buttons
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        gap: 12,
    },
    button: {
        borderRadius: 50,
        height: 58,
    },
});