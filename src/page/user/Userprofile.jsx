import React, { useEffect } from "react"
import { User, Edit3 } from "lucide-react"
import User_header from "../../components/user_compnents/User_header"
import User_profile_sidebar from "../../components/user_compnents/User_profile_sidebar"
import User_profile_header from "../../components/user_compnents/User_profile_header"
import gallery from "../../assets/gallery.png"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


function Userprofile() {
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/Login_page");
    }
  }, [isAuthenticated, navigate]);

  const authState = useSelector((state)=> state.userAuth)
  console.log("user",authState)

  return (
    <div className="min-h-screen bg-gray-100">
      <User_header />
      <User_profile_header />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <User_profile_sidebar />

        {/* Main Content */}
        <div className="flex-1 p-8 mt-16 relative">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 relative">
            {/* Edit Icon */}
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <Edit3 size={20} />
            </button>

            <div className="flex items-center space-x-6 mb-6">
              {/* User Profile Photo */}
              <img
                src={gallery} // Fixed Image Source
                alt="User Profile"
                className="w-30 h-30 object-cover rounded-lg mb-50"
              />

              {/* Title and Form Section */}
              <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold">Personal Details</h2>

                <form className="space-y-6">
                  {/* Gender Selection */}
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        className="hidden"
                        disabled
                      />
                      <span className="px-4 py-2 rounded-md bg-gray-200">Male</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        className="hidden"
                        disabled
                      />
                      <span className="px-4 py-2 rounded-md bg-gray-200">Female</span>
                    </label>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        value={authState.username}
                        readOnly
                      />
                    </label>

                    <label>
                      <input
                        type="tel"
                        placeholder="Phone"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        readOnly
                      />
                    </label>

                    <label>
                      <input
                        type="email"
                        placeholder="Email ID"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        value={authState.useremail}
                        readOnly
                      />
                    </label>

                    <label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        readOnly
                      />
                    </label>

                    <label>
                      <input
                        type="text"
                        placeholder="Annual Income"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        readOnly
                      />
                    </label>

                    <label>
                      <input
                        type="text"
                        placeholder="Marital Status"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        readOnly
                      />
                    </label>

                    <label className="col-span-2">
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        readOnly
                      />
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Userprofile