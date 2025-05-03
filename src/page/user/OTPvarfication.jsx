import React, { useState, useEffect, useRef } from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import "react-toastify/dist/ReactToastify.css"

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const OTPvarfication = () => {
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [Reloading, setReLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [resendEnabled, setResendEnabled] = useState(false)
  const [resetTimer, setResetTimer] = useState(false)
  const [email, setEmail] = useState("") // State for email
  const navigate = useNavigate()
  const location = useLocation()
  const inputRefs = useRef([])

  useEffect(() => {
    // Check if the email is already in localStorage
    let storedEmail = localStorage.getItem("email")
    if (!storedEmail) {
      // If not, get it from location state
      storedEmail = location.state?.email
      if (storedEmail) {
        localStorage.setItem("email", storedEmail) // Save email to localStorage
      }
    }
    setEmail(storedEmail) // Set the email state
  }, [location.state?.email]) // Only run once on initial render

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          setResendEnabled(true)
          setReLoading(false)
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(countdown)
  }, [resetTimer])

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }
  

  const handleOTPChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "")
    if (!value) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs.current[index - 1].focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    const fullOtp = otp.join("")
    if (fullOtp.length !== 6) {
      setFormError("Please enter a valid 6-digit OTP.")
      setLoading(false)
      return
    }

    try {
      const res = await axios.post(`${baseURL}/auth/OTPverification`, {
        email,
        OTP: fullOtp,
      })
      if (res.status === 200) {
        toast.success("Email verified successfully!")
        navigate("/Sign_up_page")
      }
    } catch (error) {
      setLoading(false)
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail)
      } else {
        setFormError("Something went wrong. Please try again.")
      }
    }
  }

  const handleResendOTP = async () => {
    setReLoading(true)
    try {
      const res = await axios.post(`${baseURL}/auth/ResendOTP`, {
        email,
      })
      if (res.status === 201) {
        setEmail(res.data.email)
        toast.success("A new OTP has been sent to your email.")
        setTimer(60)
        setOtp(Array(6).fill(""))
        setResendEnabled(false)
        setFormError("")
        setResetTimer((prev) => !prev)
        navigate("/OTPvarfication")
      }
    } catch (error) {
      setReLoading(false)
      toast.error("Failed to resend OTP. Please try again later.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5 ml-30">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#014751] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Verify OTP</h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Please enter the 6-digit OTP sent to <strong>{email}</strong>
          </p>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP input fields */}
          <div className="flex justify-between gap-2 mt-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={otp[i]}
                  onChange={(e) => handleOTPChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-12 border border-gray-300 rounded text-center text-xl text-gray-700 focus:outline-none focus:border-[#014751]"
                />
              ))}
          </div>

          {/* Timer */}
          <div className="text-center text-sm text-gray-500">
            Time remaining:{" "}
            <span className="font-medium">{formatTime(timer)}</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={resendEnabled}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-bold ${
              resendEnabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "text-white bg-[#014751] hover:bg-[#013a41]"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {/* Resend button */}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={!resendEnabled}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-bold ${
              resendEnabled
                ? "text-white bg-[#014751] hover:bg-[#013a41]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {Reloading ? "Resending..." : "Resend OTP"}
          </button>
        </form>

        <div className="mt-4 w-full flex justify-center">
          <p className="text-sm text-gray-600">
            Already verified?{" "}
            <Link
              to="/Loginpage_with_google"
              className="text-emerald-700 hover:text-emerald-600 font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center ml-2">
        <img
          src={loginpage}
          alt="Happy couple with insurance coverage"
          className="object-cover w-full max-w-[120%] h-auto"
        />
      </div>
    </div>
  )
}

export default OTPvarfication
