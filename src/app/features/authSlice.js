import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RegistrationAccountService, LoginService } from "../../api/service";
import { clearUserData, getUserData, saveUserData } from "../../units/asyncStorageManager";

export const RegisterAccount = createAsyncThunk(
    'auth/RegisterAccount',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await RegistrationAccountService(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Registration failed'
            );
        }
    }
)

export const Login = createAsyncThunk(
    'auth/Login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await LoginService(userData);
            console.log("Response from slice : ", response.data);
            saveUserData(response)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Login failed'
            );
        }
    }
)


export const loadInitialState = createAsyncThunk(
    'auth/loadInitialState',
    async () => {
        try {
            const storedData = await getUserData();
            const { user, token } = storedData || {};
            return {
                user: user || null,
                token: token || null,
                isLoggedIn: !!token,
            };
        } catch (error) {
            console.error('Error in loadInitialState:', error);
            throw error;
        }
    }
);


const initialState = {
    isLoggedIn: false,
    user: null,
    mainloading: false,
    loading: false,
    error: null,
    message: null
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            console.log('User logged out successfully.');
        },
        resetAuthError: (state) => {
            state.error = null;
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(RegisterAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RegisterAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user ?? null;
                state.message = action.payload?.message;
            })
            .addCase(RegisterAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(Login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(Login.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.user = action.payload?.user ?? null;
                state.token = action.payload?.token ?? null; 
                state.message = action.payload?.message;
            })
            .addCase(Login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loadInitialState.pending, (state) => {
                state.mainloading = true;
            })
            .addCase(loadInitialState.fulfilled, (state, action) => {
                state.mainloading = false;
                state.isLoggedIn = action.payload.isLoggedIn;
                state.user = action.payload.data;
                state.token = action.payload.token;
            })
            .addCase(loadInitialState.rejected, (state) => {
                state.mainloading = false;
                state.isLoggedIn = false;
            })
    },
});

export const { logout, resetAuthError } = authSlice.actions;
export default authSlice.reducer;

