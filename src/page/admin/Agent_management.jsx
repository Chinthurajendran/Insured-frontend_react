import axios from "axios"
import React, { useEffect, useState } from "react"
import { baseURL } from "../../baseUrls/Urls"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/admin"
import { useSelector } from "react-redux"

const getStatusStyles = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-500 text-white"
    case "processing":
      return "bg-blue-400 text-white"
    case "rejected":
      return "bg-red-500 text-white"
    default:
      return "bg-gray-400 text-black"
  }
}

const AdminPolicyManagement = () => {
  const [agent, Setagent] = useState([])
  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.adminToken.admin_access_token)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchAgent = async () => {
      try {
        const res = await axiosInstance.get(`agent_management`)
        if (res.status === 200) {
          Setagent(res.data.agents || res.data)
        }
      } catch (error) {
        alert("Failed to fetch policies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchAgent()
  }, [token])

  const handleSubmit = (id) => {
    const selectedAgent = agent.find((user) => user.agent_id === id)
    if (selectedAgent && selectedAgent.approval_status === "processing") {
      navigate("/Agent_approval_rejection_page", { state: { agentId: id } })
    }
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = agent.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(agent.length / usersPerPage)
  
  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Agent Management
      </h1>
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
            {currentUsers.map((user, index) => (
              <tr
                key={user.agent_id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
                onClick={() => handleSubmit(user.agent_id)}
              >
                <td className="p-3 pl-6 text-left">{index + 1}</td>
                <td className="p-3 text-left">{user.agent_name}</td>
                <td className="p-3 text-left">{user.agent_email}</td>
                <td className="p-3 text-left">
                  <span
                    className={`px-3 py-1 rounded-md text-sm ${getStatusStyles(
                      user.approval_status
                    )}`}
                  >
                    {user.approval_status.charAt(0).toUpperCase() +
                      user.approval_status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <div className="flex justify-center items-center mt-6 space-x-2">

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-semibold transition-all 
      ${
        currentPage === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
        >
          ← Previous
        </button>

        <span className="px-5 py-2 text-lg font-bold text-gray-800 bg-gray-200 rounded-md shadow-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-semibold transition-all 
      ${
        currentPage === totalPages
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default AdminPolicyManagement
