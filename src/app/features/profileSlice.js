import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GetProfileService, EditProfileService } from '../../api/service';

export const GetProfile = createAsyncThunk(
    'profile/GetProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetProfileService();

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to fetch profile.',
                    status: response?.status ?? null,
                });
            }

            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while fetching profile.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const EditProfile = createAsyncThunk(
    'profile/EditProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await EditProfileService(userData);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to update profile.',
                    status: response?.status ?? null,
                });
            }

            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while updating profile.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

const initialState = {
    profile: {
        id: null,
        name: null,
        email: null,
        profilePicture: null,
        memberSince: null,
        activeVehicle: null,
    },
    reviews: {
        averageRating: null,
        totalReviews: 0,
        list: [],
    },
    loading: false,
    error: null,
    message: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        resetProfileError: state => {
            state.error = null;
            state.message = null;
        },

        clearProfile: () => initialState,
    },
    extraReducers: builder => {
        builder

            .addCase(GetProfile.pending, state => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(GetProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload?.profile ?? initialState.profile;
                state.reviews = action.payload?.reviews ?? initialState.reviews;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(GetProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || 'Failed to fetch profile.';
            })

            .addCase(EditProfile.pending, state => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(EditProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload?.profile ?? state.profile;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(EditProfile.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || 'Failed to update profile.';
            });
    },
});

export const { resetProfileError, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;