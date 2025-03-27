import axios from "axios"
import { toast } from "react-toastify"
import { baseURL } from "../baseUrls/Urls"
import store from "../store/store"
import { logout } from "../store/slices/userAuthentication"
import { login } from "../store/slices/userAuthentication"
import { clearTokens } from "../store/slices/UserToken"
import { setTokens } from "../store/slices/UserToken"

const axiosInstance = axios.create({
  baseURL: `${baseURL}/auth`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().userToken.user_access_token
    // const authState = store.getState().userAuth
    // const token = authState.user_access_token
    console.log("Sending Authorization Header:", token)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (!error.response) {
      console.error("Network Error or No Response from Server!")
      toast.error("Network Error! Please check your internet connection.")
      return Promise.reject(error)
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        
        const refreshToken = store.getState().userToken.user_refresh_token
        console.log("rrrrrrrr",refreshToken)

        if (!refreshToken) {
          console.error("No refresh token found in Redux!")
          throw new Error("No refresh token available")
        }
        const { data } = await axios.post(
          `${baseURL}/auth/user_refresh_token`,
          {},
          {
              headers: {
                  Authorization: `Bearer ${refreshToken}`,
              },
              withCredentials: true,
          }
        )
        console.log("New user Access Token :::", data, data.access_token)
        console.log("New user111111 Access Token :::", data.access_token);
        
        store.dispatch(
          setTokens({
            user_access_token: data.access_token,
            user_refresh_token: refreshToken,
          })
        )
        
        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // console.error("Refresh Token Expired or Invalid!")
        store.dispatch(logout())
        window.location.assign("/Login_page")
        return Promise.reject(refreshError)
      }
    }

    if (error.response.status === 403) {
      toast.error("Permission Denied!")
    } else if (error.response.status === 404) {
      toast.error("The requested resource was not found!")
    } else if (error.response.status >= 500) {
      toast.error("Something went wrong. Please try again later.")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
