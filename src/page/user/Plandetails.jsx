import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axiosInstance from "../../Interceptors/user"
import {
  FaShieldAlt,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaChartLine,
  FaInfoCircle
} from "react-icons/fa"

function Plandetails() {
  const location = useLocation()
  const policyId = location.state?.policyId || null
  const [policyDetails, setPolicyDetails] = useState(null)
  const [uploadPermissions, setUploadPermissions] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!policyId) return

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`policydocument/${policyId}`)
        if (res.status === 200) {
          setPolicyDetails(res.data.policy)
          setUploadPermissions({
            idProof: res.data.policy.id_proof,
            incomeProof: res.data.policy.income_proof,
            nomineeAddressProof: res.data.policy.nominee_address_proof,
            panCard: res.data.policy.pan_card,
            passbook: res.data.policy.passbook,
            photo: res.data.policy.photo
          })
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch policy details.", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [policyId])

  return (
    <div className="min-h-screen bg-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-green-900 p-6 text-white text-center">
          <h1 className="text-3xl font-bold flex justify-center items-center">
            <FaShieldAlt className="mr-2" /> Insurance Plan Details
          </h1>
          <p className="text-sm opacity-80">Your personalized insurance plan information.</p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {loading ? (
            <div className="text-center text-gray-600">Loading plan details...</div>
          ) : policyDetails ? (
            <>
              {/* Plan Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-green-900 flex items-center">
                  <FaInfoCircle className="mr-2" /> Plan Overview
                </h2>
                <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-300">
                  <h3 className="text-xl font-medium text-gray-800">{policyDetails.policy_name}</h3>
                  <p className="text-gray-600 italic mt-2">{policyDetails.description}</p>
                  <div className="mt-4 inline-block bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                    {policyDetails.policy_type}
                  </div>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300 flex items-center">
                  <FaMoneyBillWave className="text-green-900 text-3xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Premium Amount</p>
                    <p className="font-semibold text-lg">₹{policyDetails.premium_amount}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300 flex items-center">
                  <FaCalendarAlt className="text-green-900 text-3xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Coverage</p>
                    <p className="font-semibold text-lg">{policyDetails.coverage} years</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300 flex items-center">
                  <FaChartLine className="text-green-900 text-3xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Settlement Ratio</p>
                    <p className="font-semibold text-lg">{policyDetails.settlement}%</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-300 flex items-center">
                  <FaMoneyBillWave className="text-green-900 text-3xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Income Range</p>
                    <p className="font-semibold text-lg">{policyDetails.income_range}</p>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                  <FaFileAlt className="mr-2" /> Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(uploadPermissions).map(
                    ([document, required]) =>
                      required && (
                        <span
                          key={document}
                          className="bg-green-200 text-green-900 px-4 py-2 rounded-full flex items-center text-sm font-medium shadow-sm"
                        >
                          <FaCheckCircle className="mr-2" />
                          {document
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      )
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">Plan details not found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Plandetails
