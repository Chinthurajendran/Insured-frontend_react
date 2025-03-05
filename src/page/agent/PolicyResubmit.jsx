import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FiAlertCircle, FiX } from "react-icons/fi"
import axiosInstance from "../../Interceptors/admin"

function PolicyResubmit() {
  const [gender, setGender] = useState("male")
  const [rejectionReason, setRejectionReason] = useState("")
  const [formError, setFormError] = useState("")
  const location = useLocation()
  const PolicyId = location.state?.policydetails_uid
  const [agent, setAgent] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [popupImage, setPopupImage] = useState(null)

  const handleReject = async () => {
    try {
      const formData = new URLSearchParams()
      formData.append("reason", rejectionReason)
      console.log("Rejection Reason:", rejectionReason)
      const response = await axiosInstance.put(
        `policy_rejected/${PolicyId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      if (response.status === 200) {
        toast.success("Agent rejected successfully.")
        navigate("/Admin_home/PolicyApprovel")
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

  const openImagePopup = (imageSrc) => {
    setPopupImage(imageSrc)
  }

  const closeImagePopup = () => {
    setPopupImage(null)
  }

  useEffect(() => {
    if (!PolicyId) return

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `PolicyApprovalAndRejection/${PolicyId}`
        )

        if (res.status === 200) {
          const agentData = res.data.policy || res.data
          setAgent(agentData)
          setGender(agentData.gender?.toLowerCase() || "male")
        }
      } catch (error) {
        toast.error("Failed to fetch agent details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [PolicyId])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!agent)
    return (
      <div className="text-center py-10 text-red-500">Agent not found.</div>
    )

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 relative">
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
              gender === "male" ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            
          >
            Male
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-md ${
              gender === "female" ? "bg-pink-500 text-white" : "bg-gray-300"
            }`}
          >
            Female
          </button>
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Policy holder</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.policy_holder || ""}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Policy type</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.policy_type || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Policy name</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.policy_name || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Age</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.age || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Income range</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.income_range || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Coverage</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.coverage || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Premium amount</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.premium_amount || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Settlement</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.settlement || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Nominee name</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.nominee_name || ""}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label className="block font-semibold">Nominee relationship</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-gray-100"
            value={agent.nominee_relationship || ""}
            readOnly
          />
        </div>

        <div className="space-y-2 col-span-2">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="block font-semibold">Photo</label>
              {agent.photo ? (
                <div
                  onClick={() => openImagePopup(agent.photo)}
                  className="cursor-pointer"
                >
                  <img
                    src={agent.photo}
                    alt="Photo"
                    className="w-20 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                </div>
              ) : (
                <span className="text-gray-500">No photo Uploaded</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">ID Proof</label>
              {agent.id_proof ? (
                <div
                  onClick={() => openImagePopup(agent.id_proof)}
                  className="cursor-pointer"
                >
                  <img
                    src={agent.id_proof}
                    alt="ID Proof"
                    className="w-30 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                </div>
              ) : (
                <span className="text-gray-500">No ID Proof Uploaded</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">Income Proof</label>
              {agent.income_proof ? (
                <div
                  onClick={() => openImagePopup(agent.income_proof)}
                  className="cursor-pointer"
                >
                  <img
                    src={agent.income_proof}
                    alt="Income Proof"
                    className="w-30 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                </div>
              ) : (
                <span className="text-gray-500">No Income Proof Uploaded</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">Pan Card</label>
              {agent.pan_card ? (
                <div
                  onClick={() => openImagePopup(agent.pan_card)}
                  className="cursor-pointer"
                >
                  <img
                    src={agent.pan_card}
                    alt="Pan Card"
                    className="w-30 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                </div>
              ) : (
                <span className="text-gray-500">No Pan Card Uploaded</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">Passbook</label>
              {agent.passbook ? (
                <div
                  onClick={() => openImagePopup(agent.passbook)}
                  className="cursor-pointer"
                >
                  <img
                    src={agent.passbook}
                    alt="Passbook"
                    className="w-30 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                </div>
              ) : (
                <span className="text-gray-500">No Passbook Uploaded</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">
                Nominee Address Proof
              </label>
              {agent.nominee_address_proof ? (
                <div
                  onClick={() => openImagePopup(agent.nominee_address_proof)}
                  className="cursor-pointer"
                >
                  <img
                    src={agent.nominee_address_proof}
                    alt="Nominee Address Proof"
                    className="w-30 h-20 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                  />
                </div>
              ) : (
                <span className="text-gray-500">
                  No Nominee Address Proof Uploaded
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-semibold">Reason</label>
        <textarea
          className="w-full border rounded-md px-3 py-2"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
        >
          Re-Submit
        </button>
      </div>

      {/* Image Popup */}
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

export default PolicyResubmit
