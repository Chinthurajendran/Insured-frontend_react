import React, { useState } from "react"
import { PlusSquare } from "lucide-react"
import { Link } from "react-router-dom"
import axiosInstance from "../../Interceptors/user"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FiAlertCircle } from "react-icons/fi"
import { useSelector } from "react-redux"

function Userpolicy() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 flex items-center space-x-6 -mt-150">
        <div className="flex-shrink-0">
          <PlusSquare className="w-16 h-16 text-gray-400" />
        </div>

        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-gray-900">
            You don&apos;t have any policies yet!
          </h2>
          <p className="text-gray-600 max-w-lg mt-2">
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
    </div>
  )
}

export default Userpolicy
