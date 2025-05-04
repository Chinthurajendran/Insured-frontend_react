import React, { useState, useEffect } from "react"
import AdminTable from "../../components/admin_compnents/AdminTable"
import { AwardIcon } from "lucide-react"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/admin"
import { useSelector } from "react-redux"

const userColumns = [
  { key: "image", label: "Image" },
  { key: "username", label: "Name" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender" },
  { key: "phone", label: "Phone" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "annual_income", label: "Annual Income" },
  { key: "marital_status", label: "Marital Status" },
  { key: "city", label: "City" },
  { key: "policy_status", label: "Policy Status" },
  { key: "block_status", label: "Block Status" },
]

const Admin_user_management = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.adminToken.admin_access_token)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(`user_date`)

        if (response.status === 200) {
          setUsers(response.data.users || response.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [token])

  const handleBlockToggle = async (userId) => {
    try {
      const response = await axiosInstance.put(`user_block/${userId}`)
      if (response.status == 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === userId
              ? { ...user, block_status: !user.block_status }
              : user
          )
        )
        toast.success("Policy block status updated successfully.")
      }
    } catch (error) {
      toast.error("Failed to update block status.")
      console.error("Error:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`user_delete/${userId}`)
      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId))
        toast.success("User deleted successfully.")
      }
    } catch (error) {
      toast.error("Failed to delete the user.")
      console.error("Error:", error)
    }
  }

  return loading ? (
    <p>Loading users...</p>
  ) : (
    <AdminTable
      users={users}
      columns={userColumns}
      title="User Management"
      onBlockToggle={handleBlockToggle}
      onDelete={handleDeleteUser}
    />
  )
}

export default Admin_user_management
