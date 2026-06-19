import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import vehicleReducer from './features/vehicleSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        vehicle:vehicleReducer
    }
});

export default store;