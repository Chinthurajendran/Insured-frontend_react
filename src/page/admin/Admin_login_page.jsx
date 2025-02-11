import React, { useState } from "react"
import { baseURL } from "../../baseUrls/Urls"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { admin_login } from "../../store/slices/adminAuthentication"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [formError, setFormError] = useState("") // ✅ Fix: Define state for error messages

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    // ✅ Fix: Make function async
    console.log("cccc")
    e.preventDefault()
    try {
      const res = await axios.post(
        `${baseURL}/admin_auth/admin_login`,
        formData
      )

      if (res.status === 200) {
        console.log(res)
        // ✅ Fix: Correct if statement syntax
        localStorage.setItem("access_token", res.data.access_token)
        localStorage.setItem("refresh_token", res.data.refresh_token)
        // localStorage.setItem("user_id", res.data.user_id)
        localStorage.setItem("user_name", res.data.user_name)

        const decodedToken = jwtDecode(res.data.access_token)
        dispatch(
          admin_login({
            // userid: decodedToken.user.user_id,
            username: res.data.user_name,
            // email: decodedToken.email,
            isAuthenticated: true,
          })
        )
        navigate("/Admin_home", { state: { message: "Login successful!" } })
        toast.success("Login successful! Welcome back.")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.message || "Login failed")
      } else {
        setFormError("An unexpected error occurred. Please try again.")
        console.error("Login Error:", error.message) // ✅ Log error for debugging
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#0B4D2E]">Insured+</h1>
          <h2 className="text-xl font-semibold text-gray-800 mt-2">
            Admin Login
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
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B4D2E]"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          {/* Email Input Field */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            {/* <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full text-gray-700 focus:outline-none"
            /> */}
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

export default AdminLoginPage
