import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Interceptors/admin";

const getStatusStyles = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-500 text-white";
    case "processing":
      return "bg-blue-400 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-400 text-black";
  }
};

const formatStatus = (status) => status?.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const PolicyStatus = () => {
  const [policy, Setpolicy] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axiosInstance.get("PolicyDetails_list");
        if (response.status === 200) {
          const filteredPolicies = response.data.policies.filter(policy => policy.agent_id !== "None");
          Setpolicy(filteredPolicies);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
        alert("Failed to fetch policies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPolicies();
  }, []);
  
  

console.log(policy)

  const handleSubmit = (id) => {
    const selectedPolicy = policy.find(({ policydetails_uid }) => policydetails_uid === id);
    if (selectedPolicy?.policy_status === "rejected") {
      navigate("/PolicyResubmit", { state: { policydetails_uid: id } });
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-bold text-gray-700 mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Policy Approval & Rejection</h1>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full min-w-[1100px] bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white rounded-t-lg">
              <th className="p-3 pl-6 text-left">No</th>
              <th className="p-3 text-left">Policy Holder</th>
              <th className="p-3 text-left">Policy Type</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Premium Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {policy.map((user, index) => (
              <tr
                key={user.agent_id}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} cursor-pointer`}
                onClick={() => handleSubmit(user.policydetails_uid)}
              >
                <td className="p-3 pl-6 text-left">{index + 101}</td>
                <td className="p-3 text-left">{user.policy_holder}</td>
                <td className="p-3 text-left">{user.policy_type}</td>
                <td className="p-3 text-left">{user.age}</td>
                <td className="p-3 text-left">{user.premium_amount}</td>
                <td className="p-3 text-left">
                  <span className={`px-3 py-1 rounded-md text-sm ${getStatusStyles(user.policy_status)}`}>
                    {formatStatus(user.policy_status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyStatus;
