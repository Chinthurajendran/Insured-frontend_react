import React, { useState } from "react"
import loginpage from "../../assets/agent.jpg"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi" // Using your preferred icons
import "react-toastify/dist/ReactToastify.css"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const AgentSignUpPage = () => {
  const [formErrors, setFormErrors] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    city: "",
    id_proof: null,
  })

  const navigate = useNavigate()

  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setFormErrors("Only JPG or PNG files are allowed.")
      return
    }
    setFormData({ ...formData, id_proof: file })
  }

  const validateForm = () => {
    setLoading(true)
    const {
      username,
      email,
      password,
      confirm_password,
      phone,
      city,
      date_of_birth,
    } = formData

    if (!/^[A-Za-z\s]+$/.test(username))
      return "Username should contain only letters."
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email."
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      return "Password must be strong (8+ chars, upper, lower, digit, special)."
    }

    if (password !== confirm_password) return "Passwords do not match."
    if (!/^[1-9]{1}[0-9]{9}$/.test(phone) || phone === "0000000000")
      return "Enter a valid 10-digit phone number."
    if (!/^[A-Za-z\s]+$/.test(city)) return "City should contain only letters."
    if (calculateAge(date_of_birth) < 18)
      return "You must be at least 18 years old."
    if (!formData.id_proof) return "Please upload ID proof (JPG/PNG)."

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validateForm()
    if (error) {
      setFormErrors(error)
      return
    }

    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key])
    })

    try {
      const res = await axios.post(`${baseURL}/agent_auth/agent_sign`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.status === 201) {
        toast.success("Registration submitted for admin approval.")
        navigate("/Agent_login_page")
      }
    } catch (error) {
      setLoading(false)
      setFormErrors(error.response?.data?.detail || "Something went wrong")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white">
      {/* Left Image Side */}
      <div className="hidden lg:flex w-1/2 h-full items-center justify-center">
        <img
          src={loginpage}
          alt="Sign Up"
          className="object-contain w-4/5 h-4/5"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-[#014751] mb-6">Insured+</h1>
            <h2 className="text-xl font-medium text-gray-900">Sign Up</h2>
          </div>

          {formErrors && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
              <FiAlertCircle className="mr-2" />
              {formErrors}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full border p-2 rounded pr-10"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                className="w-full border p-2 rounded pr-10"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="file"
              name="id_proof"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="w-full bg-[#014751] text-white p-2 rounded"
            >
              {loading ? "Register..." : "Register"}
            </button>
          </form>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/Agent_login_page" className="text-emerald-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AgentSignUpPage
