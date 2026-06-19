import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetProfileService ,EditProfileService} from "../../api/service";
import { clearUserData, getUserData, saveUserData } from "../../units/asyncStorageManager";

export const GetProfile = createAsyncThunk(
    'profile/GetProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetProfileService();
            console.log("Data From Slice : ", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while fetching profile.'
            );
        }
    }
)

export const EditProfile = createAsyncThunk(
    'profile/EditProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await EditProfileService(userData);
            console.log("Data From edit profile Slice : ", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while Edit profile.'
            );
        }
    }
)

const initialState = {
    profile: {
        "id": null,
        "name": null,
        "email": null,
        "profilePicture": null,
        "memberSince": null,
        "activeVehicle": null
    },
    reviews: {
        "averageRating": null,
        "totalReviews": 0,
        "list": []
    },
    loading: false,
    error: null,
    message: null
};


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(GetProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload?.profile ?? null;
                state.reviews = action.payload?.reviews ?? null;
                state.message = action.payload?.message;
            })
            .addCase(GetProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(EditProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(EditProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload?.profile ?? null;
                state.message = action.payload?.message;
            })
            .addCase(EditProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default profileSlice.reducer;

