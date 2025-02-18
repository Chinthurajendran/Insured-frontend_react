import React, { useEffect } from "react"
import { UserIcon, BellIcon, PhoneIcon } from "@heroicons/react/20/solid" // Try this alternative path
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"



const UserHeader = () => {
  const user_token = localStorage.getItem("user_access_token")

  
  return (
    <header
      className="absolute w-full z-10 px-6 py-4"
      style={{ backgroundColor: "#0D4A31" }}
    >
      <nav className="flex items-center justify-between">

        <a href="/" className="text-white text-2xl font-bold">
          Insured+
        </a>

        <div className="flex items-center space-x-8">

          <div className="hidden md:flex space-x-6">
            <a href="/" className="text-white hover:text-gray-300">
              Home
            </a>
            <a href="/service" className="text-white hover:text-gray-300">
              Service
            </a>
            <a href="/insurance" className="text-white hover:text-gray-300">
              Insurance Services
            </a>
          </div>

          <div className="flex items-center space-x-4">

            <button className="text-white hover:text-gray-300">
              <PhoneIcon className="w-6 h-6" />
            </button>

            {user_token ? (
              <>
                <button className="text-white hover:text-gray-300">
                  <BellIcon className="w-6 h-6" />
                </button>

                <Link to={"/Userpage"}>
                  <button className="text-white hover:text-gray-300">
                    <UserIcon className="w-6 h-6" />
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/Loginpage_with_google">
                <button className="bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors  px-6 py-1.5">
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default UserHeader
