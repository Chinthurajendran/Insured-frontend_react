import axios from 'axios';
import { toast } from 'react-toastify';

const URL = import.meta.env.VITE_APP_BASEURL;
console.log("Inside Admin API ::", URL);

const axiosInstance = axios.create({
    baseURL: `${URL}/admin`, // Use template literal correctly
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Fix syntax error
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
            console.error("Network Error or No Response from Server!");
            toast.error("Network Error! Please check your internet connection.");
            return Promise.reject(error);
        }
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(
                    `${URL}/auth/refresh`, // Fix template literal
                    {},
                    { withCredentials: true }
                );
                console.log("New Access Token :::", data, data.accessToken);
                localStorage.setItem("accessToken", data.accessToken);
                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Refresh Token Expired or Invalid!");
                localStorage.removeItem("accessToken");
                window.location.assign("/login"); // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        if (error.response.status === 403) {
            toast.error("Permission Denied!");
        } else if (error.response.status === 404) {
            toast.error("The requested resource was not found!");
        } else if (error.response.status >= 500) {
            toast.error("Something went wrong. Please try again later.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
