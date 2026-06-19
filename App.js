import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { enableScreens } from 'react-native-screens';
import store from './src/app/store';
import { Provider } from 'react-redux';


enableScreens();

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />
            <Provider store={store} >
                <RootNavigator />
            </Provider>
        </SafeAreaProvider>
    );
}

export default App;