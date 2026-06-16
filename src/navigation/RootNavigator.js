import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabs from './BottomBar';   
import AuthNavigator from './AuthNavigator';

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <BottomTabs />
        </NavigationContainer>
    );
};

export default RootNavigator;