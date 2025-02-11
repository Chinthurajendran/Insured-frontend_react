import React from "react"
import { UserIcon, BellIcon, PhoneIcon } from "@heroicons/react/20/solid"
import { Link } from "react-router-dom"

const UserHeader = () => {
  const userId = localStorage.getItem("user_id")

  return (
    <header
      className="absolute w-full z-10 px-6 py-4 border-b-4"
      style={{ backgroundColor: "#ffffff", borderBottomColor: "#0e4a31" }}
    >
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold transition-all duration-300 hover:text-[#0A4528] hover:scale-105"
          style={{ color: "#0e4a31" }}
        >
          Insured+
        </a>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {/* Links */}
          <div className="hidden md:flex space-x-6">
            <a
              href="/"
              className="font-bold transition-all duration-300 hover:text-[#0A4528] hover:scale-105"
              style={{ color: "#0e4a31" }}
            >
              Home
            </a>
            <a
              href="/service"
              className="font-bold transition-all duration-300 hover:text-[#0A4528] hover:scale-105"
              style={{ color: "#0e4a31" }}
            >
              Service
            </a>
            <a
              href="/insurance"
              className="font-bold transition-all duration-300 hover:text-[#0A4528] hover:scale-105"
              style={{ color: "#0e4a31" }}
            >
              Insurance Services
            </a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Customer Care Icon */}
            <button
              className="transition-all duration-300 hover:text-[#0A4528] hover:scale-110"
              style={{ color: "#0e4a31" }}
            >
              <PhoneIcon className="w-6 h-6" />
            </button>

            {userId ? (
              <>
                {/* Notification Icon */}
                <button
                  className="transition-all duration-300 hover:text-[#0A4528] hover:scale-110"
                  style={{ color: "#0e4a31" }}
                >
                  <BellIcon className="w-6 h-6" />
                </button>

                {/* User Icon */}
                <Link to={"/Userprofile"}>
                  <button
                    className="transition-all duration-300 hover:text-[#0A4528] hover:scale-110"
                    style={{ color: "#0e4a31" }}
                  >
                    <UserIcon className="w-6 h-6" />
                  </button>
                </Link>
              </>
            ) : (
              // Sign In Button when userId is not found
              <Link to="/Loginpage_with_google">
                <button className="bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all px-6 py-1.5 hover:scale-105">
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
