import React, { useEffect, useState } from "react"
import { baseURL } from "../../baseUrls/Urls"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { admin_login } from "../../store/slices/adminAuthentication"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [formError, setFormError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const admin_token = localStorage.getItem("admin_access_token")

  useEffect(() => {
    if (admin_token) {
      navigate("/Admin_home")
    }
  }, [admin_token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${baseURL}/admin_auth/admin_login`,
        formData
      )

      if (res.status === 200) {
        console.log(res)
        localStorage.setItem("admin_access_token", res.data.admin_access_token)
        localStorage.setItem(
          "admin_refresh_token",
          res.data.admin_refresh_token
        )
        localStorage.setItem("admin_username", res.data.admin_username)
        const decodedToken = jwtDecode(res.data.admin_access_token)
        dispatch(
          admin_login({
            admin_username: decodedToken.user.admin_username,
            isAuthenticated_admin: true,
          })
        )
        navigate("/Admin_home", { state: { message: "Login successful!" } })
        toast.success("Login successful! Welcome back.")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail || "Login failed")
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
            Admin Login
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
              Username
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
