import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FiAlertCircle } from "react-icons/fi";
import axiosInstance from "../../Interceptors/agent";
import { baseURL } from "../../baseUrls/Urls";
import loginpage from "../../assets/login_page_image.jpg";

const AgentPasswordRecovery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const [formData, setFormData] = useState({ agentID: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const res = await axiosInstance.post(`${baseURL}/agent_auth/password-recovery`, formData);
      if (res.status === 200) {
        localStorage.setItem("agentID", res.data.agentID);
        toast.success("Password reset link sent! Check your inbox.");
        navigate("/Agent_login_page");
      }
    } catch (error) {
      if (error.response) {
        setFormError(error.response.data.detail || "Invalid Agent ID or Network Error.");
      } else if (error.request) {
        console.log(error.response)
        setFormError("No response from server. Please check your connection.");
      } else {
        setFormError("Unexpected error occurred. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#014751]">Insured+</h1>
          <h2 className="text-lg font-medium text-gray-900 mt-4">Recover Your Password</h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter the agent ID you used when signing up. A password reset link will be sent to you.
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
                type="text"
                placeholder="Enter your agent ID"
                value={formData.agentID}
                onChange={(e) => setFormData((prev) => ({ ...prev, agentID: e.target.value }))}
                className="w-full text-gray-700 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          <button
            className="w-full mt-4 flex items-center justify-center gap-3 px-4 py-3 text-white bg-[#014751] hover:bg-[#013a41] rounded-lg font-bold transition duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Link"}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center ml-2">
        <img src={loginpage} alt="Happy couple with insurance coverage" className="object-cover w-full max-w-[120%] h-auto" />
      </div>
    </div>
  );
};

export default AgentPasswordRecovery;
