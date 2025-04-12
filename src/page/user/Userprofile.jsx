import React, { useEffect, useState } from "react"
import { User, Edit3 } from "lucide-react"
import gallery from "../../assets/gallery.png"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../Interceptors/user"
import { toast } from "react-toastify"

function Userprofile() {
  const navigate = useNavigate()
  const [gender, setGender] = useState("male")
  const [user, setUser] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    gender: "",
    username: "",
    phone: "",
    email: "",
    date_of_birth: "",
    annual_income: "",
    marital_status: "",
    city: "",
    image: null,
  })

  const userId = useSelector((state) => state.userAuth.userid)
  const user_authenticcated = useSelector(
    (state) => state.userAuth.isAuthenticated
  )

  useEffect(() => {
    if (!user_authenticcated) {
      navigate("/Login_page")
    }
  }, [user_authenticcated, navigate])

  const fetchUserProfile = async () => {
    if (!userId) return

    try {
      const res = await axiosInstance.get(`user_profile/${userId}`)

      if (res.status === 200) {
        const userdata = res.data.user || res.data
        setUser(userdata)
        setGender(userdata.gender || "male")

        setFormData({
          gender: userdata.gender || "",
          username: userdata.username || "",
          phone: userdata.phone || "",
          email: userdata.email || "",
          date_of_birth: userdata.date_of_birth || "",
          annual_income: userdata.annual_income || "",
          marital_status: userdata.marital_status || "",
          city: userdata.city || "",
          image: null,
        })

        if (isVisible) {
          setImagePreview(null)
        }
      }
    } catch (error) {
      toast.error("Failed to fetch user details. Please try again later.")
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [userId])

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
    setLoading(true)
    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await axiosInstance.put(
        `profile_create/${userId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      if (response.status === 200) {
        toast.success("Updated successfully!")
        setIsVisible(true)

        await fetchUserProfile()
      }
    } catch (error) {
      toast.error("Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-96 bg-gray-100">
      <div className="flex flex-col md:flex-row min-h-screen -mt-28">
        <div className="flex-1 p-8 mt-16 relative">
          {isVisible ? (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 relative">
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
                          value={user?.username ?? "Not provided"}
                          readOnly
                        />
                      </label>

                      <label>
                        <input
                          type="tel"
                          placeholder="Phone"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.phone ?? "Not provided"}
                          readOnly
                        />
                      </label>

                      <label>
                        <input
                          type="email"
                          placeholder="Email ID"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.email ?? "Not provided"}
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

                      <label>
                        <input
                          type="text"
                          placeholder="Annual Income"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.annual_income ?? "Not provided"}
                          readOnly
                        />
                      </label>

                      <label>
                        <input
                          type="text"
                          placeholder="Marital Status"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.marital_status ?? "Not provided"}
                          readOnly
                        />
                      </label>

                      <label className="col-span-2">
                        <input
                          type="text"
                          placeholder="City"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          value={user?.city ?? "Not provided"}
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
                            checked={formData.gender.toLowerCase() === "female"}
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
                            value={formData.date_of_birth}
                            onChange={handleChange}
                          />
                        </label>

                        <label>
                          <select
                            name="annual_income"
                            className="w-full p-2 border rounded-md"
                            value={formData.annual_income}
                            onChange={handleChange}
                          >
                            <option value="">Select Annual Income</option>
                            <option value="0 - 2,50,000">₹0 - ₹2,50,000</option>
                            <option value="2,50,001 - 5,00,000">
                              ₹2,50,001 - ₹5,00,000
                            </option>
                            <option value="5,00,001 - 10,00,000">
                              ₹5,00,001 - ₹10,00,000
                            </option>
                            <option value="10,00,001 - 25,00,000">
                              ₹10,00,001 - ₹25,00,000
                            </option>
                            <option value="25,00,001 - 50,00,000">
                              ₹25,00,001 - ₹50,00,000
                            </option>
                            <option value="50,00,001 and above">
                              ₹50,00,001 and above
                            </option>
                          </select>
                        </label>

                        <label>
                          <select
                            name="marital_status"
                            className="w-full p-2 border rounded-md"
                            value={formData.marital_status}
                            onChange={handleChange}
                          >
                            <option value="">Select Marital Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                          </select>
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
                        {loading ? "Updating..." : "Update"}
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

export default Userprofile
