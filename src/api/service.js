import {
    RegistrationAccountApi, LoginApi, GetProfileApi, EditProfileApi,
    GetAllVehicleApi, AddVehicleApi, EditVehicleApi, ActiveToggleVehicleApi,
    DeleteVehicleApi
} from './api';

export const RegistrationAccountService = async userData => {
    const response = await RegistrationAccountApi(userData);
    return response;
};

export const LoginService = async userData => {
    const response = await LoginApi(userData);
    return response;
};

export const GetProfileService = async () => {
    const response = await GetProfileApi();
    return response;
};

export const EditProfileService = async userData => {
    const response = await EditProfileApi(userData);
    return response;
};

export const GetAllVehicleService = async () => {
    const response = await GetAllVehicleApi();
    return response;
};

export const AddVehicleService = async vehicleData => {
    const response = await AddVehicleApi(vehicleData);
    return response;
};

export const EditVehicleService = async (vehicleData, id) => {
    console.log("ID : ", id);
    const response = await EditVehicleApi(vehicleData, id);
    return response;
};

export const ActiveToggleVehicleService = async (id) => {
    console.log("ID : ", id);
    const response = await ActiveToggleVehicleApi(id);
    return response;
};

export const DeleteVehicleService = async (id) => {
    console.log("ID : ", id);
    const response = await DeleteVehicleApi(id);
    return response;
};
