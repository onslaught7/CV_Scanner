export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = 'api/auth';
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const GOOGLE_SIGNUP_ROUTE = `${AUTH_ROUTES}/google-signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GOOGLE_LOGIN_ROUTE = `${AUTH_ROUTES}/google-login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;