import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (userData) => {
  try {
    if (userData?.data) {
      await AsyncStorage.setItem('user', JSON.stringify(userData.data['user']));
      if (userData.data?.token) {
        await AsyncStorage.setItem('token', userData.data['token']); 
      }
    }
  } catch (error) {
    console.log('Error saving user data:', error);
  }
};

export const saveProfileData = async (user) => {
  try {
    if (user) {
      await AsyncStorage.setItem('userProfile', JSON.stringify(user));
    }
  } catch (error) {
    console.log('Error saving profile data:', error);
  }
};

export const getUserData = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    return {
      user: user ? JSON.parse(user) : null,
      token: token ?? null, 
    };
  } catch (error) {
    console.log('Error getting user data:', error);
    return { user: null, token: null };
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log('Error clearing user data:', error);
  }
};