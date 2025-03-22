import axios from "axios"
import { toast } from "react-toastify"
import { baseURL } from "../baseUrls/Urls"
import store from "../store/store"
import { admin_logout } from "../store/slices/adminAuthentication"
import { admin_login } from "../store/slices/adminAuthentication"
import { setAdminTokens } from "../store/slices/AdminToken"

const axiosInstance = axios.create({
  baseURL: `${baseURL}/admin_auth`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().adminToken.admin_access_token
    console.log("Sending11 Authorization Header:", token)
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
    console.log("rrrr", originalRequest)
    if (!error.response) {
      console.error("Network Error or No Response from Server!")
      toast.error("Network Error! Please check your internet connection.")
      return Promise.reject(error)
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = store.getState().adminToken.admin_refresh_token
        console.log("Header:", refreshToken)
        if (!refreshToken) {
          console.error("No refresh token found in Redux!")
          throw new Error("No refresh token available")
        }

        const { data } = await axios.post(
          `${baseURL}/admin_auth/admin_refresh_token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
            withCredentials: true,
          }
        )
        console.log("New agent Access Token :::",data.agent_access_token)
        store.dispatch(
          admin_login({ admin_access_token: data.admin_access_token })
        )
        store.dispatch(
          setAdminTokens({
            admin_access_token: data.admin_access_token,
            admin_refresh_token: refreshToken,
          })
        )
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.admin_access_token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("Refresh Token Expired or Invalid!")
        store.dispatch(admin_logout())
        window.location.assign("/Admin_login_page")
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
