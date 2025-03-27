import React, { useEffect, useState } from "react"
import axiosInstance from "../../Interceptors/user"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

const RazorpayPaymentWallet = () => {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const amount = Math.round(location.state?.amount || 0)
  const type = location.state?.transactionType // "add" or "withdraw"
  const userId = useSelector((state) => state.userAuth.userid)
  const navigate = useNavigate()

  const handlePayment = async () => {
    if (!window.Razorpay) {
      console.error("Razorpay library is not loaded!")
      alert("Razorpay library failed to load.")
      return
    }
    setLoading(true)

    try {
      // Step 1: Create Order from Backend
      const { data } = await axiosInstance.post(`RazorpayPaymentCreation`, {
        amount: amount,
        currency: "INR",
        receipt: "order_rcptid_11",
      })

      const options = {
        key: "rzp_test_BhE5b4CmcXMLSs", // Replace with your Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "Insured+",
        description: type === "add" ? "Wallet Top-up" : "Wallet Withdrawal",
        order_id: data.order_id, // Razorpay Order ID
        handler: async function (response) {
          try {
            const endpoint =
              type === "add"
                ? `wallet-verify-payment_add/${userId}`
                : `wallet-verify-payment-withdraw/${userId}?type=${type}`

            const verificationResponse = await axiosInstance.post(endpoint, {
              order_id: data.order_id,
              amount: data.amount,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })
            if (type === "withdraw" || type === "add") {
              navigate("/Userpage/Walletpage", {
                state: { transaction_type: type },
              })
            } else {
              navigate("/Userpage/Userpolicy", {
                state: { transaction_type: type },
              })
            }
            toast.success(
              `${type === "add" ? "Deposit" : "Withdrawal"} successful!`
            )
          } catch (error) {
            if (error.response && error.response.status === 400) {
              if (type === "withdraw" || type === "add") {
                navigate("/Userpage/Walletpage", {
                  state: { transaction_type: type },
                })
              } else {
                navigate("/Userpage/Userpolicy", {
                  state: { transaction_type: type },
                })
              }
              toast.error("Insufficient balance. Please add funds.")
            } else {
              console.error("Payment verification failed:", error)
              toast.error("Payment verification failed. Please try again.")
            }
          }
        },

        modal: {
          escape: false,
          ondismiss: function () {
            console.warn("User exited the Razorpay modal")
            navigate("/Userpage/Walletpage")
          },
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "7034344547",
        },
        theme: {
          color: "#0e4a31",
        },
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.open()
    } catch (error) {
      if (error.response) {
        console.error("Error Details:", error.response.data)
        alert(`Error: ${error.response.data.detail}`)
      } else {
        console.error("Payment failed:", error)
        alert("Payment failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (amount) {
      handlePayment()
    } else {
      alert("Payment amount not provided!")
      navigate("/Userpage/Walletpage")
    }
  }, [amount])

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : ""}
      </button>
    </div>
  )
}

export default RazorpayPaymentWallet
