import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../baseUrls/Urls";
import { Link } from "react-router-dom";

const PolicyCreatePage = () => {
  const [formData, setFormData] = useState({
    policy_id: "",              // Changed from Policy_ID
    policy_name: "",            // Changed from Policy_Name
    policy_type: "",            // Changed from Policy_Type
    coverage: "",               // Changed from Coverage_Age
    settlement: "",             // Changed from Settlement
    premium_amount: "",         // Changed from Amount
    age_group: "",              // Changed from Age_Group
    income_range: "",           // Changed from Income_Range
    id_proof: false,            // Changed from Id_Proof
    passbook: false,            // Changed from Passbook_Copy
    photo: false,               // Changed from Photo
    pan_card: false,            // Changed from Pan_Card
    income_proof: false,        // Changed from Income_Proof
    nominee_address_proof: false, // Changed from Nominee_Address_Proof
    description: "",            // Changed from Description
  });

  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);

    try {
      const response = await axios.post(
        `${baseURL}/admin_auth/policy_create`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        navigate("/Admin_home/policy", {
          state: { message: "Policy created successfully!" },
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail); // Handle API error response
      } else {
        setFormError(["An unexpected error occurred. Please try again."]); // Default error message
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8 flex flex-col space-y-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Create a Policy
      </h2>

      {formError && (
        <div className="text-red-500 font-medium text-center">
          {Array.isArray(formError) ? formError.join(", ") : formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Policy ID", name: "policy_id", type: "text" },             // Updated field name
            { label: "Policy Name", name: "policy_name", type: "text" },         // Updated field name
            { label: "Coverage Age", name: "coverage", type: "text" },           // Updated field name
          ].map(({ label, name, type }) => (
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

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: "Settlement %", name: "settlement", type: "number" },       // Updated field name
            { label: "Amount", name: "premium_amount", type: "number" },         // Updated field name
          ].map(({ label, name, type }) => (
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

        {/* Policy Type */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">Policy Type</label>
          <select
            name="policy_type"                                           // Updated field name
            value={formData.policy_type}                                 // Updated field name
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
            required
          >
            <option value="">Select policy type</option>
            <option value="Term Insurance">Term Insurance</option>
            <option value="Whole Life">Whole Life</option>
            <option value="Endowment">Endowment</option>
          </select>
        </div>

        {/* Age Group & Income Range */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: "Age Group", name: "age_group", options: ["18-25", "26-35", "36-45", "46-55", "56-65", "66-70", "70+"] },  // Updated field name
            { label: "Income Range", name: "income_range", options: ["₹0 - ₹2,50,000", "₹2,50,001 - ₹5,00,000", "₹5,00,001 - ₹10,00,000", "₹10,00,001 - ₹25,00,000", "₹25,00,001 - ₹50,00,000", "₹50,00,001 and above"] },  // Updated field name
          ].map(({ label, name, options }) => (
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

        {/* Required Documents */}
        <div className="mt-2">
          <label className="block font-bold text-gray-700 mb-4 text-lg">
            Required Documents
          </label>
          <div className="flex flex-wrap gap-4">
            {["id_proof", "passbook", "photo", "pan_card", "income_proof","nominee_address_proof"].map((doc) => (  // Updated field names
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
            name="description"                                        // Updated field name
            value={formData.description}                              // Updated field name
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
          Create Policy
        </button>
      </form>
    </div>
  );
};

export default PolicyCreatePage;
