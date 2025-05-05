import React, { useState, useEffect } from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi" // Importing eye icons

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const Sign_up = () => {
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  })
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // For confirm password

  const navigate = useNavigate()

  // Load email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const usernameRegex = /^[A-Za-z\s]+$/
    if (!usernameRegex.test(formData.username)) {
      setFormError("Username should only contain letters.")
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setFormError(
        "Password should be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character."
      )
      return
    }

    if (formData.password !== formData.confirm_password) {
      setFormError("Passwords do not match.")
      return
    }

    try {
      const res = await axios.post(`${baseURL}/auth/signup`, formData)
      if (res.status === 201) {
        localStorage.removeItem("email")
        toast.success("Registration successful! Please log in.")
        navigate("/Login_page")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail)
      } else {
        setFormError("An unexpected error occurred. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5 ml-30">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#014751] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Sign Up</h2>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value.toLowerCase(),
                })
              }
              className="w-full text-gray-700 focus:outline-none"
            />
          </div>

          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full text-gray-700 focus:outline-none"
              readOnly
              required
            />
          </div>

          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full text-gray-700 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle showPassword
              className="text-gray-500 focus:outline-none"
            >
              {showPassword ? (
                <FiEyeOff size={20} /> // Eye Off icon when password is visible
              ) : (
                <FiEye size={20} /> // Eye icon to show password
              )}
            </button>
          </div>

          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
              className="w-full text-gray-700 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirmPassword
              className="text-gray-500 focus:outline-none"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} /> // Eye Off icon when confirm password is visible
              ) : (
                <FiEye size={20} /> // Eye icon to show confirm password
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-[#014751] hover:bg-[#013a41] rounded-lg font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
            Register
          </button>
        </form>

        <div className="mt-4 w-full flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/Loginpage_with_google"
              className="text-emerald-700 hover:text-emerald-600 font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center ml-2">
        <img
          src={loginpage}
          alt="Happy couple with insurance coverage"
          className="object-cover w-full max-w-[120%] h-auto"
        />
      </div>
    </div>
  )
}

export default Sign_up
