import React, { useState } from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import axios from "axios"
import.meta.env

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const Resetpassword = () => {
  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setFormError(
        "Password should be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one digit, and one special character."
      )
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match!")
      return
    }
    const email = localStorage.getItem("email_id")
    if (!email) {
      console.log("Email ID is missing.")
      return
    }

    try {
      const res = await axios.post(`${baseURL}/auth/passwordreset`, {
        password: formData.password,
        email,
      })

      if (res.status === 200) {
        navigate("/Login_page", {
          state: { message: "Password reset successful!" },
        })
        toast.success("Password reset successful!")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail || "Password reset failed")
      } else {
        setFormError("An unexpected error occurred. Please try again.")
      }
    } finally {
      localStorage.removeItem("email_id")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5 ml-30">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#014751]">Insured+</h1>
          <h2 className="text-lg font-medium text-gray-900 mt-4">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter your new password and confirm it to reset your password.
          </p>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#014751]">
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full text-gray-700 focus:outline-none bg-transparent"
              />
            </div>

            <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#014751]">
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full text-gray-700 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <button className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-3 text-white bg-[#014751] hover:bg-[#013a41] rounded-lg font-bold transition duration-300">
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
            Reset Password
          </button>
        </form>
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

export default Resetpassword
