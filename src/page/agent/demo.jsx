import React, { useState } from "react";
import loginpage from "../../assets/agent.jpg";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../baseUrls/Urls";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgentSignUpPage = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    id_proof: null,
  });

  const navigate = useNavigate();

  // Handle input change for text fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, id_proof: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setFormErrors(["Passwords do not match."]);
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirm_password", formData.confirm_password);
    if (formData.id_proof) data.append("id_proof", formData.id_proof);
    console.log("Form data entries:");
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1].name ? pair[1].name : pair[1]}`); // Log file name or value
    }
    try {
      const res = await axios.post(`${baseURL}/agent_auth/agent_sign`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        toast.success("Registration successful! Please log in.");
        navigate("/Agent_login_page");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormErrors(error.response.data.detail ? [error.response.data.detail] : ["An unexpected error occurred. Please try again."]);
      } else {
        setFormErrors(["An unexpected error occurred. Please try again."]);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 max-w-md px-5">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#014751] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Sign Up</h2>
        </div>
 {/* Error Messages */}
 {formErrors.length > 0 && (
        <div className="text-red-500 text-center mb-4">
          {formErrors.map((error, index) => (
            <p key={index}>{typeof error === "string" ? error : JSON.stringify(error)}</p>
          ))}
        </div>
      )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className="w-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          {/* Upload ID Proof */}
          <div className="w-full flex flex-col gap-1">
            <label className="text-gray-700 text-sm">Upload ID Proof</label>
            <input
              type="file"
              name="id_proof"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-700 rounded-lg p-2"
            />
          </div>

          {/* Submit Button */}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 w-full flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/Agent_login_page" className="text-emerald-700 hover:text-emerald-600 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <img src={loginpage} alt="Happy couple with insurance coverage" className="object-cover w-full max-w-[120%] h-auto" />
      </div>
    </div>
  );
};

export default AgentSignUpPage;
