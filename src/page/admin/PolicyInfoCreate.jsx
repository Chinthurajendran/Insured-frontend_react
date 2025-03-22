import React, { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/admin"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import { useLocation } from "react-router-dom"

function PolicyInfoCreate() {
  const [photo, setPhoto] = useState(null)
  const [policyName, setPolicyName] = useState("")
  const [titleDescription, setTitleDescription] = useState("")
  const [description, setDescription] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [policyData, setPolicyData] = useState("")
  const [photoPreview, setPhotoPreview] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const editestats = location.state?.editestats || false
  const policyId = location.state?.policy_Id

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setPhoto(selectedFile)
      setPhotoPreview(URL.createObjectURL(selectedFile))
    }
  }

  const Policy_info_create = async (e) => {
    e.preventDefault() // Prevent form reload

    if (!policyName || !titleDescription || !photo || !description) {
      setFormError("All fields are required")
      return
    }
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("policyinfo_name", policyName)
      formData.append("titledescription", titleDescription)
      formData.append("description", description)
      formData.append("photo", photo)

      const response = await axiosInstance.post(`policyinfocreate`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.status === 200) {
        toast.success("Policy info created successfully")
        navigate("/Admin_home/PolicyInfo")
      }
    } catch (error) {
      console.error("Error creating policy info:", error)
      toast.error("Failed to create policy info")
    } finally {
      setIsSubmitting(false)
    }
  }

  const Policy_info_edite = async (e) => {
    e.preventDefault() // Prevent form reload

    if (!policyName || !titleDescription || !photo || !description) {
      setFormError("All fields are required")
      return
    }
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("policyinfo_name", policyName)
      formData.append("titledescription", titleDescription)
      formData.append("description", description)
      if (photoPreview) {
        formData.append("photo", photo);
      }
      
      console.log("Sending FormData:", Object.fromEntries(formData)); // Debugging output
      const response = await axiosInstance.put(`policy_info_update/${policyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.status === 200) {
        toast.success("Policy info Updated successfully")
        navigate("/Admin_home/PolicyInfo")
      }
    } catch (error) {
      console.error("Error creating policy info:", error)
      toast.error("Failed to Update policy info")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axiosInstance.get("Policyinfo_list")
        if (response.status === 200) {
          const policies = response.data.policies || response.data
          const Policiesinfo = policies.filter(
            (policy) => policy.policyinfo_uid === policyId
          )
          if (Policiesinfo) {
            const selectedPolicy = Policiesinfo[0]
            setPolicyName(selectedPolicy.policyinfo_name)
            setTitleDescription(selectedPolicy.titledescription)
            setDescription(selectedPolicy.description)
            setPhoto(selectedPolicy.photo)
          }
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
      }
    }
    fetchPolicies()
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          {editestats ? "Edit Policy" : "Create New Policy"}
        </h1>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}
        <form
          onSubmit={editestats ? Policy_info_edite : Policy_info_create}
          className="space-y-6"
        >
          <div className="flex flex-col items-center">
            {photoPreview ? (
              <div className="mt-4 flex flex-col items-center mb-4">
                <img
                  src={photoPreview}
                  alt="Uploaded Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            ) : (
              photo && (
                <div className="mt-4 flex flex-col items-center mb-4">
                  <img
                    src={photo}
                    alt="Uploaded"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )
            )}

            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Photo</span>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <input
            type="text"
            placeholder="Policy Name"
            value={policyName}
            onChange={(e) => setPolicyName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <textarea
            placeholder="Title Description"
            value={titleDescription}
            onChange={(e) => setTitleDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {editestats ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold text-lg transition ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              {isSubmitting ? "Editing Policy..." : "Edit Policy"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold text-lg transition ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              {isSubmitting ? "Creating Policy..." : "Create Policy"}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default PolicyInfoCreate
