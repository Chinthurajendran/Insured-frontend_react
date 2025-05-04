import axios from "axios"
import { toast } from "react-toastify"
import store from "../store/store"
import { admin_logout } from "../store/slices/adminAuthentication"
import { admin_login } from "../store/slices/adminAuthentication"
import { setAdminTokens } from "../store/slices/AdminToken"
import.meta.env

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const axiosInstance = axios.create({
  baseURL: `${baseURL}/admin_auth`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().adminToken.admin_access_token
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
      return Promise.reject(error)
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = store.getState().adminToken.admin_refresh_token
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
    const adminAuthenticated = store.getState().adminAuth.isAuthenticated_admin
    if (error.response.status === 403) {
      console.log("Permission Denied!")
    } else if (error.response.status === 404) {
      window.location.assign(`/404?Authenticated=${encodeURIComponent(Authenticated)}`);
      console.log("The requested resource was not found!")
    } else if (error.response.status >= 500) {
      window.location.assign(`/InternalServerError?Authenticated=${encodeURIComponent(adminAuthenticated)}`);
      console.log("Something went wrong. Please try again later.")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
