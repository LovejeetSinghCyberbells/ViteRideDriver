import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    RegistrationAccountService,
    LoginService,
} from '../../api/service';
import {
    getUserData,
    saveUserData,
} from '../../units/asyncStorageManager';

export const RegisterAccount = createAsyncThunk(
    'auth/RegisterAccount',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await RegistrationAccountService(userData);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Registration failed.',
                    status: response?.status ?? null,
                });
            }

            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Registration failed.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const Login = createAsyncThunk(
    'auth/Login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await LoginService(userData);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Login failed.',
                    status: response?.status ?? null,
                });
            }
console.log("Auth Slice  : ", response)
            await saveUserData(response);

            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Login failed.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const loadInitialState = createAsyncThunk(
    'auth/loadInitialState',
    async (_, { rejectWithValue }) => {
        try {
            const storedData = await getUserData();
            const { user, token } = storedData || {};

            return {
                user: user || null,
                token: token || null,
                isLoggedIn: !!token,
            };
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.message ||
                    'Failed to load session.',
                status: null,
            });
        }
    }
);

const initialState = {
    isLoggedIn: false,
    user: null,
    token: null,
    mainloading: false,
    loading: false,
    error: null,
    message: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: state => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
            state.error = null;
            state.message = null;
        },

        resetAuthError: state => {
            state.error = null;
            state.message = null;
        },
    },

    extraReducers: builder => {
        builder

            .addCase(RegisterAccount.pending, state => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(RegisterAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload?.user || null;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(RegisterAccount.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || 'Registration failed.';
            })

            .addCase(Login.pending, state => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(Login.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = true;
                state.user = action.payload?.user || null;
                state.token = action.payload?.token || null;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(Login.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error =
                    action.payload?.message || 'Login failed.';
            })

            .addCase(loadInitialState.pending, state => {
                state.mainloading = true;
                state.error = null;
            })

            .addCase(loadInitialState.fulfilled, (state, action) => {
                state.mainloading = false;
                state.isLoggedIn = action.payload.isLoggedIn;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })

            .addCase(loadInitialState.rejected, (state, action) => {
                state.mainloading = false;
                state.isLoggedIn = false;
                state.user = null;
                state.token = null;
                state.error =
                    action.payload?.message || 'Failed to load session.';
            });
    },
});

export const { logout, resetAuthError } = authSlice.actions;

export default authSlice.reducer;