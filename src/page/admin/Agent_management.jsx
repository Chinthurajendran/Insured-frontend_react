import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseURL } from '../../baseUrls/Urls';
import Agent_approval_page from './Agent_approval_page';
import { Navigate, useNavigate } from 'react-router-dom';


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


const AdminPolicyManagement = () => {

  const [agent,Setagent] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("access_token")
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) {
      setLoading(false)
      return
    }

    const fatchagnet = async()=>{
      try{
        const res =await axios.get(`${baseURL}/agent_auth/agent_state`,{headers:{ Authorization: `Bearer ${token}` }})
        if(res.status == 200){
          Setagent(res.data.agents || res.data)
        }
      }catch(error){
        alert("Failed to fetch policies. Please try again later.") 
      }finally{
        setLoading(false)
      }
    }
    fatchagnet()
  },[token])

  const handleSubmit = (id) => {
    const selectedAgent = agent.find(user => user.agent_id === id);
    if (selectedAgent && selectedAgent.approval_status === 'processing') {
      navigate("/Agent_approval_page", { state: { agentId: id } });
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full min-w-[1100px] bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white rounded-t-lg">
              <th className="p-3 pl-6 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {agent.map((user, index) => (
              <tr key={user.agent_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} onClick={() => handleSubmit(user.agent_id)}>
                <td className="p-3 pl-6 text-left">{index+101}</td>
                <td className="p-3 text-left">{user.agent_name}</td>
                <td className="p-3 text-left">{user.agent_email}</td>
                <td className="p-3 text-left">
                  <span className={`px-3 py-1 rounded-md text-sm ${getStatusStyles(user.approval_status)}`}>
                    {user.approval_status.charAt(0).toUpperCase() + user.approval_status.slice(1)}
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

export default AdminPolicyManagement;
