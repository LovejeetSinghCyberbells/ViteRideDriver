import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from '../screens/home/HomeScreen';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import ProfileScreens from '../screens/profile/ProfileScreens';
import TripsScreen from '../screens/trips/TripsScreen';
import RideScreen from '../screens/ride/RideScreen';
import MyDetailsScreen from '../screens/profile/MyDetailsScreen';
import ReviewsScreen from '../screens/profile/ReviewsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import VehicleListScreen from '../screens/profile/VehicleListScreen';
import AddVehicleScreen from '../screens/profile/AddVehicleScreen';
import VehicleDetailScreen from '../screens/profile/VehicleDetailScreen';
import AboutAppScreen from '../screens/profile/AboutAppScreen';
import HelpAndSupportScreen from '../screens/profile/HelpAndSupportScreen';
import AppPreferencesScreen from '../screens/profile/AppPreferencesScreen';

import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigators
export const HomeNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="RideScreen" component={RideScreen} />
    </Stack.Navigator>
);

export const TripsNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="TripsScreen">
        <Stack.Screen name="TripsScreen" component={TripsScreen} />
    </Stack.Navigator>
);

export const EarningsNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="EarningsScreen">
        <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
    </Stack.Navigator>
);

export const ProfileNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ProfileScreens">
        <Stack.Screen name="ProfileScreens" component={ProfileScreens} />
        <Stack.Screen name="MyDetailsScreen" component={MyDetailsScreen} />
        <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="VehicleListScreen" component={VehicleListScreen} />
        <Stack.Screen name="AddVehicleScreen" component={AddVehicleScreen} />
        <Stack.Screen name="VehicleDetailScreen" component={VehicleDetailScreen} />
        <Stack.Screen name="AboutAppScreen" component={AboutAppScreen} />
        <Stack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} />
        <Stack.Screen name="AppPreferencesScreen" component={AppPreferencesScreen} />
    </Stack.Navigator>
);

const BottomTabs = () => {
    const insets = useSafeAreaInsets();

    const tabBarHeight = 70 + (Platform.OS === 'android' ? insets.bottom : 10);

    const defaultTabBarStyle = {
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 3,
        elevation: 10,
        backgroundColor: '#fff',
        borderTopWidth: 0,
        height: 70 + (Platform.OS === 'android' ? insets.bottom : 10),
        paddingBottom: (Platform.OS === 'android' ? insets.bottom : 10),
        paddingTop: 8,
        overflow: "hidden",
    };

    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    elevation: 10,
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    height: tabBarHeight,
                    paddingBottom: Platform.OS === 'android' ? insets.bottom : 10,
                    paddingTop: 8,
                    overflow: 'hidden',
                },
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <MaterialDesignIcons
                            name="home"
                            size={24}
                            color={focused ? colors.primaryColor : colors.lightGreyColor}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? colors.primaryColor : colors.lightGreyColor,
                                fontSize: 12,
                                lineHeight: 16,
                                fontWeight: '500',
                            }}
                        >
                            Home
                        </Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
                        if (routeName === 'RideScreen') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />

            <Tab.Screen
                name="TripsScreen"
                component={TripsNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialDesignIcons
                            name="location-on"
                            size={24}
                            color={focused ? colors.primaryColor : colors.lightGreyColor}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? colors.primaryColor : colors.lightGreyColor,
                                fontSize: 12,
                                lineHeight: 16,
                                fontWeight: '500',
                            }}
                        >
                            Trips
                        </Text>
                    ),
                }}
            />

            <Tab.Screen
                name="EarningsScreen"
                component={EarningsNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialDesignIcons
                            name="attach-money"
                            size={24}
                            color={focused ? colors.primaryColor : colors.lightGreyColor}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? colors.primaryColor : colors.lightGreyColor,
                                fontSize: 12,
                                lineHeight: 16,
                                fontWeight: '500',
                            }}
                        >
                            Earnings
                        </Text>
                    ),
                }}
            />

            <Tab.Screen
                name="ProfileScreens"
                component={ProfileNavigator}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <MaterialDesignIcons
                            name="person"
                            size={24}
                            color={focused ? colors.primaryColor : colors.lightGreyColor}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text
                            style={{
                                color: focused ? colors.primaryColor : colors.lightGreyColor,
                                fontSize: 12,
                                lineHeight: 16,
                                fontWeight: '500',
                            }}
                        >
                            Profile
                        </Text>
                    ),
                    tabBarStyle: (() => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileScreens';
                        if (routeName === 'MyDetailsScreen' || routeName === 'ReviewsScreen' || routeName === 'EditProfileScreen' 
                            || routeName === 'VehicleListScreen' || routeName === 'AddVehicleScreen' || routeName === 'VehicleDetailScreen'
                        || routeName === 'HelpAndSupportScreen'  || routeName === 'AboutAppScreen'  || routeName === 'AppPreferencesScreen') {
                            return { display: 'none' };
                        }
                        return defaultTabBarStyle;
                    })(),
                })}
            />
        </Tab.Navigator>
    );
};

export default BottomTabs;