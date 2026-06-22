import axios from "axios";
import { API_ROUTES } from "./constant";
import { getUserData } from "../units/asyncStorageManager";


const BASE_URL = "http://49.13.70.253:4044/api/";


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": 'application/json',
    },
})
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const userData = await getUserData();
            if (userData?.token) {
                config.headers.Authorization = `Bearer ${userData.token}`;
            }
        } catch (err) {
            console.log('Token fetch error:', err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const method = error?.config?.method?.toUpperCase();
        const requestUrl = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
        console.log('API ERROR =>', {
            method,
            url: requestUrl,
            status: error?.response?.status,
            message: error?.response?.data?.message || error?.message,
        });
        return Promise.reject(error);
    }
);


export const RegistrationAccountApi = userData => {
    return axiosInstance.post(API_ROUTES.REGISTER_ACCOUNT, userData);
}

export const LoginApi = userData => {
    return axiosInstance.post(API_ROUTES.LOGIN, userData);
}

export const GetProfileApi = () => {
    return axiosInstance.get(API_ROUTES.GET_PROFILE);
}

export const EditProfileApi = userData => {
    return axiosInstance.put(API_ROUTES.EDIT_PROFILE,userData);
}

export const GetAllVehicleApi = () => {
    return axiosInstance.get(API_ROUTES.GET_VEHICLE);
}

export const AddVehicleApi = vehicleData => {
    return axiosInstance.post(API_ROUTES.ADD_VEHICLE,vehicleData);
}

export const EditVehicleApi = (vehicleData, id) => {
    return axiosInstance.patch(API_ROUTES.EDIT_VEHICLE(id), vehicleData);
};

export const ActiveToggleVehicleApi = ( id) => {
    return axiosInstance.patch(API_ROUTES.ACTIVATE_VEHICLE(id));
};

export const DeleteVehicleApi = ( id) => {
    return axiosInstance.delete(API_ROUTES.DELETE_VEHICLE(id));
}

export const LogoutApi = () => {
    return axiosInstance.post(API_ROUTES.LOGOUT);
}
