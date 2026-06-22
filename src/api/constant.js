export const API_ROUTES = {
    REGISTER_ACCOUNT: 'auth/driverRegister',
    LOGIN: 'auth/login',
    GET_PROFILE: 'driver/profile',
    EDIT_PROFILE: 'driver/profile',
    GET_VEHICLE: 'driver/vehicles',
    ADD_VEHICLE: 'driver/vehicles',
    EDIT_VEHICLE: (id) => `driver/vehicles/${id}`,
    ACTIVATE_VEHICLE: (id) => `driver/vehicles/${id}/activate`,
    DELETE_VEHICLE: (id) => `driver/vehicles/${id}`,
    LOGOUT : 'auth/logout',
}