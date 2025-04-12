import axios from "axios"
import { toast } from "react-toastify"
import { baseURL } from "../baseUrls/Urls"
import store from "../store/store"
import { agent_logout } from "../store/slices/agentAuthentication"
import { agent_login } from "../store/slices/agentAuthentication"
import { setagentTokens } from "../store/slices/AgentToken"

const axiosInstance = axios.create({
  baseURL: `${baseURL}/agent_auth`,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().agentToken.agent_access_token
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
        const refreshToken = store.getState().agentToken.agent_refresh_token

        if (!refreshToken) {
          console.error("No refresh token found in Redux!")
          throw new Error("No refresh token available")
        }

        const { data } = await axios.post(
          `${baseURL}/agent_auth/agent_refresh_token`,
          {},
          {
              headers: {
                  Authorization: `Bearer ${refreshToken}`,
              },
              withCredentials: true,
          }
        )
        console.log("New agent Access Token :::", data, data.access_token)

        store.dispatch(
          setagentTokens({
            agent_access_token: data.access_token,
            agent_refresh_token: refreshToken,
          })
        )
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.access_token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error("Refresh Token Expired or Invalid!")
        store.dispatch(agent_logout())
        window.location.assign("/Agent_login_page")
        return Promise.reject(refreshError)
      }
    }
    const agentAuthenticated = store.getState().agentAuth.isAuthenticated_agent
    if (error.response.status === 403) {
      toast.error("Permission Denied!")
    } else if (error.response.status === 404) {
      window.location.assign(`/404?Authenticated=${encodeURIComponent(Authenticated)}`);
      console.error("The requested resource was not found!")
    } else if (error.response.status >= 500) {
      window.location.assign(`/InternalServerError?Authenticated=${encodeURIComponent(agentAuthenticated)}`);
      console.error("Something went wrong. Please try again later.")
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
