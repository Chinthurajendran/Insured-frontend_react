import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../../Interceptors/admin";

const REQUIRED_DOCUMENTS = [
  "id_proof",
  "passbook",
  "photo",
  "pan_card",
  "income_proof",
  "nominee_address_proof",
];

const textFields = [
  { label: "Policy Name", name: "policy_name", type: "text" },
  { label: "Coverage Age", name: "coverage", type: "text" },
];

const numericFields = [
  { label: "Settlement %", name: "settlement", type: "number" },
  { label: "Amount", name: "premium_amount", type: "number" },
];

const selectFields = {
  policy_type: {
    label: "Policy Type",
    options: ["Term Insurance", "Life Insurance"],
  },
};

const groupedSelectFields = [
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
];

const AdminPolicyEdit = () => {
  const [formData, setFormData] = useState({
    policy_name: "",
    policy_type: "",
    coverage: "",
    settlement: "",
    premium_amount: "",
    age_group: "",
    income_range: "",
    // Document checkboxes – defaulted to false
    id_proof: false,
    passbook: false,
    photo: false,
    pan_card: false,
    income_proof: false,
    nominee_address_proof: false,
    description: "",
  });
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const policyId = location.state?.policy_Id;
  const token = localStorage.getItem("admin_access_token");

  // Generic change handler (works for text, number, select and checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Fetch existing policy details on mount
  useEffect(() => {
    if (!token) return;

    const fetchPolicy = async () => {
      try {
        const res = await axiosInstance.get(`policy_edit_list/${policyId}`);
        if (res.status === 200) {
          // Depending on API response structure, adjust data extraction as needed.
          const policy = res.data.policy ? res.data.policy[0] : res.data[0];
          setFormData({
            policy_name: policy.policy_name,
            policy_type: policy.policy_type,
            coverage: policy.coverage,
            settlement: policy.settlement,
            premium_amount: policy.premium_amount,
            age_group: policy.age_group,
            income_range: policy.income_range,
            id_proof: policy.id_proof,
            passbook: policy.passbook,
            photo: policy.photo,
            pan_card: policy.pan_card,
            income_proof: policy.income_proof,
            nominee_address_proof: policy.nominee_address_proof,
            description: policy.description,
          });
        }
      } catch (error) {
        console.error("Error fetching policy:", error);
        alert("Failed to fetch policy. Please try again later.");
      }
    };

    fetchPolicy();
  }, [token, policyId]);

  // Handle form submission for editing policy
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`policy_edit/${policyId}`, formData);
      if (response.status === 200) {
        navigate("/Admin_home/policy", {
          state: { message: "Policy updated successfully!" },
        });
        toast.success("Policy updated successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 flex flex-col space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Edit Policy Details
      </h2>

      {formError && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
          <FiAlertCircle className="mr-2" />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Inputs */}
        <div className="grid grid-cols-3 gap-6">
          {textFields.map(({ label, name, type }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold text-gray-700">{label}</label>
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

        {/* Numeric Inputs */}
        <div className="grid grid-cols-3 gap-6">
          {numericFields.map(({ label, name, type }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold text-gray-700">{label}</label>
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

        {/* Policy Type Select */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Policy Type</label>
          <select
            name="policy_type"
            value={formData.policy_type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
            required
          >
            <option value="">Select policy type</option>
            {selectFields.policy_type.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Grouped Select Fields */}
        <div className="grid grid-cols-2 gap-6">
          {groupedSelectFields.map(({ label, name, options }) => (
            <div key={name} className="space-y-2">
              <label className="block font-semibold text-gray-700">{label}</label>
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

        {/* Required Documents Checkboxes */}
        <div className="mt-2">
          <label className="block font-bold text-gray-700 mb-4 text-lg">
            Required Documents
          </label>
          <div className="flex flex-wrap gap-4">
            {REQUIRED_DOCUMENTS.map((doc) => (
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

        {/* Description */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm min-h-[120px]"
            placeholder="Enter description"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
        >
          Update Policy
        </button>
      </form>
    </div>
  );
};

export default AdminPolicyEdit;
