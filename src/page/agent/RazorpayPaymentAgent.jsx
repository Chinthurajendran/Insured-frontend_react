import React, { useEffect, useState } from "react"
import axiosInstance from "../../Interceptors/agent"
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import.meta.env

const razorpayKey = import.meta.env.VITE_RAZERPAY_KEY;

const RazorpayPaymentAgent = () => {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const amount = Math.round(location.state?.amount || 0)
  const policyId = location.state?.policy_id ?? null;
  const navigate = useNavigate()

  const handlePayment = async () => {
    if (!window.Razorpay) {
      console.error("Razorpay library is not loaded!")
      alert("Razorpay library failed to load.")
      return
    }
    setLoading(true)

    try {
      const { data } = await axiosInstance.post(`RazorpayPaymentCreation`, {
        amount: amount,
        currency: "INR",
        receipt: "order_rcptid_11",
      })

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: "Insured+",
        description: "Test Transaction",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            const verificationResponse = await axiosInstance.post(
              `verify-payment/${policyId}`,
              {
                order_id: data.order_id,
                amount: data.amount,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }
            )
            navigate("/Agent_home/CustomerSearch",{ state: {policyId } })
            toast.success("Payment successful!");
          } catch (error) {
            navigate("/Agent_home/CustomerSearch",{ state: {policyId } })
            console.error("Payment verification failed:", error)
            toast.error("Payment verification failed. Please try again.");
          }
        },
        modal: {
          escape: false,
          ondismiss: function () {
            console.warn("User exited the Razorpay modal")
            navigate("/Agent_home/CustomerSearch",{ state: {policyId } }) 
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

export default RazorpayPaymentAgent

