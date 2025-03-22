import React, { useState } from "react";
import loginpage from "../../assets/login_page_image.jpg";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../../Interceptors/user";
import { baseURL } from "../../baseUrls/Urls";
import { useNavigate } from "react-router-dom";

const PasswordRecovery = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const message = location.state?.message;

  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({ email: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(`${baseURL}/auth/password-recovery`, formData);
      console.log("rrrrrrrr",res)
      if (res.status === 200) {
        localStorage.setItem("email_id", res.data.email_id)
        navigate("/Login_page")
        toast.success("Password reset link has been sent to your email. Please check your inbox.");
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        setFormError(error.response.data.detail || "An error occurred. Please try again.");
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#014751]">Insured+</h1>
          <h2 className="text-lg font-medium text-gray-900 mt-4">Recover Your Password</h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter the email you used when signing up. A password reset link will be sent to you.
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
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value.toLowerCase() })}
                className="w-full text-gray-700 focus:outline-none bg-transparent"
                required
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Send Link
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center ml-2">
        <img src={loginpage} alt="Happy couple with insurance coverage" className="object-cover w-full max-w-[120%] h-auto" />
      </div>
    </div>
  );
};

export default PasswordRecovery;
