import React, { useEffect, useState } from "react"
import AdminTable from "../../components/admin_compnents/AdminTable"
import axiosInstance from "../../Interceptors/agent"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

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
  { key: "nominee_address_proof", label: "Nominee Address Proof" },
]

const AgentPolicyList = () => {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)

  const policyArray = Array.isArray(policies) ? policies : [policies];

  useEffect(() => {

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
  }, [])
  return (
    <AdminTable
      users={policyArray}
      columns={policyColumns}
      title="Policy List"
    />
  )
}

export default AgentPolicyList
