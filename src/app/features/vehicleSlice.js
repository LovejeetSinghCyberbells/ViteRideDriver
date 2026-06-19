import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetAllVehicleService, AddVehicleService, EditVehicleService, ActiveToggleVehicleService ,
    DeleteVehicleService
} from "../../api/service";

export const GetAllVehicle = createAsyncThunk(
    'vehicle/GetAllVehicle',
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetAllVehicleService();
            console.log("Data From Slice : ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while fetching vehicles.'
            );
        }
    }
)

export const AddVehicle = createAsyncThunk(
    'vehicle/AddVehicle',
    async (vehicleData, { rejectWithValue }) => {
        try {
            const response = await AddVehicleService(vehicleData);
            console.log("Data From Slice : ", response);
            GetAllVehicle();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while adding a new vehicles.'
            );
        }
    }
)


export const EditVehicle = createAsyncThunk(
    'vehicle/EditVehicle',
    async ({ vehicleData, id }, { rejectWithValue }) => {
        try {
            console.log("Id :", id);
            const response = await EditVehicleService(vehicleData, id);
            GetAllVehicle();
            console.log("Data From Slice : ", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while edit a vehicles.'
            );
        }
    }
)

export const ActiveToggleVehicle = createAsyncThunk(
    'vehicle/ActiveToggleVehicle',
    async (id, { rejectWithValue }) => {
        try {
            console.log("Id :", id);
            const response = await ActiveToggleVehicleService(id);
            GetAllVehicle();
            console.log("Data From Slice : ", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while activate vehicle.'
            );
        }
    }
)

export const DeleteVehicle = createAsyncThunk(
    'vehicle/DeleteVehicle',
    async (id, { rejectWithValue }) => {
        try {
            console.log("Id :", id);
            const response = await DeleteVehicleService(id);
            GetAllVehicle();
            console.log("Data From Slice : ", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.message || 'Error while delete vehicle.'
            );
        }
    }
)

const initialState = {
    vehicles: null,
    loading: false,
    error: null,
    message: null
};


const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(GetAllVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetAllVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload?.vehicles ?? null;
                state.message = action.payload?.message;
            })
            .addCase(GetAllVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(AddVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AddVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload?.vehicles ?? null;
                state.message = action.payload?.message;
            })
            .addCase(AddVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(EditVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(EditVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload?.vehicles ?? null;
                state.message = action.payload?.message;
            })
            .addCase(EditVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ActiveToggleVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ActiveToggleVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })
            .addCase(ActiveToggleVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DeleteVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DeleteVehicle.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message;
            })
            .addCase(DeleteVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default vehicleSlice.reducer;

