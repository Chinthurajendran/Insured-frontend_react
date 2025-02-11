import React from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { Link } from "react-router-dom"

const Login_with_google = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 max-w-md px-5 ml-30">
        {/* Header Section */}
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#0B4B2C] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Log in</h2>
        </div>

        {/* Buttons Section */}
        <div className="space-y-4">
          {/* Google Login Button */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Email Login Button */}
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

        {/* Signup Link */}
        <div className="mt-8 w-full flex justify-center ">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/Sign_up_pag">
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

      {/* Image Section */}
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
