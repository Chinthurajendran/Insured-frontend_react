import React from "react"
import { Trash2 } from "lucide-react"
import adminuser from "../../assets/adminuser.png"
import { Link } from "react-router-dom"

const AdminTable = ({
  users,
  columns,
  title,
  onBlockToggle,
  onDelete,
  onAdminToggle,
  buttonlink,
}) => {
  return (
    <div className="container mx-auto p-6 max-w-screen-2xl">
      <div className="relative flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-center flex-1">{title}</h1>
        {buttonlink && (
          <Link to={buttonlink} className="absolute right-0">
            <button
              className="bg-gray-600 hover:bg-green-800 text-white px-4 py-2 rounded transition duration-200"
              aria-label="Create User"
            >
              Create User
            </button>
          </Link>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full min-w-[1600px] bg-gray-200 rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-green-800 text-white">
              <th className="p-3 text-center whitespace-nowrap">ID</th>
              {columns.map((col) => (
                <th key={col.key} className="p-3 text-center whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {onDelete && (
                <th className="p-3 text-center whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
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
                    {col.key === "image" ? (
                      <img
                        src={user[col.key] || adminuser}
                        alt={`${user.name || "User"}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full mx-auto"
                      />
                    ) : col.key === "block_status" ? (
                      <button
                        onClick={() => onBlockToggle(user.id)}
                        className={`px-4 py-1 rounded text-white ${
                          user[col.key] ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {user[col.key] ? "Blocked" : "Unblocked"}
                      </button>
                    ) : col.key === "is_admin" ? (
                      <button
                        onClick={() => onAdminToggle(user.user_id)}
                        className={`px-4 py-1 rounded text-white ${
                          user[col.key] ? "bg-blue-500" : "bg-gray-500"
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
                      <span className=" text-xl">
                        {user[col.key] ? "✅" : "❌"}
                      </span>
                    ) : col.key === "date_of_birth" ? (
                      new Date(user[col.key]).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    ) : col.key === "status" ? (
                      <span
                        className={`px-3 py-1 rounded text-white ${
                          user[col.key] ? "bg-green-500" : "bg-red-500"
                        }`}
                        aria-label={
                          user[col.key] ? "Active status" : "Inactive status"
                        }
                      >
                        {user[col.key] ? "Active" : "Inactive"}
                      </span>
                    ) : (
                      user[col.key]
                    )}
                  </td>
                ))}
                {onDelete && (
                  <td className="p-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => onDelete(user.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
