import React, { useState } from "react"
import { baseURL } from "../../baseUrls/Urls"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom" // ✅ Fix: Import Link
import { jwtDecode } from "jwt-decode"
import { agent_login } from "../../store/slices/agentAuthentication"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi";

const Agent_login_page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [formError, setFormError] = useState("") // ✅ Fix: Define error state

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${baseURL}/agent_auth/agent_login`,
        formData
      )

      if (res.status === 200) {
        // ✅ Fix: Adjust status code check
        localStorage.setItem("access_token", res.data.access_token)
        localStorage.setItem("refresh_token", res.data.refresh_token)
        localStorage.setItem("user_id", res.data.user_id)
        localStorage.setItem("user_name", res.data.user_name)
        const decodedToken = jwtDecode(res.data.access_token)

        dispatch(
          agent_login({
            userid: decodedToken.user.user_id,
            username: res.data.user_name,
            email: decodedToken.email,
            isAuthenticated: true,
          })
        )

        navigate("/Agent_home", { state: { message: "Login successful!" } })
        toast.success("Login successful! Welcome back.")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail || "Login failed") // ✅ Fix: Adjust error message extraction
      } else {
        setFormError("An unexpected error occurred. Please try again.")
      }
    }
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
       {/* Display error message with icon at the top of the form */}
       {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" /> {/* Add error icon */}
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email ID
            </label>
            {/* Email Input Field */}
            <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
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

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot my password?
            </Link>
          </div>

          {/* Divider Line */}
          <div className="my-4 border-t border-gray-300"></div>

          {/* Signup Link */}
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
