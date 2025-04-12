import React, { useState } from "react"
import { Trash2, Edit2 } from "lucide-react"
import adminuser from "../../assets/adminuser.png"
import { Link } from "react-router-dom"
const AdminTable = ({
  users,
  columns,
  title,
  onBlockToggle,
  onDelete,
  onAdminToggle,
  onEdit,
  buttonlink,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(users.length / usersPerPage)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const blockButton = (user) => {
    sessionStorage.setItem("currentPage", currentPage)
    user.agentuid || user.user_id || user.policy_uid || null
  }

  const deleteButton = (user) => {
    sessionStorage.setItem("currentPage", currentPage)
    user.agentuid || user.user_id || user.policy_uid || null
  }

  const editButton = (user) => {
    sessionStorage.setItem("currentPage", currentPage)
    return user.agentuid || user.user_id || user.policy_uid || null
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white"
      case "processing":
        return "bg-yellow-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-screen-2xl">
      <div className="relative flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-center flex-1">{title}</h1>
        {buttonlink && (
          <Link to={buttonlink} className="absolute right-0">
            <button className="bg-gray-600 hover:bg-green-800 text-white px-4 py-2 rounded transition duration-200">
              Create User
            </button>
          </Link>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full min-w-[1600px] bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="p-3 text-center whitespace-nowrap">No</th>
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-center whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {(onDelete || onEdit) && (
                <th className="p-3 text-center whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
              >
                <td className="p-3 text-center whitespace-nowrap">
                  {index + 101}
                </td>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="p-3 text-center whitespace-nowrap"
                  >
                    {col.key === "image" || col.key === "profile" ? (
                      <img
                        src={user[col.key] || adminuser}
                        alt={`${user.name || "User"}'s avatar`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                      />
                    ) : col.key === "block_status" ? (
                      <button
                        onClick={() => onBlockToggle(blockButton(user))}
                        className={`px-4 py-1 rounded text-white transition duration-200 ${
                          user[col.key]
                            ? "bg-red-500 hover:bg-red-700"
                            : "bg-green-500 hover:bg-green-700"
                        }`}
                      >
                        {user[col.key] ? "Blocked" : "Unblocked"}
                      </button>
                    ) : col.key === "is_admin" ? (
                      <button
                        onClick={() => onAdminToggle(user.user_id)}
                        className={`px-4 py-1 rounded text-white transition duration-200 ${
                          user[col.key]
                            ? "bg-blue-500 hover:bg-blue-700"
                            : "bg-gray-500 hover:bg-gray-700"
                        }`}
                      >
                        {user[col.key] ? "Admin" : "User"}
                      </button>
                    ) : [
                        "id_proof",
                        "passbook",
                        "photo",
                        "pan_card",
                        "income_proof",
                        "nominee_address_proof",
                        "live_status",
                      ].includes(col.key) ? (
                      <span className="text-xl">
                        {user[col.key] ? "✅" : "❌"}
                      </span>
                    ) : col.key === "date_of_birth" ? (
                      new Date(user[col.key]).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    ) : col.key === "status" || col.key === "policy_status" ? (
                      <span
                        className={`px-3 py-1 rounded text-white ${
                          user[col.key] ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {user[col.key] ? "Active" : "Inactive"}
                      </span>
                    ) : col.key === "currentstatus" ? (
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${getStatusStyles(
                          user.policy_status
                        )}`}
                      >
                        {user.policy_status
                          ? user.policy_status.charAt(0).toUpperCase() +
                            user.policy_status.slice(1)
                          : "N/A"}
                      </span>
                    ) : (
                      user[col.key]
                    )}
                  </td>
                ))}
                {(onDelete || onEdit) && (
                  <td className="p-3 text-center whitespace-nowrap flex justify-center">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(editButton(user))}
                        className="text-blue-600 hover:text-blue-800 transition duration-200 mr-2"
                      >
                        <Edit2 className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(deleteButton(user))}
                        className="text-red-600 hover:text-red-800 transition duration-200"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    )}
                  </td>
                )}
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

export default AdminTable
