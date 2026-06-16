import React,{useEffect} from 'react';
import { StyleSheet, ImageBackground, Image, Text } from 'react-native';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('OnboardingScreen'); // replace so user can't go back to splash
        }, 3000); // 3 seconds

        return () => clearTimeout(timer); // cleanup on unmount
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/images/splash.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
            <Text style={styles.labelText}>
                Ride <Text style={styles.labelHighlight}>Anywhere</Text> Anytime
            </Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 254,
        height: 110,
    },
    labelText: {
        letterSpacing:3,
        fontSize: 14,
        fontWeight: '300',
        color: 'white',
        marginTop: 12,
    },
    labelHighlight: {
        color: colors.secondaryColor,
    },
});