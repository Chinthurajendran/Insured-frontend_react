import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Check } from "lucide-react"
import axiosInstance from "../../Interceptors/user"
import "react-toastify/dist/ReactToastify.css"
import { FiAlertCircle } from "react-icons/fi"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

function PolicyDocumentUpload() {
  const location = useLocation()
  const policyId = location.state?.policyId || null
  const userId = location.state?.userId || null
  const navigate = useNavigate()
  const [policyDetails, setPolicyDetails] = useState(null)
  const [uploadPermissions, setUploadPermissions] = useState({})
  const [documents, setDocuments] = useState({})
  const [formError, setFormError] = useState("")
  const [requiredFiles, setRequiredFiles] = useState({})
  const [nomineeDetails, setNomineeDetails] = useState({
    fullName: "",
    relationship: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!policyId) return
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`policydocument/${policyId}`)
        if (res.status === 200) {
          setPolicyDetails(res.data.policy)
          setRequiredFiles({
            idProof: res.data.policy.id_proof ? true : false,
            incomeProof: res.data.policy.income_proof ? true : false,
            nomineeAddressProof: res.data.policy.nominee_address_proof
              ? true
              : false,
            panCard: res.data.policy.pan_card ? true : false,
            passbook: res.data.policy.passbook ? true : false,
            photo: res.data.policy.photo ? true : false,
          })
          setUploadPermissions({
            idProof: res.data.policy.id_proof,
            incomeProof: res.data.policy.income_proof,
            nomineeAddressProof: res.data.policy.nominee_address_proof,
            panCard: res.data.policy.pan_card,
            passbook: res.data.policy.passbook,
            photo: res.data.policy.photo,
          })
        }
      } catch (error) {
        console.error("Failed to fetch policy details.", error)
      }
    }
    fetchData()
  }, [policyId])

  const handleFileUpload = (event, documentType) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds the 5MB limit.")
        return
      }
      if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
        alert("Invalid file type. Please upload a PDF, JPG, or PNG file.")
        return
      }
      setDocuments((prev) => ({
        ...prev,
        [documentType]: file,
      }))
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setNomineeDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!nomineeDetails.fullName || !nomineeDetails.relationship) {
        alert("Please fill in all nominee details.")
        return
      }

      for (const [fileType, isRequired] of Object.entries(requiredFiles)) {
        if (isRequired && !documents[fileType]) {
          alert(
            `Please upload a ${fileType
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}.`
          )
          return
        }
      }

      setIsSubmitting(true)

      const formData = new FormData()
      formData.append("nomineeName", nomineeDetails.fullName)
      formData.append("nomineeRelation", nomineeDetails.relationship)

      if (documents.idProof) formData.append("id_proof", documents.idProof)
      if (documents.passbook) formData.append("passbook", documents.passbook)
      if (documents.incomeProof)
        formData.append("income_proof", documents.incomeProof)
      if (documents.photo) formData.append("photo", documents.photo)
      if (documents.panCard) formData.append("pan_card", documents.panCard)
      if (documents.nomineeAddressProof)
        formData.append("nominee_address_proof", documents.nomineeAddressProof)
      const response = await axiosInstance.post(
        `policyregistration/${policyId}/${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      )

      if (response.status === 200) {
        toast.success("Policy Submitted for Approval")
        navigate("/Userpage/Userpolicy")
      } else {
        console.log(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      setFormError(error)

      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Document Upload
      </h1>
      {formError && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
          <FiAlertCircle className="mr-2" />
          {formError}
        </div>
      )}

      {policyDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Policy Name</h2>
            <p className="text-2xl font-bold text-red-600">
              {policyDetails.policy_name}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Policy Type</h2>
            <p className="text-2xl font-bold text-red-600">
              {policyDetails.policy_type}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Life Cover</h2>
            <p className="text-2xl font-bold text-red-600">
              ₹ {policyDetails.premium_amount}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">
              Income Range
            </h2>
            <p className="text-2xl font-bold text-red-600">
              ₹ {policyDetails.income_range}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Coverage</h2>
            <p className="text-2xl font-bold text-red-600">
              {policyDetails.coverage} years
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Settlement</h2>
            <p className="text-2xl font-bold text-red-600">
              {policyDetails.settlement}%
            </p>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Upload Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(uploadPermissions)
            .filter(([_, value]) => value)
            .map(([key]) => (
              <div key={key}>
                <label className="relative text-gray-700 font-medium capitalize block mb-1">
                  {key.replace(/([A-Z])/g, " $1")}
                  <span className="absolute top-0 right-0 text-xs text-gray-500">
                    (Max: 5MB)
                  </span>
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="block w-full p-2 border rounded-lg cursor-pointer"
                  onChange={(event) => handleFileUpload(event, key)}
                />
                {documents[key] && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    {documents[key].name}{" "}
                    <Check className="ml-2 h-5 w-5 text-green-500" />
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Nominee Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-700 font-medium block mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={nomineeDetails.fullName}
              onChange={handleInputChange}
              className="block w-full p-2 border rounded-lg"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium block mb-1">
              Relationship
            </label>
            <select
              name="relationship"
              value={nomineeDetails.relationship}
              onChange={handleInputChange}
              className="block w-full p-2 border rounded-lg"
            >
              <option value="">Select Relationship</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`bg-red-600 hover:bg-red-700 text-white px-10 py-4 text-lg font-semibold rounded-lg transition ${
            isSubmitting ? "opacity-50" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  )
}

export default PolicyDocumentUpload
