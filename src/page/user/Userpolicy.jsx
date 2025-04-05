import React, { useEffect, useState } from "react"
import { PlusSquare, IndianRupee } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/user"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useSelector } from "react-redux"
import razorpay from "../../assets/razorpay.png"
import Apple_Wallet_Icon from "../../assets/Apple_Wallet_Icon.svg"

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
  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState("razorpay")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(1)

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

  const PaymentHandler = (amount, policy_id) => {
    navigate("/RazorpayPayment", { state: { amount, policy_id } })
  }

  const handleSubmit = (paymentMethod, amount, policy_id) => {
    if (paymentMethod === "razorpay") {
      navigate("/RazorpayPayment", { state: { amount, policy_id } })
    } else if (paymentMethod === "wallet_policy") {
      navigate("/RazorpayPaymentWallet", {
        state: { amount, transactionType: paymentMethod },
      })
    }
    setShowModal(false)
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = policy.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(policy.length / usersPerPage)

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 space-y-6 overflow-hidden">
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

      {currentUsers.map((user, index) => (
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

          {!user.payment_status && (
            <div className="absolute bottom-3 right-4 pr-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                onClick={() => setShowModal(true)}
              >
                Pay Now
              </button>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-lg w-full h-full">
              <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                  Choose Payment Method
                </h2>
                <div className="flex flex-col gap-4">
                  <button
                    className={`flex items-center justify-between border-2 ${
                      selectedPayment === "razorpay"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                    } hover:border-blue-500 hover:bg-blue-50 rounded-lg shadow-sm p-4 transition-all`}
                    onClick={() => setSelectedPayment("razorpay")}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={razorpay}
                        alt="Razorpay"
                        className="w-10 h-10"
                      />
                      <span className="font-medium text-lg text-gray-800">
                        Razorpay
                      </span>
                    </div>
                    {selectedPayment === "razorpay" && (
                      <span className="text-blue-600 font-semibold text-lg">
                        ✔
                      </span>
                    )}
                  </button>

                  <button
                    className={`flex items-center justify-between border-2 ${
                      selectedPayment === "wallet_policy"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 bg-white"
                    } hover:border-green-500 hover:bg-green-50 rounded-lg shadow-sm p-4 transition-all`}
                    onClick={() => setSelectedPayment("wallet_policy")}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={Apple_Wallet_Icon}
                        alt="Wallet"
                        className="w-10 h-10"
                      />
                      <span className="font-medium text-lg text-gray-800">
                        Wallet
                      </span>
                    </div>
                    {selectedPayment === "wallet_policy" && (
                      <span className="text-green-600 font-semibold text-lg">
                        ✔
                      </span>
                    )}
                  </button>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition-all"
                    onClick={() =>
                      handleSubmit(
                        selectedPayment,
                        user.monthly_amount,
                        user.policydetails_uid
                      )
                    }
                  >
                    Continue
                  </button>
                  <button
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg py-3 font-semibold transition-all"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
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

      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-semibold transition-all 
${
  currentPage === 1
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-blue-600 text-white hover:bg-blue-700"
}`}
        >
          ← Previous
        </button>

        <span className="px-5 py-2 text-lg font-bold text-gray-800 bg-gray-200 rounded-md shadow-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-semibold transition-all 
${
  currentPage === totalPages
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-blue-600 text-white hover:bg-blue-700"
}`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Userpolicy
