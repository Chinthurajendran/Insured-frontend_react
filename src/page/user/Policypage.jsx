import React, { useEffect, useState } from "react"
import life_insurance from "../../assets/lifeinsurance.png"
import { useSelector } from "react-redux"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/user"
import { useNavigate } from "react-router-dom"

function Policypage() {
  const userId = useSelector((state) => state.userAuth.userid)
  const [policyData, setPolicyData] = useState([])
  const [additionalPolicyData, setAdditionalPolicyData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const [res, res1] = await Promise.all([
          axiosInstance.get(`policydetails/${userId}`),
          axiosInstance.get(`UserPolicyStatus/${userId}`),
        ])
        console.log("res", res)
        console.log("res1", res1)
        if (res.status === 200 && res.data.matching_policies) {
          setPolicyData(res.data.matching_policies)
        }

        if (res1.status === 200 && res1.data.policies) {
          setAdditionalPolicyData(res1.data.policies)
        }
      } catch (error) {
        toast.error("Failed to fetch policy details. Please try again later.")
      }
    }

    fetchData()
  }, [userId])

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
                <button
                  className="text-white font-medium text-lg pl-55 hover:underline"
                  onClick={() =>
                    navigate("/Plandetails", {
                      state: { policyId: policy.policy_id },
                    })
                  }
                >
                  Plan Details
                </button>

                <button
                  className={`px-4 py-2 rounded-md font-bold text-sm transition duration-200 
    ${
      additionalPolicyData.some(
        (p) =>
          p.policy_id === policy.policy_id &&
          (p.policy_status === "approved" || p.policy_status === "processing")
      )
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-gray-200 text-red-600 hover:bg-gray-300 hover:text-red-700"
    }`}
                  onClick={() => {
                    if (
                      !additionalPolicyData.some(
                        (p) =>
                          p.policy_id === policy.policy_id &&
                          (p.policy_status === "approved" ||
                            p.policy_status === "processing")
                      )
                    ) {
                      navigate("/PolicyDocumentUpload", {
                        state: { userId, policyId: policy.policy_id },
                      })
                    }
                  }}
                  disabled={additionalPolicyData.some(
                    (p) =>
                      p.policy_id === policy.policy_id &&
                      (p.policy_status === "approved" ||
                        p.policy_status === "processing")
                  )}
                >
                  ₹{policy.monthly_payment}/month
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center mt-10">
          <p className="text-[#1F4D30] text-lg font-semibold mb-4">
            According to your profile details, there are no matching policies
            available at the moment.
          </p>
          <p className="text-sm text-gray-700 mb-6">
            This could be due to age and income range not matching the available
            policy criteria. Please update your profile to explore relevant
            policy options.
          </p>
          <button
            onClick={() => navigate("/Userpage/Userprofile")}
            className="bg-[#1F4D30] text-white px-6 py-2 rounded-md font-medium hover:bg-[#174027] transition duration-200"
          >
            Go to Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default Policypage
