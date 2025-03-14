import { useLocation } from "react-router-dom";
import axiosInstance from "../../Interceptors/user";
import { useEffect, useState } from "react";

function PolicyInformation() {
  const location = useLocation();
  const PolicyId = location.state?.policyinfo_uid;
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        console.log("Fetching policy details for ID:", PolicyId);
        const response = await axiosInstance.get(
          `PolicyinfoDetails/${PolicyId}`
        );
        console.log("API Response:", response.data);

        if (response.status === 200) {
          setPolicy(response.data?.policies || response.data);
        }
      } catch (error) {
        console.error("Error fetching policy details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [PolicyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-600 to-blue-900">
        <p className="text-white text-xl font-semibold animate-pulse">
          Loading policy details...
        </p>
      </div>
    );
  }

  if (!policy || policy.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-600 to-blue-900">
        <p className="text-white text-xl font-semibold">
          No policy details available.
        </p>
      </div>
    );
  }

  const { photo, policyinfo_name, titledescription, description } = policy[0] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-900 text-white flex flex-col items-center">
      {/* Header Section */}
      <div className="relative w-full h-[400px]">
        {photo && <img src={photo} alt="Policy" className="w-full h-full object-cover rounded-b-xl shadow-lg" />}
        <div className="absolute inset-0 bg-opacity-50 flex justify-center items-center">
          <h1 className="text-5xl font-extrabold text-white text-center px-6 drop-shadow-lg">
            {policyinfo_name}
          </h1>
        </div>
      </div>

      {/* Policy Details Section */}
      <div className="w-full max-w-4xl bg-white text-gray-900 p-8 rounded-2xl shadow-xl -mt-20 z-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {titledescription || "Policy Overview"}
        </h2>
        <div className="text-gray-700 text-lg leading-8" dangerouslySetInnerHTML={{ __html: description }}></div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl bg-opacity-70 mt-8 p-4 rounded-lg shadow-md bg-white text-gray-700">
        <h3 className="text-xl font-semibold mb-4">Why Choose Us:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>✔ Comprehensive Coverage Plans</li>
          <li>✔ Trusted By Millions</li>
          <li>✔ Seamless Claim Processing</li>
          <li>✔ Affordable Premium Options</li>
          <li>✔ Exceptional Customer Support</li>
        </ul>
      </div>
    </div>
  );
}

export default PolicyInformation;
