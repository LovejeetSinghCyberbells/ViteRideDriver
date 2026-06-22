import {
    RegistrationAccountApi, LoginApi, GetProfileApi, EditProfileApi,
    GetAllVehicleApi, AddVehicleApi, EditVehicleApi, ActiveToggleVehicleApi,
    DeleteVehicleApi,LogoutApi
} from './api';

const handleApiError = (error, serviceName) => {
    const status = error?.response?.status;
    const message =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred';

    console.error(`[${serviceName}] Error ${status ?? ''}:`, message);

    return {
        success: false,
        status: status ?? null,
        message,
    };
};

export const RegistrationAccountService = async userData => {
    try {
        const response = await RegistrationAccountApi(userData);
        return response;
    } catch (error) {
        return handleApiError(error, 'RegistrationAccountService');
    }
};

export const LoginService = async userData => {
    try {
        const response = await LoginApi(userData);
        return response;
    } catch (error) {
        return handleApiError(error, 'LoginService');
    }
};

export const GetProfileService = async () => {
    try {
        const response = await GetProfileApi();
        return response;
    } catch (error) {
        return handleApiError(error, 'GetProfileService');
    }
};

export const EditProfileService = async userData => {
    try {
        const response = await EditProfileApi(userData);
        return response;
    } catch (error) {
        return handleApiError(error, 'EditProfileService');
    }
};

export const GetAllVehicleService = async () => {
    try {
        const response = await GetAllVehicleApi();
        return response;
    } catch (error) {
        return handleApiError(error, 'GetAllVehicleService');
    }
};

export const AddVehicleService = async vehicleData => {
    try {
        const response = await AddVehicleApi(vehicleData);
        return response;
    } catch (error) {
        return handleApiError(error, 'AddVehicleService');
    }
};

export const EditVehicleService = async (vehicleData, id) => {
    try {
        const response = await EditVehicleApi(vehicleData, id);
        return response;
    } catch (error) {
        return handleApiError(error, 'EditVehicleService');
    }
};

export const ActiveToggleVehicleService = async id => {
    try {
        const response = await ActiveToggleVehicleApi(id);
        return response;
    } catch (error) {
        return handleApiError(error, 'ActiveToggleVehicleService');
    }
};

export const DeleteVehicleService = async id => {
    try {
        const response = await DeleteVehicleApi(id);
        return response;
    } catch (error) {
        return handleApiError(error, 'DeleteVehicleService');
    }
};

export const LogoutService = async () => {
    try {
        const response = await LogoutApi();
        return response;
    } catch (error) {
        return handleApiError(error, 'LogoutService');
    }
};