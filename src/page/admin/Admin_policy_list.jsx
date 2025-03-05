import React, { useEffect, useState } from "react"
import AdminTable from "../../components/admin_compnents/AdminTable"
import axiosInstance from "../../Interceptors/admin"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const policyColumns = [
  { key: "policy_id", label: "Policy ID" },
  { key: "policy_name", label: "Policy Name" },
  { key: "policy_type", label: "Policy Type" },
  { key: "premium_amount", label: "Policy Amount" },
  { key: "coverage", label: "Coverage" },
  { key: "settlement", label: "Settlement" },
  { key: "age_group", label: "Age Group" },
  { key: "income_range", label: "Income Range" },
  { key: "description", label: "Description" },
  { key: "id_proof", label: "ID Proof" },
  { key: "passbook", label: "Passbook Copy" },
  { key: "photo", label: "Photo" },
  { key: "pan_card", label: "PAN" },
  { key: "income_proof", label: "Income Proof" },
  { key: "nominee_address_proof", label: "Nominee Address Proof" },
  { key: "block_status", label: "Block Status" },
]

const Admin_policy_list = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("admin_access_token")
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchpolicy = async () => {
      try {
        const res = await axiosInstance.get(`policy_list`)

        if (res.status === 200) {
          setPolicies(res.data.policy || res.data)
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
        alert("Failed to fetch policies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchpolicy()
  }, [token])

console.log(policies)
  const handleDeletePolicy = async (policyId) => {
    try {
      const response = await axiosInstance.put(`policy_delete/${policyId}`)
      if (response.status === 200) {
        setPolicies((prevPolicies) =>
          prevPolicies.filter((policy) => policy.policy_uid !== policyId)
        )
        toast.success("User deleted successfully.")
      }
    } catch (error) {
      toast.error("Failed to delete the user.")
      console.error("Error:", error)
    }
  }

  const handleBlockToggle = async (userId) => {
    try {
      const response = await axiosInstance.put(`Policy_block/${userId}`)
      if (response.status === 200) {
        setPolicies((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.policy_uid === userId
              ? { ...user, block_status: !user.block_status }
              : user
          )
          return updatedUsers
        })
        toast.success("User block status updated successfully.")
      }
    } catch (error) {
      toast.error("Failed to update block status.")
    }
  }

  const handleEditPolicy = (policyId) => {
    const policyselect = policies.find(data => data.policy_uid == policyId)
    if(policyselect){
      navigate("/Admin_policy_edit", { state: { policy_Id: policyId } });
    }
  };

  return (
    <AdminTable
      users={policies}
      columns={policyColumns}
      title="Policy Management"
      onDelete={handleDeletePolicy}
      onBlockToggle={handleBlockToggle}
      onEdit={handleEditPolicy}
      buttonlink="/Policy_create_page"
    />
  )
}

export default Admin_policy_list
