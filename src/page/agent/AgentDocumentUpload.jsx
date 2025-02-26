import { useEffect, useState } from "react"
import { Upload } from "lucide-react"
import axiosInstance from "../../Interceptors/agent"
import { toast } from "react-toastify"

function AgentDocumentUpload() {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [policyName, setPolicyName] = useState([])
  const [FiledName, setFiledName] = useState([])
  const [SelectIndex, setSelectIdex] = useState()

  // State for Existing Customer form
  const [existingCustomerData, setExistingCustomerData] = useState({
    email: "",
    insurancePlan: "",
    insuranceType: "",
    nomineeName: "",
    nomineeRelation: "",
    documents: {}, // Object to store uploaded documents
  })

  // State for New Customer form
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
    documents: {}, // Object to store uploaded documents
  })

  // Handle change for Existing Customer form
  const handleExistingCustomerChange = (e) => {
    const { name, value } = e.target

    setExistingCustomerData({
      ...existingCustomerData,
      [e.target.name]: e.target.value,
    })
  }

  const handlepolicy = (e) => {
    const { name, value } = e.target
    const selectedIndex = policyName.findIndex((policy) => policy === value)
    setSelectIdex(selectedIndex)
    setExistingCustomerData({
      ...existingCustomerData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle change for New Customer form
  const handleNewCustomerChange = (e) => {
    setNewCustomerData({ ...newCustomerData, [e.target.name]: e.target.value })
  }

  // Handle file upload for Existing Customer form
  const handleExistingCustomerFileUpload = (e, documentType) => {
    const file = e.target.files[0]
    if (file) {
      setExistingCustomerData((prevData) => ({
        ...prevData,
        documents: { ...prevData.documents, [documentType]: file },
      }))
    }
  }

  // Handle file upload for New Customer form
  const handleNewCustomerFileUpload = (e, documentType) => {
    const file = e.target.files[0]
    if (file) {
      setNewCustomerData((prevData) => ({
        ...prevData,
        documents: { ...prevData.documents, [documentType]: file },
      }))
    }
  }

  // Check if a document has been uploaded
  const isDocumentUploaded = (customerData, documentType) => {
    return customerData.documents && customerData.documents[documentType]
  }

  // Submit Existing Customer form
  const handleExistingCustomerSubmit = (e) => {
    e.preventDefault()
    if (!existingCustomerData.email.trim()) {
      alert("Please enter your email.")
      return
    }

    // Check if all required documents are uploaded
    // const requiredDocuments = [
    //   "ID Proof",
    //   "Passbook copy",
    //   "Photo",
    //   "Pan card",
    //   "Income Proof",
    //   "Nominee ID Proof",
    // ]
    // const missingDocuments = requiredDocuments.filter(
    //   (doc) => !isDocumentUploaded(existingCustomerData, doc)
    // )

    // if (missingDocuments.length > 0) {
    //   alert(
    //     `Please upload the following documents: ${missingDocuments.join(", ")}`
    //   )
    //   return
    // }

    console.log("Existing Customer Form submitted:", existingCustomerData)
  }

  // Submit New Customer form
  const handleNewCustomerSubmit = (e) => {
    e.preventDefault()
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

    // Check if all required fields are filled
    const missingFields = requiredFields.filter(
      (field) => !newCustomerData[field]
    )
    if (missingFields.length > 0) {
      alert(
        `Please fill out the following required fields: ${missingFields.join(
          ", "
        )}`
      )
      return
    }

    // Check if all required documents are uploaded
    const requiredDocuments = [
      "ID Proof",
      "Passbook copy",
      "Photo",
      "Pan card",
      "Income Proof",
      "Nominee ID Proof",
    ]
    const missingDocuments = requiredDocuments.filter(
      (doc) => !isDocumentUploaded(newCustomerData, doc)
    )

    if (missingDocuments.length > 0) {
      alert(
        `Please upload the following documents: ${missingDocuments.join(", ")}`
      )
      return
    }

    console.log("New Customer Form submitted:", newCustomerData)
  }

  // Reusable upload field component
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
            // We remove the required attribute and handle validation in the submit function
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
          setPolicyName(response.data.policies)
          setFiledName(response.data.additional_fields)
        }
      } catch (error) {
        toast.error("Policy is not fetched")
      }
    }

    fetchPolicy()
  }, [])

  const ExistingCustomerHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('email', existingCustomerData.email);
      formData.append('insurancePlan', existingCustomerData.insurancePlan);
      formData.append('insuranceType', existingCustomerData.insuranceType);
      formData.append('nomineeName', existingCustomerData.nomineeName);
      formData.append('nomineeRelation', existingCustomerData.nomineeRelation);
      
      // Append documents to formData
      Object.keys(existingCustomerData.documents).forEach(key => {
        formData.append('documents', existingCustomerData.documents[key]);
      });
  
      const response = await axiosInstance.post('ExistingCustomer', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        console.log("Ok");
      }
    } catch (error) {
      toast.error("Error");
    }
  };
  
console.log(existingCustomerData)
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Fixed header with the title and customer type selection */}
      <div className="bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Agent Document Upload
        </h1>

        {/* Customer Type Selection */}
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

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 h-[calc(100vh-100px)] p-10">
        <div className="max-w-4xl mx-auto p-6">
          {isExistingCustomer ? (
            // Existing Customer Form
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

              {/* Policy Details */}
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
                    <option value="Term Insurance">Term Insurance</option>
                  </select>
                  <select
                    name="insuranceType"
                    value={existingCustomerData.insuranceType}
                    onChange={handlepolicy}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Insurance Plan</option>
                    {policyName.map((policy, index) => (
                      <option key={index} value={policy}>
                        {policy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SelectIndex !== -1 &&
                    Object.entries(FiledName[SelectIndex] || {}).map(
                      ([key, value]) =>
                        value ? ( // Only render if value is true
                          <UploadField
                            key={key}
                            label={key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())} // Convert to readable format
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UploadField
                    label="Nominee ID Proof"
                    onChange={handleExistingCustomerFileUpload}
                    customerData={existingCustomerData}
                    required={true}
                  />
                </div>
              </div>

              {/* Submit Button for Existing Customer */}
              <div className="flex justify-center py-6">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-12 py-3 text-lg rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={ExistingCustomerHandler}>
                  Submit
                </button>
              </div>
            </form>
          ) : (
            // New Customer Form
            <form onSubmit={handleNewCustomerSubmit} className="space-y-8">
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

              {/* Policy Details */}
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
                    <option value="Term Insurance">Term Insurance</option>
                  </select>
                  <select
                    name="insuranceType"
                    value={newCustomerData.insuranceType}
                    onChange={handleNewCustomerChange}
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Insurance Plan</option>
                    {policyName.map((policy, index) => (
                      <option key={index} value={policy}>
                        {policy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    "ID Proof",
                    "Passbook copy",
                    "Photo",
                    "Pan card",
                    "Income Proof",
                  ].map((item) => (
                    <UploadField
                      key={item}
                      label={item}
                      onChange={handleNewCustomerFileUpload}
                      customerData={newCustomerData}
                      required={true}
                    />
                  ))}
                </div>
              </div>

              {/* Nominee Details */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UploadField
                    label="Nominee ID Proof"
                    onChange={handleNewCustomerFileUpload}
                    customerData={newCustomerData}
                    required={true}
                  />
                </div>
              </div>

              {/* Submit Button for New Customer */}
              <div className="flex justify-center py-6">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-12 py-3 text-lg rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Submit
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
