import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Interceptors/admin";

const PolicyInfo = () => {
  const [policy, Setpolicy] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axiosInstance.get("Policyinfo_list");
        if (response.status === 200) {
          const policies = response.data.policies || response.data;
          const approvedPolicies = policies.filter(policy => policy.delete_status === "False");
          Setpolicy(approvedPolicies);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-policy/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await axiosInstance.delete(`PolicyDetails_delete/${id}`);
        Setpolicy(policy.filter(item => item.policyinfo_uid !== id)); // Corrected property name
      } catch (error) {
        console.error("Error deleting policy:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">Policy Info</h1>
        <button 
          onClick={() => navigate("/PolicyInfoCreate")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          Create Policy
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full min-w-[1100px] bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="p-3 text-left">No</th>
              <th className="p-3 text-left">Photo</th>
              <th className="p-3 text-left">Policy Name</th>
              <th className="p-3 text-left">Title Description</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policy.map((item, index) => (
              <tr key={item.policyinfo_uid} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}>
                <td className="p-3 text-left">{index + 1}</td>
                <td className="p-3 text-left">
                  <img src={item.photo} alt={item.policyinfo_name} className="w-16 h-16 object-cover rounded-md" />
                </td>
                <td className="p-3 text-left">{item.policyinfo_name}</td>
                <td className="p-3 text-left">{item.titledescription}</td>
                <td className="p-3 text-left">{item.description.substring(0, 100)}...</td>
                <td className="p-3 text-left flex space-x-2">
                  <button onClick={() => handleEdit(item.policyinfo_uid)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.policyinfo_uid)} className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyInfo;
