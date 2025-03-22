import React, { useEffect, useState } from "react"
import { PlusSquare, IndianRupee } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/user"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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

function Userpolicy() {
  const [policy, setPolicy] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const userId = useSelector((state) => state.userAuth.userid)

  const policylist = async () => {
    try {
      const response = await axiosInstance.get(`listpolicy/${userId}`)
      if (response.status === 200) {
        navigate("/Policypage")
      }
    } catch (error) {
      toast.error("Update the profile")
    }
  }

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axiosInstance.get("PolicyDetails_list")
        if (response.status === 200) {
          const filteredPolicies = response.data.policies.filter(
            (policy) => policy.agent_id === "None" && policy.user_id == userId
          )
          setPolicy(filteredPolicies)
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
        alert("Failed to fetch policies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPolicies()
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 space-y-6 overflow-hidden">
      {/* First Card */}
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8 flex items-center space-x-6">
        <div className="flex-shrink-0">
          <PlusSquare className="w-16 h-16 text-gray-400" />
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-gray-900">
            You don&apos;t have any policies yet!
          </h2>
          <p className="text-gray-600 mt-2">
            Buy an insurance policy to protect your family & assets now.
          </p>
        </div>
        <div>
          <button
            className="bg-emerald-700 hover:bg-emerald-800 px-6 py-2 text-white rounded-md"
            onClick={policylist}
          >
            Explore
          </button>
        </div>
      </div>

      {policy.map((user, index) => (
        <div
          key={index}
          className="max-w-6xl h-50% w-full bg-white rounded-lg shadow-lg p-8 pb-17 flex flex-col relative"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-12 -mt-2">
            {user.policy_type}
          </h1>

          <div className="flex justify-between items-center -mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-700">Life Cover</p>
              <p className="text-xl font-bold text-gray-900 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                {user.premium_amount}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-700">Cover Till Age</p>
              <p className="text-xl font-bold text-gray-900">
                {user.coverage} Years
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-700">Claim Settled</p>
              <p className="text-xl font-bold text-gray-900">
                {user.settlement}%
              </p>
            </div>
          </div>

          <div
            className={`absolute bottom-5 left-4 ml-3 px-3 py-1 rounded-lg flex items-center justify-center ${getStatusStyles(
              user.policy_status
            )}`}
          >
            <span className="text-sm">{user.policy_status}</span>
          </div>

          {user.payment_status && (
            <div className="absolute bottom-3 right-4 pr-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
                Pay Now
              </button>
            </div>
          )}

          {user.feedback && (
            <div className="mt-6 flex justify-start items-center">
              <span className="text-sm text-gray-700 mr-2">Feedback:</span>
              <span className="text-sm font-bold  text-red-900">
                {user.feedback}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Userpolicy
