import React, { useEffect, useState } from "react"
import { User, Edit3 } from "lucide-react"
import gallery from "../../assets/gallery.png"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/agent"

function AgentProfle() {
  const agent_token = localStorage.getItem("agent_access_token")
  const navigate = useNavigate()
  const [gender, setGender] = useState("")
  const [user, setUser] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isVisible, setIsVisible] = useState(true)

  const [formData, setFormData] = useState({
    gender: "",
    username: "",
    phone: "",
    email: "",
    date_of_birth: "",
    city: "",
    image: null,
  })

  const agentId = useSelector((state) => state.agentAuth.agent_uuid)

  const fetchAgentProfile = async () => {
    if (!agentId) return
    
    try {
      const res = await axiosInstance.get(`agent_profile/${agentId}`)

      if (res.status === 200) {
        const agentdata = res.data.agent || res.data
        setUser(agentdata)
        setGender(agentdata.gender || "none")
        
        setFormData({
          gender: agentdata.gender || "",
          username: agentdata.username || "",
          phone: agentdata.phone || "",
          email: agentdata.email || "",
          date_of_birth: agentdata.date_of_birth || "",
          city: agentdata.city || "",
          image: null,
        })
        
        if (isVisible) {
          setImagePreview(null)
        }
      }
    } catch (error) {
      toast.error("Failed to fetch agent details. Please try again later.")
    }
  }

  useEffect(() => {
    if (!agent_token) {
      navigate("/Agent_login_page")
    }
  }, [agent_token, navigate])

  useEffect(() => {
    fetchAgentProfile()
  }, [agentId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const updateProfile = async () => {
    try {

      const formDataToSend = new FormData()
      

      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })
      
      const response = await axiosInstance.put(
        `AgentProfileUpdate/${agentId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      if (response.status === 200) {
        toast.success("Updated successfully!")
        setIsVisible(true)
        
        await fetchAgentProfile()
      }
    } catch (error) {
      toast.error("Failed to update profile.")
    }
  }

  return (
    <div className="h-screen w-full">
      <div className="flex flex-col md:flex-row min-h-screen -mt-4">
        <div className="flex-1 p-8 mt-16 relative">
          {isVisible ? (
            <div className="max-w-2xl mx-auto bg-gray-100 rounded-lg shadow p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setIsVisible(false)}
              >
                <Edit3 size={20} />
              </button>

              <div className="flex items-center space-x-6 mb-6">
                <img
                  src={user?.image || gallery}
                  alt="User Profile"
                  className="w-30 h-30 object-cover rounded-lg mb-50"
                />

                <div className="flex flex-col space-y-4">
                  <h2 className="text-xl font-semibold">Personal Details</h2>

                  <form className="space-y-6">

                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={gender.toLowerCase() === "male"}
                          className="hidden"
                          disabled
                        />
                        <span
                          className={`px-4 py-2 rounded-md ${
                            gender.toLowerCase() === "male"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300"
                          }`}
                        >
                          Male
                        </span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={gender.toLowerCase() === "female"}
                          className="hidden"
                          disabled
                        />
                        <span
                          className={`px-4 py-2 rounded-md ${
                            gender.toLowerCase() === "female"
                              ? "bg-pink-500 text-white"
                              : "bg-gray-300"
                          }`}
                        >
                          Female
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label>
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.username ?? "Username"}
                          readOnly
                        />
                      </label>

                      <label>
                        <input
                          type="tel"
                          placeholder="Phone"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.phone ?? "Phone"}
                          readOnly
                        />
                      </label>

                      <label>
                        <input
                          type="email"
                          placeholder="Email ID"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.email ?? "Email ID"}
                          readOnly
                        />
                      </label>

                      <label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.date_of_birth ?? ""}
                          readOnly
                        />
                      </label>

                      <label className="col-span-2">
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.city ?? "City"}
                          readOnly
                        />
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 relative">
              <div>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex flex-col items-center gap-4 mb-40">
                    {(imagePreview || user?.image) && (
                      <img
                        src={imagePreview || user?.image}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                      />
                    )}
                    <label className="cursor-pointer bg-gray-300 px-4 py-2 rounded-md text-sm text-center">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold">Personal Details</h2>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender.toLowerCase() === "male"}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <span
                            className={`px-4 py-2 rounded-md ${
                              formData.gender.toLowerCase() === "male"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300"
                            }`}
                          >
                            Male
                          </span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={
                              formData.gender.toLowerCase() === "female"
                            }
                            onChange={handleChange}
                            className="hidden"
                          />
                          <span
                            className={`px-4 py-2 rounded-md ${
                              formData.gender.toLowerCase() === "female"
                                ? "bg-pink-500 text-white"
                                : "bg-gray-300"
                            }`}
                          >
                            Female
                          </span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label>
                          <input
                            type="text"
                            name="username"
                            placeholder="Full Name"
                            className="w-full p-2 border rounded-md"
                            value={formData.username}
                            onChange={handleChange}
                          />
                        </label>

                        <label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone"
                            className="w-full p-2 border rounded-md"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </label>

                        <label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Email ID"
                            className="w-full p-2 border rounded-md"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </label>

                        <label>
                          <input
                            type="date"
                            name="date_of_birth"
                            className="w-full p-2 border rounded-md"
                            value={
                              formData.date_of_birth
                            }
                            onChange={handleChange}
                          />
                        </label>

                        <label className="col-span-2">
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className="w-full p-2 border rounded-md"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={updateProfile}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentProfle