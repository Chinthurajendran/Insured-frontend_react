import React, { useState } from "react"
import { Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/admin"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"

function PolicyInfoCreate() {
  const [photo, setPhoto] = useState(null)
  const [policyName, setPolicyName] = useState("")
  const [titleDescription, setTitleDescription] = useState("")
  const [description, setDescription] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0])
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create New Policy
        </h1>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={Policy_info_create} className="space-y-6">
          <div className="flex flex-col items-center">
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
            {photo && (
              <p className="mt-2 text-sm text-gray-600">{photo.name}</p>
            )}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold text-lg transition ${
              isSubmitting ? "opacity-50" : ""
            }`}
          >
            {isSubmitting ? "Creating Policy..." : "Create Policy"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PolicyInfoCreate
