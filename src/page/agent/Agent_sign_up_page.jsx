import React, { useState } from "react"
import loginpage from "../../assets/agent.jpg"
import { Link, useNavigate } from "react-router-dom"
import { baseURL } from "../../baseUrls/Urls"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiAlertCircle } from "react-icons/fi"

const AgentSignUpPage = () => {
  const [formErrors, setFormErrors] = useState("")
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, id_proof: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      setFormErrors(["Passwords do not match."])
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
      setFormErrors(error.response.data.detail)
    }
  }
  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#014751] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Sign Up</h2>
        </div>

        {formErrors && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formErrors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
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
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-[#014751] text-white p-2 rounded"
          >
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/Agent_login_page" className="text-emerald-700">
            Log in
          </Link>
        </p>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img
          src={loginpage}
          alt="Sign Up"
          className="object-cover w-full max-w-[120%] h-auto"
        />
      </div>
    </div>
  )
}

export default AgentSignUpPage
