import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { agent_login } from "../../store/slices/agentAuthentication"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import axiosInstance from "../../Interceptors/agent"
import { setagentTokens } from "../../store/slices/AgentToken"

const Agent_login_page = () => {
  const [formData, setFormData] = useState({
    agentid: "",
    password: "",
  })
  const [formError, setFormError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await axiosInstance.post(`agent_login`, {
            ...formData,
            latitude,
            longitude,
          })

          if (res.status === 200) {
            const decodedToken = jwtDecode(res.data.agent_access_token)
            dispatch(
              agent_login({
                agent_uuid: decodedToken.user.agnet_id,
                agent_username: decodedToken.user.agent_name,
                agent_email: decodedToken.user.agent_email,
                agnet_userid: decodedToken.user.agent_userid,
                agent_role: decodedToken.user.agent_role,
                isAuthenticated_agent: true,
              })
            )
            dispatch(
              setagentTokens({
                agent_access_token: res.data.agent_access_token,
                agent_refresh_token: res.data.agent_refresh_token,
              })
            )

            navigate("/Agent_home/DashboardGraph", {
              state: { message: "Login successful!" },
            })
            toast.success("Login successful! Welcome back.")
          }
        } catch (error) {
          if (error.response && error.response.data) {
            setFormError(error.response.data.detail || "Login failed")
          } else {
            setFormError("An unexpected error occurred. Please try again.")
          }
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Unable to get location. Please allow location access.")
      }
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0B4D2E]">Insured+</h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-2">
            Agent Login
          </h2>
        </div>
        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Agent ID
            </label>
            <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="Enter your Agent ID"
                value={formData.agentid}
                onChange={(e) =>
                  setFormData({ ...formData, agentid: e.target.value })
                }
                required
                className="w-full text-gray-700 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B4D2E]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/AgentPasswordRecovery"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot my password?
            </Link>
          </div>
          <div className="w-full flex justify-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/Agent_sign_up_page">
                <span className="text-emerald-700 hover:text-emerald-600 font-semibold">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-[#0B4D2E] text-white py-2 rounded-md text-lg font-medium hover:bg-[#083D24] transition duration-300"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Agent_login_page
