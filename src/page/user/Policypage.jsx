import React, { useEffect, useState } from "react"
import life_insurance from "../../assets/lifeinsurance.png"
import { useSelector } from "react-redux"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/user"


function Policypage() {
  const userId = useSelector((state) => state.userAuth.userid)
  const [policyData, setPolicyData] = useState([])

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`policydetails/${userId}`)
        if (res.status === 200 && res.data.matching_policies) {
          setPolicyData(res.data.matching_policies)
        }
      } catch (error) {
        toast.error("Failed to fetch policy details. Please try again later.")
      }
    }

    fetchData()
  }, [userId])

  console.log("tt",policyData)

  return (
    <div className="max-w-6xl mx-auto p-2">
      {policyData.length > 0 ? (
        policyData.map((policy, index) => (
          <div key={policy.policy_id} className="relative mb-8">
            <div className="w-52 h-52 flex-shrink-0 absolute mt-5">
              <img
                src={life_insurance}
                alt="Policy Protection Illustration"
                className="object-contain w-full h-full"
              />
            </div>

            <div className="bg-[#1F4D30] rounded-md border border-gray-500 overflow-hidden shadow-lg">
              <div className="flex items-center bg-[#3E6B4B] px-6 py-4 pl-30 pb-12">
                <div className="grid grid-cols-3 gap-4 flex-1 text-white text-center items-end">
                  <div className="flex flex-col items-center justify-end h-20">
                    <div className="text-gray-300 text-sm">Life Cover</div>
                    <div className="font-bold text-lg">
                      ₹ {policy.premium_amount}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-end h-20">
                    <div className="text-gray-300 text-sm">Cover till age</div>
                    <div className="font-bold text-lg">
                      {policy.coverage} Years
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-end h-20">
                    <div className="text-gray-300 text-sm">Claim Settled</div>
                    <div className="font-bold text-lg">
                      {policy.settlement}%
                    </div>
                  </div>
                </div>
              </div>


              <div className="bg-[#1F4D30] px-6 py-2 flex justify-between items-center pb-2.5">
                <div className="text-white font-medium text-lg pl-55">
                  Plan Details
                </div>

                <div className="bg-gray-200 text-red-600 px-4 py-2 rounded-md font-bold text-sm">
                  ₹{policy.monthly_payment}/month
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white text-center mt-5">No policy data available.</p>
      )}
    </div>
  )
}

export default Policypage
