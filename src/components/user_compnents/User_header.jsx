import React, { useEffect } from "react"
import { UserIcon, BellIcon, PhoneIcon } from "@heroicons/react/20/solid" // Try this alternative path
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


const UserHeader = () => {
  // const isAuthenticated = useSelector((state)=>state.userAuth.isAuthenticated)
  // const [userId, setUserId] = useState(null);
  // useEffect(()=>{
  //   if(isAuthenticated){

  //     const value = localStorage.getItem("user_id")
  //     setUserId(value)
  //   }
  // },[isAuthenticated])
  const userId = localStorage.getItem("user_id")
  console.log("eee",userId)



  return (
    <header
      className="absolute w-full z-10 px-6 py-4"
      style={{ backgroundColor: "#0D4A31" }}
    >
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-white text-2xl font-bold">
          Insured+
        </a>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          {/* Links */}
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

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Customer Care Icon */}
            <button className="text-white hover:text-gray-300">
              <PhoneIcon className="w-6 h-6" /> {/* Customer care icon */}
            </button>

            {userId ? (
              <>
                {/* Notification Icon */}
                <button className="text-white hover:text-gray-300">
                  <BellIcon className="w-6 h-6" /> {/* Notification icon */}
                </button>

                {/* User Icon */}
                <Link to={"/Userprofile"}>
                  <button className="text-white hover:text-gray-300">
                    <UserIcon className="w-6 h-6" /> {/* User icon */}
                  </button>
                </Link>
              </>
            ) : (
              // Sign In Button when userId is not found
              <Link to="/Loginpage_with_google">
                <button className="bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors  px-6 py-1.5">
                  <span>Sign In</span> {/* Text for Sign In */}
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
