import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL
});

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const response = await axios.post(${BASE_URL}/main/token/refresh/, { refresh: refreshToken });
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        return response.data.access;
    } catch (error) {
        console.error("Failed to refresh access token", error);
        const navigate = useNavigate();
        navigate("/login");
        return null;
    }
};

// Adding authorization token to header "Authorization" in every axios request if the token exists in local storage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = Bearer ${token};
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Adding a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log("refreshing accesstoken")
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                axios.defaults.headers.common['Authorization'] = Bearer ${newAccessToken};
                originalRequest.headers['Authorization'] = Bearer ${newAccessToken};
                console.log("token refreshed")
                return api(originalRequest);
            }
        }
        console.log("error while refreshing access token")
        return Promise.reject(error);
    }
);