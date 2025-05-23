import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FiAlertCircle, FiX } from "react-icons/fi"
import axiosInstance from "../../Interceptors/admin"

function Agent_approval_rejection_page() {
  const [gender, setGender] = useState("male")
  const [rejectionReason, setRejectionReason] = useState("")
  const [formError, setFormError] = useState("")
  const location = useLocation()
  const agentId = location.state?.agentId
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [popupImage, setPopupImage] = useState(null)
  const navigate = useNavigate()

  const handleReject = async () => {
    try {
      const formData = new URLSearchParams()
      formData.append("reason", rejectionReason)
      const response = await axiosInstance.put(
        `agent_rejected/${agentId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      if (response.status === 200) {
        toast.success("Agent rejected successfully.")
        navigate("/Admin_home/agentmanagement")
      }
    } catch (error) {
      console.error("Error details:", error.response)
      const errorMessage =
        error.response?.data?.detail || "Failed to reject agent."
      if (typeof errorMessage === "object") {
        setFormError(JSON.stringify(errorMessage))
      } else {
        setFormError(errorMessage)
      }
    }
  }

  const handleApproved = async () => {
    try {
      const response = await axiosInstance.put(`agent_approved/${agentId}`)

      if (response.status === 200) {
        toast.success("Agent approved successfully.")
        navigate("/Admin_home/agentmanagement")
      }
    } catch (error) {
      toast.error("Failed to approve agent. Please try again later.")
    }
  }

  useEffect(() => {
    if (!agentId) return

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `agent_approval_and_rejection/${agentId}`
        )

        if (res.status === 200) {
          const agentData = res.data.agents || res.data
          setAgent(agentData)
          setGender(agentData.gender || "male")
        }
      } catch (error) {
        toast.error("Failed to fetch agent details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [agentId])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!agent)
    return (
      <div className="text-center py-10 text-red-500">Agent not found.</div>
    )
    
  const openImagePopup = (imageSrc) => {
    setPopupImage(imageSrc)
  }

  const closeImagePopup = () => {
    setPopupImage(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Personal Details</h1>

      {formError && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
          <FiAlertCircle className="mr-2" />
          {typeof formError === "string"
            ? formError
            : JSON.stringify(formError)}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 flex gap-4">
          <button
            className={`flex-1 px-4 py-2 rounded-md ${
              gender === "Male" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            disabled
          >
            Male
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md ${
              gender === "Female" ? "bg-pink-500 text-white" : "bg-gray-300"
            }`}
            disabled
          >
            Female
          </button>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Full Name</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.name || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Agent ID</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.agent_userid || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Phone</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.phone || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Email ID</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.email || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">City</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.city || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Date of Birth</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            type="date"
            value={agent.date_of_birth || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">ID Proof</label>
          {agent.idproof ? (
            <div
              onClick={() => openImagePopup(agent.idproof)}
              className="cursor-pointer"
            >
              <img
                src={agent.idproof}
                alt="Photo"
                className="w-30 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
              />
            </div>
          ) : (
            <span className="text-gray-500">No photo Uploaded</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Reason</label>
        <textarea
          className="w-full border rounded-md px-3 py-2 bg-gray-100"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={handleApproved}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
        >
          Approve
        </button>
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
        >
          Reject
        </button>
      </div>

      {popupImage && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-lg p-4 max-w-3xl max-h-3xl relative">
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500 rounded-full bg-white p-1"
            >
              <FiX size={24} />
            </button>
            <img
              src={popupImage}
              alt="Document"
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: "80vh" }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Agent_approval_rejection_page
