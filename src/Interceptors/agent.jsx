import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../baseUrls/Urls';

const axiosInstance = axios.create({
    baseURL: `${baseURL}/agent_auth`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('agent_access_token');
        console.log("Sending Authorization Header:", token); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; 
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
                    `${baseURL}/agent_auth/agent_refresh_token`, 
                    {},
                    { withCredentials: true }
                );
                console.log("New Access Token :::", data, data.agent_access_token);
                localStorage.setItem("agent_access_token", data.agent_access_token);
                originalRequest.headers["Authorization"] = `Bearer ${data.agent_access_token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Refresh Token Expired or Invalid!");
                localStorage.removeItem("agent_access_token");
                window.location.assign("/Agent_login_page");
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



export default axiosInstance

