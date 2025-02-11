import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { baseURL } from "../../baseUrls/Urls";
import { useNavigate } from "react-router-dom";

function AgentApprovalPage() {
  const [gender, setGender] = useState("male"); // ✅ Default gender
  const [rejectionReason, setRejectionReason] = useState("");
  const location = useLocation();
  const agentId = location.state?.agentId; // Get agentId from navigation state
  const [agent, setAgent] = useState(null);
  const token = localStorage.getItem("access_token");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  



  // Handle agent rejection with a prompt
// Handle agent rejection with a prompt
const handleReject = async () => {
  try {
    const response = await axios.put(
      `${baseURL}/agent_auth/agent_rejected/${agentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      navigate("/Admin_home/agentmanagement");
    }
  } catch (error) {
    alert("Failed to reject agent. Please try again later.");
  }
};

const handleapproved = async () => {
  try {
    const response = await axios.put(
      `${baseURL}/agent_auth/agent_approved/${agentId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      navigate("/Admin_home/agentmanagement");
    }
  } catch (error) {
    alert("Failed to reject agent. Please try again later.");
  }
};


  useEffect(() => {
    if (!agentId) return; // Prevent fetching if agentId is undefined

    const fetchData = async () => {
      try {
        const res = await axios.get(`${baseURL}/agent_auth/agent_approval/${agentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          const agentData = res.data.agents || res.data;
          setAgent(agentData);
          setGender(agentData.gender || "male"); // ✅ Update gender from API
        }
      } catch (error) {
        alert("Failed to fetch agent details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId, token]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!agent) return <div className="text-center py-10 text-red-500">Agent not found.</div>;
  console.log(agent)

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Personal Details</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Gender Selection (Read-only) */}
        <div className="col-span-2 flex gap-4">
          <button className={`flex-1 px-4 py-2 rounded-md ${gender === "Male" ? "bg-blue-500 text-white" : "bg-gray-300"}`} disabled>
            Male
          </button>
          <button className={`flex-1 px-4 py-2 rounded-md ${gender === "Female" ? "bg-pink-500 text-white" : "bg-gray-300"}`} disabled>
            Female
          </button>
        </div>

        {/* Read-only Fields with Data from API */}
        <div className="space-y-2">
          <label className="block font-semibold">Full Name</label>
          <input className="w-full border rounded-md px-3 py-2 bg-gray-100" value={agent.name || ""} readOnly />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Phone</label>
          <input className="w-full border rounded-md px-3 py-2 bg-gray-100" value={agent.phone || ""} readOnly />
        </div>

        <div className="space-y-2 col-span-2">
          <label className="block font-semibold">Email ID</label>
          <input className="w-full border rounded-md px-3 py-2 bg-gray-100" value={agent.email || ""} readOnly />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">City</label>
          <input className="w-full border rounded-md px-3 py-2 bg-gray-100" value={agent.city || ""} readOnly />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Date of Birth</label>
          <input className="w-full border rounded-md px-3 py-2 bg-gray-100" type="date" value={agent.date_of_birth || ""} readOnly />
        </div>

        {/* View ID Proof */}
        <div className="space-y-2 col-span-2">
          <label className="block font-semibold">ID Proof</label>
          {agent.idproof ? (
            <a href={agent.idproof} target="_blank" rel="noopener noreferrer">
              <img src={agent.idproof} alt="ID Proof" className="w-full h-auto" />
              <p>View ID Proof</p>
            </a>
          ) : (
            <span className="text-gray-500">No ID Proof Uploaded</span>
          )}
        </div>

        {/* Feedback Section
        <div className="space-y-2 col-span-2">
          <label className="block font-semibold">Feedback</label>
          <textarea className="w-full border rounded-md px-3 py-2 min-h-[100px]" placeholder="Enter your feedback"></textarea>
        </div> */}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button onClick={handleapproved} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md">Approve</button>
        <button onClick={handleReject} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md">Reject</button>
      </div>

      {/* Display Rejection Reason */}
      {rejectionReason && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          <strong>Rejection Reason:</strong> {rejectionReason}
        </div>
      )}
    </div>
  );
}

export default AgentApprovalPage;
