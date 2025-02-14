import React, { useEffect, useState } from "react"
import AdminTable from "../../components/admin_compnents/AdminTable"
import axios from "axios"
import { baseURL } from "../../baseUrls/Urls"

const policyColumns = [
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
  { key: "nominee_address_proof", label: "Nominee Address Proof" }
]

const Admin_policy_list = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem("access_token")

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchpolicy = async () => {
      try {
        const res = await axios.get(`${baseURL}/admin_auth/policy_list`, {
          headers: { Authorization: `Bearer ${token}` },
        })

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

  const handleDeletePolicy = (policyId) => {
    setPolicies((prevPolicies) =>
      prevPolicies.filter((policy) => policy.id !== policyId)
    )
  }

  return (
    <AdminTable
      users={policies}
      columns={policyColumns}
      title="Policy Management"
      onDelete={handleDeletePolicy}
      buttonlink="/Policy_create_page"
    />
  )
}

export default Admin_policy_list


