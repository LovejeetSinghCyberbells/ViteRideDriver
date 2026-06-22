import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    GetAllVehicleService,
    AddVehicleService,
    EditVehicleService,
    ActiveToggleVehicleService,
    DeleteVehicleService,
} from '../../api/service';

export const GetAllVehicle = createAsyncThunk(
    'vehicle/GetAllVehicle',
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetAllVehicleService();

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to fetch vehicles.',
                    status: response?.status ?? null,
                });
            }

            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while fetching vehicles.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const AddVehicle = createAsyncThunk(
    'vehicle/AddVehicle',
    async (vehicleData, { rejectWithValue, dispatch }) => {
        try {
            const response = await AddVehicleService(vehicleData);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to add vehicle.',
                    status: response?.status ?? null,
                });
            }

            dispatch(GetAllVehicle());
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while adding vehicle.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const EditVehicle = createAsyncThunk(
    'vehicle/EditVehicle',
    async ({ vehicleData, id }, { rejectWithValue, dispatch }) => {
        try {
            const response = await EditVehicleService(vehicleData, id);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to update vehicle.',
                    status: response?.status ?? null,
                });
            }

            dispatch(GetAllVehicle());
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while updating vehicle.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const ActiveToggleVehicle = createAsyncThunk(
    'vehicle/ActiveToggleVehicle',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await ActiveToggleVehicleService(id);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to toggle vehicle status.',
                    status: response?.status ?? null,
                });
            }

            dispatch(GetAllVehicle());
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while toggling vehicle status.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

export const DeleteVehicle = createAsyncThunk(
    'vehicle/DeleteVehicle',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await DeleteVehicleService(id);

            if (!response || response?.success === false) {
                return rejectWithValue({
                    message: response?.message || 'Failed to delete vehicle.',
                    status: response?.status ?? null,
                });
            }

            dispatch(GetAllVehicle());
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    'Error while deleting vehicle.',
                status: error?.response?.status ?? null,
            });
        }
    }
);

const initialState = {
    vehicles: [],
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
};

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        resetVehicleError: state => {
            state.error = null;
            state.message = null;
        },

        clearVehicles: () => initialState,
    },
    extraReducers: builder => {
        builder

            .addCase(GetAllVehicle.pending, state => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(GetAllVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload?.vehicles ?? [];
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(GetAllVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || 'Failed to fetch vehicles.';
            })

            .addCase(AddVehicle.pending, state => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(AddVehicle.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(AddVehicle.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload?.message || 'Failed to add vehicle.';
            })

            .addCase(EditVehicle.pending, state => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(EditVehicle.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(EditVehicle.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload?.message || 'Failed to update vehicle.';
            })

            .addCase(ActiveToggleVehicle.pending, state => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(ActiveToggleVehicle.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(ActiveToggleVehicle.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload?.message || 'Failed to toggle vehicle status.';
            })

            .addCase(DeleteVehicle.pending, state => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })

            .addCase(DeleteVehicle.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message = action.payload?.message || null;
                state.error = null;
            })

            .addCase(DeleteVehicle.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload?.message || 'Failed to delete vehicle.';
            });
    },
});

export const { resetVehicleError, clearVehicles } = vehicleSlice.actions;

export default vehicleSlice.reducer;