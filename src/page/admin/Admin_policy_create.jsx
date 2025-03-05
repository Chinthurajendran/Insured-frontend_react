import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import axiosInstance from "../../Interceptors/admin"

const Admin_policy_create = () => {
  const [formData, setFormData] = useState({
    policy_name: "",
    policy_type: "",
    coverage: "",
    settlement: "",
    premium_amount: "",
    age_group: "",
    income_range: "",
    id_proof: false,
    passbook: false,
    photo: false,
    pan_card: false,
    income_proof: false,
    nominee_address_proof: false,
    description: "",
  })

  const [formError, setFormError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "policy_name"
        ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Form Submitted", formData)

    try {
      const response = await axiosInstance.post(
        `policy_create`,
        formData)

      if (response.status === 201) {
        navigate("/Admin_home/policy", {
          state: { message: "Policy created successfully!" },
        })
        toast.success("Policy created successfully!")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail)
      } else {
        setFormError(["An unexpected error occurred. Please try again."])
      }
    }
  }
  return (
    <div className="w-full max-w-6xl mx-auto p-8 flex flex-col space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Create a Policy
      </h2>

      {formError && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
          <FiAlertCircle className="mr-2" />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Policy Name", name: "policy_name", type: "text" },
            { label: "Coverage Age", name: "coverage", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Settlement %", name: "settlement", type: "number" },
            { label: "Amount", name: "premium_amount", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">
            Policy Type
          </label>
          <select
            name="policy_type"
            value={formData.policy_type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
            required
          >
            <option value="">Select policy type</option>
            <option value="Term Insurance">Life Insurance</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            {
              label: "Age Group",
              name: "age_group",
              options: [
                "18-25",
                "26-35",
                "36-45",
                "46-55",
                "56-65",
                "66-70",
                "70+",
              ],
            },
            {
              label: "Income Range",
              name: "income_range",
              options: [
                "0 - 2,50,000",
                "2,50,001 - 5,00,000",
                "5,00,001 - 10,00,000",
                "10,00,001 - 25,00,000",
                "25,00,001 - 50,00,000",
                "50,00,001 and above",
              ],
            },
          ].map(({ label, name, options }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold text-gray-700">
                {label}
              </label>
              <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <label className="block font-bold text-gray-700 mb-4 text-lg">
            Required Documents
          </label>
          <div className="flex flex-wrap gap-4">
            {[
              "id_proof",
              "passbook",
              "photo",
              "pan_card",
              "income_proof",
              "nominee_address_proof",
            ].map((doc) => (
              <div key={doc} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={doc}
                  name={doc}
                  checked={formData[doc]}
                  onChange={handleChange}
                  className="w-6 h-6 accent-red-500"
                />
                <label htmlFor={doc} className="text-gray-700 font-medium">
                  {doc.replace("_", " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm min-h-[120px]"
            placeholder="Enter description"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
        >
          Create Policy
        </button>
      </form>
    </div>
  )
}

export default Admin_policy_create
