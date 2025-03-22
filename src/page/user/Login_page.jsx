import React, { useEffect, useState } from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { Link } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FiAlertCircle } from "react-icons/fi"
import axios from "axios"
import { baseURL } from "../../baseUrls/Urls"
import { useSelector, useDispatch } from "react-redux"
import { login } from "../../store/slices/userAuthentication"
import { jwtDecode } from "jwt-decode"
import { setTokens } from "../../store/slices/UserToken"

const Login_page = () => {
  const location = useLocation()
  const message = location.state?.message

  const [formError, setFormError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.userAuth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${baseURL}/auth/login`, formData)
      if (res.status == 200) {
        const decodedToken = jwtDecode(res.data.user_access_token)
        dispatch(
          login({
            userid: decodedToken.user.user_id,
            username: res.data.user_name,
            user_role: res.data.user_role,
            useremail: formData.email,
            isAuthenticated: true,
          })
        )
        dispatch(
          setTokens({
            user_access_token:res.data.user_access_token,
            user_refresh_token:res.data.user_refresh_token,
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
          <h1 className="text-3xl font-bold text-[#014751] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Log in</h2>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
            <FiAlertCircle className="mr-2" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg">
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value.toLowerCase() })
                }
                className="w-full text-gray-700 focus:outline-none"
              />
            </div>

            <div className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg mb-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-white bg-[#014751] hover:bg-[#013a41] rounded-lg font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/Passwordrecovery"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot my password?
          </Link>
        </div>
        <div className="my-4 border-t border-gray-300"></div>

        <div className="w-full flex justify-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/Sign_up_pag">
              <span className="text-emerald-700 hover:text-emerald-600 font-semibold">
                Sign up
              </span>
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

export default Login_page
