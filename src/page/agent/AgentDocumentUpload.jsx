import { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import axiosInstance from "../../Interceptors/agent"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import "react-toastify/dist/ReactToastify.css"
import { FiAlertCircle } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

function AgentDocumentUpload() {

  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [policyNames, setPolicyNames] = useState([])
  const [fieldNames, setFieldNames] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const agentId = useSelector((state) => state.agentAuth.agent_uuid)
 

  const [existingCustomerData, setExistingCustomerData] = useState({
    email: "",
    insurancePlan: "",
    insuranceType: "",
    nomineeName: "",
    nomineeRelation: "",
    documents: {},
  })


  const [newCustomerData, setNewCustomerData] = useState({
    gender: "",
    name: "",
    phone: "",
    email: "",
    dob: "",
    income: "",
    maritalStatus: "",
    city: "",
    insurancePlan: "",
    insuranceType: "",
    nomineeName: "",
    nomineeRelation: "",
    documents: {},
  })

  const handleExistingCustomerChange = (e) => {
    const { name, value } = e.target
    setExistingCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleExistingCustomerFileUpload = (e, documentType) => {
    const file = e.target.files[0]
    if (file) {
      setExistingCustomerData((prevData) => ({
        ...prevData,
        documents: { ...prevData.documents, [documentType]: file },
      }))
    }
  }

  const handleNewCustomerFileUpload = (e, documentType) => {
    const file = e.target.files[0]
    if (file) {
      setNewCustomerData((prevData) => ({
        ...prevData,
        documents: { ...prevData.documents, [documentType]: file },
      }))
    }
  }

  const handlePolicySelectionExisting = (e) => {
    const { name, value } = e.target
    const index = policyNames.findIndex((policy) => policy === value)
    setSelectedIndex(index)
    setExistingCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handlePolicySelectionNew = (e) => {
    const { name, value } = e.target
    const index = policyNames.findIndex((policy) => policy === value)
    setSelectedIndex(index)
    setNewCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }


  const isDocumentUploaded = (customerData, documentType) =>
    customerData.documents && customerData.documents[documentType]


  const UploadField = ({ label, onChange, customerData, required = false }) => {
    const isUploaded = isDocumentUploaded(customerData, label)
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          {label}{" "}
          {required && !isUploaded && <span className="text-red-500">*</span>}
        </p>
        <div
          className={`w-full border rounded-lg flex overflow-hidden ${
            isUploaded ? "border-green-500" : "border-gray-300"
          }`}
        >
          <input
            type="file"
            className="flex-1 p-2 text-sm"
            onChange={(e) => onChange(e, label)}
          />
          <div
            className={`text-white px-3 py-2 flex items-center justify-center ${
              isUploaded ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <Upload className="w-4 h-4" />
          </div>
        </div>
        {isUploaded && (
          <p className="text-xs text-green-600">
            File uploaded: {customerData.documents[label].name}
          </p>
        )}
      </div>
    )
  }

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axiosInstance.get("PolicyName")
        if (response.status === 200) {
          setPolicyNames(response.data.policies)
          setFieldNames(response.data.additional_fields)
        }
      } catch (error) {
        toast.error("Policy is not fetched")
      }
    }
    fetchPolicy()
  }, [])

  const handleNewCustomerSubmit = async (e) => {
    e.preventDefault()

    if (newCustomerData.phone && newCustomerData.phone.length > 10) {
      setFormError("Phone number cannot exceed 10 digits")
      return
    }

    const dob = new Date(newCustomerData.dob)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    if (age < 18) {
      setFormError("Age must be greater than 18 years")
      return
    }
    if (newCustomerData.name === newCustomerData.nomineeName) {
      setFormError("Name and Nominee Name cannot be the same")
      return
    }
    const requiredFields = [
      "gender",
      "name",
      "phone",
      "email",
      "dob",
      "income",
      "maritalStatus",
      "city",
      "insurancePlan",
      "insuranceType",
      "nomineeName",
      "nomineeRelation",
    ]
    console.log(newCustomerData.income)
    for (let field of requiredFields) {
      if (!newCustomerData[field]) {
        setFormError("All fields are required")
        return
      }
    }
    setFormError("")

    try {
      setIsSubmitting(true)
      const formData = new FormData()

      Object.entries(newCustomerData).forEach(([key, value]) => {
        if (key !== "documents") {
          formData.append(key, value)
        }
      })
      formData.append("id_proof", newCustomerData.documents["Id Proof"])
      formData.append("passbook", newCustomerData.documents["Passbook"])
      formData.append("income_proof", newCustomerData.documents["Income Proof"])
      formData.append("photo", newCustomerData.documents["Photo"])
      formData.append("pan_card", newCustomerData.documents["Pan Card"])
      formData.append(
        "nominee_address_proof",
        newCustomerData.documents["Nominee Address Proof"]
      )

      const response = await axiosInstance.post(
        `NewCustomer/${agentId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      )
      if (response.status === 200) {
        toast.success("Policy Submitted for Approval")
        navigate("/Agent_home/PolicyStatus")
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          setFormError("Email already used")
        } else {
          setFormError(`Server responded with status: ${error.response.status}`)
        }
      } else {
        setFormError("No response received from server")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExistingCustomerSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append("email", existingCustomerData.email)
      formData.append("insurancePlan", existingCustomerData.insurancePlan)
      formData.append("insuranceType", existingCustomerData.insuranceType)
      formData.append("nomineeName", existingCustomerData.nomineeName)
      formData.append("nomineeRelation", existingCustomerData.nomineeRelation)

      formData.append("id_proof", existingCustomerData.documents["Id Proof"])
      formData.append("passbook", existingCustomerData.documents["Passbook"])
      formData.append(
        "income_proof",
        existingCustomerData.documents["Income Proof"]
      )
      formData.append("photo", existingCustomerData.documents["Photo"])
      formData.append("pan_card", existingCustomerData.documents["Pan Card"])
      formData.append(
        "nominee_address_proof",
        existingCustomerData.documents["Nominee Address Proof"]
      )

      const response = await axiosInstance.post(
        `ExistingCustomer/${agentId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      )

      if (response.status === 200) {
        toast.success(response.message)
        navigate("/Agent_home/PolicyStatus")
      } else {
        console.log(`Unexpected response status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error:", error)
      setFormError("An error occurred. Please try again.")
      toast.error(error.response?.data?.detail || "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Agent Document Upload
        </h1>
        <div className="flex justify-center space-x-4">
          <label
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg ${
              isExistingCustomer
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <input
              type="checkbox"
              checked={isExistingCustomer}
              onChange={() => setIsExistingCustomer(true)}
              className="hidden"
            />
            <span>Existing Customer</span>
          </label>
          <label
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg ${
              !isExistingCustomer
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <input
              type="checkbox"
              checked={!isExistingCustomer}
              onChange={() => setIsExistingCustomer(false)}
              className="hidden"
            />
            <span>New Customer</span>
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 h-[calc(100vh-100px)] p-10">
        <div className="max-w-4xl mx-auto p-6">
          {isExistingCustomer ? (
            <form onSubmit={handleExistingCustomerSubmit} className="space-y-8">
              <h2 className="text-xl font-semibold mb-4">Enter Your Email</h2>
              <input
                name="email"
                value={existingCustomerData.email}
                onChange={handleExistingCustomerChange}
                placeholder="Email ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Policy Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="insurancePlan"
                    value={existingCustomerData.insurancePlan}
                    onChange={handleExistingCustomerChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Insurance Type</option>
                    <option value="Term Insurance">Life Insurance</option>
                  </select>
                  <select
                    name="insuranceType"
                    value={existingCustomerData.insuranceType}
                    onChange={handlePolicySelectionExisting}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Insurance Plan</option>
                    {policyNames.map((policy, index) => (
                      <option key={index} value={policy}>
                        {policy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedIndex !== -1 &&
                    Object.entries(fieldNames[selectedIndex] || {}).map(
                      ([key, value]) =>
                        value ? (
                          <UploadField
                            key={key}
                            label={key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                            onChange={handleExistingCustomerFileUpload}
                            customerData={existingCustomerData}
                            required={true}
                          />
                        ) : null
                    )}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Nominee Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    name="nomineeName"
                    value={existingCustomerData.nomineeName}
                    onChange={handleExistingCustomerChange}
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <select
                    name="nomineeRelation"
                    value={existingCustomerData.nomineeRelation}
                    onChange={handleExistingCustomerChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center py-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-red-600 text-white px-12 py-3 text-lg rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleNewCustomerSubmit} className="space-y-8">
              {formError && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm flex items-center">
                  <FiAlertCircle className="mr-2" />
                  {formError}
                </div>
              )}
              <h2 className="text-2xl font-semibold">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <select
                  name="gender"
                  value={newCustomerData.gender}
                  onChange={handleNewCustomerChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  name="name"
                  value={newCustomerData.name}
                  onChange={handleNewCustomerChange}
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <input
                  name="phone"
                  value={newCustomerData.phone}
                  onChange={handleNewCustomerChange}
                  placeholder="Phone"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <input
                  name="email"
                  value={newCustomerData.email}
                  onChange={handleNewCustomerChange}
                  placeholder="Email ID"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent md:col-span-2"
                  required
                />

                <input
                  name="dob"
                  value={newCustomerData.dob}
                  onChange={handleNewCustomerChange}
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />

                <select
                  name="income"
                  value={newCustomerData.income}
                  onChange={handleNewCustomerChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Income Range</option>
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

                <select
                  name="maritalStatus"
                  value={newCustomerData.maritalStatus}
                  onChange={handleNewCustomerChange}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>

                <input
                  name="city"
                  value={newCustomerData.city}
                  onChange={handleNewCustomerChange}
                  placeholder="City"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Policy Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <select
                    name="insurancePlan"
                    value={newCustomerData.insurancePlan}
                    onChange={handleNewCustomerChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Insurance Type</option>
                    <option value="Term Insurance">Life Insurance</option>
                  </select>
                  <select
                    name="insuranceType"
                    value={newCustomerData.insuranceType}
                    onChange={handlePolicySelectionNew}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Insurance Plan</option>
                    {policyNames.map((policy, index) => (
                      <option key={index} value={policy}>
                        {policy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedIndex !== -1 &&
                    Object.entries(fieldNames[selectedIndex] || {}).map(
                      ([key, value]) =>
                        value ? (
                          <UploadField
                            key={key}
                            label={key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                            onChange={handleNewCustomerFileUpload}
                            customerData={newCustomerData}
                            required={true}
                          />
                        ) : null
                    )}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Nominee Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    name="nomineeName"
                    value={newCustomerData.nomineeName}
                    onChange={handleNewCustomerChange}
                    placeholder="Full Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <select
                    name="nomineeRelation"
                    value={newCustomerData.nomineeRelation}
                    onChange={handleNewCustomerChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center py-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-red-600 text-white px-12 py-3 text-lg rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgentDocumentUpload
