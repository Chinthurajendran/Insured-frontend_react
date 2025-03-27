import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/admin"
import { toast } from "react-toastify"

const PolicyInfo = () => {
  const [policy, Setpolicy] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(3)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axiosInstance.get("Policyinfo_list")
        if (response.status === 200) {
          const policies = response.data.policies || response.data
          const approvedPolicies = policies.filter(
            (policy) => policy.delete_status === "False"
          )
          Setpolicy(approvedPolicies)
          const savedPage = sessionStorage.getItem("currentPage")
          if (savedPage) {
            setCurrentPage(Number(savedPage))
            sessionStorage.removeItem("currentPage") 
          }
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicies()
  }, [])

  const handleEdit = (id) => {
    sessionStorage.setItem("currentPage", currentPage)
    navigate(`/PolicyInfoCreate`, {
      state: { editestats: true, policy_Id: id },
    })
  }

  const handleDelete = async (id) => {
    sessionStorage.setItem("currentPage", currentPage)
    try {
      const response = await axiosInstance.put(`policy_info/${id}`)
      if (response.status === 200) {
        Setpolicy((prevPolicies) =>
          prevPolicies.filter((policy) => policy.policyinfo_uid !== id)
        )
        toast.success("Deleted successfully.")
      }
    } catch (error) {
      toast.error("Failed to delete the user.")
      console.error("Error:", error)
    }
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = policy.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(policy.length / usersPerPage)
  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
          Policy Info
        </h1>
        <button
          onClick={() => navigate("/PolicyInfoCreate")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          Create Policy
        </button>
      </div>
      <div className=" rounded-xl shadow-lg">
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
            {currentUsers.map((item, index) => (
              <tr
                key={item.policyinfo_uid}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}`}
              >
                <td className="p-3 text-left">{index + 1}</td>
                <td className="p-3 text-left">
                  <img
                    src={item.photo}
                    alt={item.policyinfo_name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 text-left">{item.policyinfo_name}</td>
                <td className="p-3 text-left">{item.titledescription}</td>
                <td className="p-3 text-left">
                  {item.description.substring(0, 100)}...
                </td>
                <td className="p-3 text-left flex space-x-2">
                  <button
                    onClick={() => handleEdit(item.policyinfo_uid)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.policyinfo_uid)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
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

export default PolicyInfo
