import React, { useState } from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { Link } from "react-router-dom"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
// import { baseURL } from "../../baseUrls/Urls"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/userAuthentication"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import { setTokens } from "../../store/slices/UserToken"
import.meta.env

const GoogleID = import.meta.env.VITE_CLIENT_ID;
const baseURL = import.meta.env.VITE_API_LOCAL_URL;

const Login_with_google = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [formError, setFormError] = useState("")

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse
      const res = await axios.post(`${baseURL}/auth/google-login`, {
        token: credential,
      })

      if (res.status === 200) {
        const decodedToken = jwtDecode(res.data.user_access_token)
        dispatch(
          login({
            userid: decodedToken.user.user_id,
            username: res.data.user_name,
            user_role: res.data.user_role,
            isAuthenticated: true,
          })
        )
        dispatch(
          setTokens({
            user_access_token: res.data.user_access_token,
            user_refresh_token: res.data.user_refresh_token,
          })
        )

        navigate("/", { state: { message: "Login successful!" } })
        toast.success("Login successful!")
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setFormError(error.response.data.detail || "Login failed")
      } else {
        setFormError(
          "An unexpected error occurred. Please try again.",
          error.message
        )
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5 ml-30">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#0B4B2C] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Log in</h2>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <div className="space-y-4">
          <GoogleOAuthProvider clientId = {GoogleID}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                toast.error("Login failed. Please try again.")
              }}
            />
          </GoogleOAuthProvider>

          <Link to="/Login_page">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              Continue with Email
            </button>
          </Link>
        </div>

        <div className="mt-8 w-full flex justify-center ">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/Emailvarfication">
              <a
                href="/signup"
                className="text-emerald-700 hover:text-emerald-600 font-semibold"
              >
                Sign up
              </a>
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

export default Login_with_google
