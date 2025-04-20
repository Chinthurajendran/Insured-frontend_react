import React, { useEffect, useState } from "react";
import axiosInstance from "../../Interceptors/agent";
import { useSelector } from "react-redux";
import Chat from "./Chat";

function CustomerAssistance() {
  const [Assistance, SetAssistance] = useState([]);
  const agentId = useSelector((state) => state.agentAuth.agent_uuid);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSeen, setisSeen] = useState(false);
  const [selectedAssistance, setSelectedAssistance] = useState(null); 
  useEffect(() => {
    if (!agentId) return; 
    const fetchCustomerCare = async () => {
      try {
        const res = await axiosInstance.get(`customercare/${agentId}`);
        if (res.status === 200) {
          SetAssistance(res.data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching customer assistance:", error);
      }
    };

    fetchCustomerCare();
  }, [agentId]);

  const handleRowClick = (assistance) => {
    setisSeen(true)
    setIsChatOpen(true);
    setSelectedAssistance(assistance);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 mt-5">
        Assistance List
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg mx-auto w-[800px]">
        <table className="w-full bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white rounded-t-lg">
              <th className="p-3 pl-6 text-left">ID</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {Assistance.length > 0 ? (
              Assistance.map((assistance, index) => (
                <tr
                  key={assistance.uid}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  } hover:bg-gray-300 cursor-pointer transition duration-200`}
                  onClick={() => handleRowClick(assistance)}
                >
                  <td className="p-3 pl-6 text-left">{index + 1}</td>
                  <td className="p-3 text-left">{assistance.sender_name}</td>
                  <td className="p-3 text-left">
                    {assistance.status || "Pending"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No customer assistance requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isChatOpen && selectedAssistance && (
        <Chat
          setIsChatOpen={setIsChatOpen}
          sender_id={selectedAssistance.receiver_id}
          receiver_id={selectedAssistance.sender_id}
        />
      )}
    </div>
  );
}

export default CustomerAssistance;
