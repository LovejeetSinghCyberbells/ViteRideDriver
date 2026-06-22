import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomBar';
import AuthNavigator from './AuthNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { loadInitialState } from '../app/features/authSlice';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

const RootNavigator = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, mainloading, token } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadInitialState());
    }, [dispatch]);

    useEffect(() => {
        console.log('Token from root:', token);
        console.log('isLoggedIn:', isLoggedIn);
    }, [token, isLoggedIn]);

    if (mainloading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#519377" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn && token ? (
                <BottomTabs />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
};

export default RootNavigator;



const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
