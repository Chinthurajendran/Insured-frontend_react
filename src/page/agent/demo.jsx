import { useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

function AgentDocumentUpload() {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  // State for Existing Customer form
  const [existingCustomerData, setExistingCustomerData] = useState({
    email: "",
    insurancePlan: "",
    insuranceType: "",
    nomineeName: "",
    nomineeRelation: "",
    documents: [], // Array to store uploaded documents
  });

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
    documents: [], // Array to store uploaded documents
  });

  // Handle change for Existing Customer form
  const handleExistingCustomerChange = (e) => {
    setExistingCustomerData({ ...existingCustomerData, [e.target.name]: e.target.value });
  };

  // Handle change for New Customer form
  const handleNewCustomerChange = (e) => {
    setNewCustomerData({ ...newCustomerData, [e.target.name]: e.target.value });
  };

  // Handle file upload for Existing Customer form
  const handleExistingCustomerFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      setExistingCustomerData((prevData) => ({
        ...prevData,
        documents: [...prevData.documents, { type: documentType, file }],
      }));
    }
  };

  // Handle file upload for New Customer form
  const handleNewCustomerFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      setNewCustomerData((prevData) => ({
        ...prevData,
        documents: [...prevData.documents, { type: documentType, file }],
      }));
    }
  };

  // Submit Existing Customer form
  const handleExistingCustomerSubmit = (e) => {
    e.preventDefault();
    if (!existingCustomerData.email.trim()) {
      alert("Please enter your email.");
      return;
    }
    console.log("Existing Customer Form submitted:", existingCustomerData);
  };

  // Submit New Customer form
  const handleNewCustomerSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "name",
      "phone",
      "email",
      "dob",
      "income",
      "city",
      "nomineeName",
      "nomineeRelation",
    ];
    const isFormValid = requiredFields.every((field) => newCustomerData[field].trim() !== "");

    if (!isFormValid) {
      alert("Please fill out all required fields.");
      return;
    }
    console.log("New Customer Form submitted:", newCustomerData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Agent Document Upload</h1>

      {/* Customer Type Selection */}
      <div className="flex justify-center space-x-4 mb-8">
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg ${
            isExistingCustomer ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          <input
            type="checkbox"
            checked={isExistingCustomer}
            onChange={() => setIsExistingCustomer(true)}
            className="hidden"
          />
          <span>Existing Customer</span>
        </motion.label>
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg ${
            !isExistingCustomer ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          <input
            type="checkbox"
            checked={!isExistingCustomer}
            onChange={() => setIsExistingCustomer(false)}
            className="hidden"
          />
          <span>New Customer</span>
        </motion.label>
      </div>

      {isExistingCustomer ? (
        // Existing Customer Form
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleExistingCustomerSubmit}
          className="space-y-8"
        >
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
                    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="insurancePlan"
                value={newCustomerData.insurancePlan}
                onChange={handleNewCustomerChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="FutureGuard Life Plan">FutureGuard Life Plan</option>
                <option value="SecurePlus Health Plan">SecurePlus Health Plan</option>
                <option value="Retirement Growth Plan">Retirement Growth Plan</option>
              </select>
              <select
                name="insuranceType"
                value={newCustomerData.insuranceType}
                onChange={handleNewCustomerChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Life Insurance">Life Insurance</option>
                <option value="Health Insurance">Health Insurance</option>
                <option value="Retirement Plan">Retirement Plan</option>
              </select>
            </div>
          </motion.div>

          {/* Uploaded Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {["ID Proof", "Passbook copy", "Photo", "Pan card", "Income Proof"].map((item) => (
                <div key={item} className="space-y-2">
                  <p className="text-sm text-gray-600">{item}</p>
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center p-3 rounded-lg cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleExistingCustomerFileUpload(e, item)}
                      required
                    />
                  </motion.label>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Nominee Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Nominee ID Proof</p>
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center p-3 rounded-lg cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleNewCustomerFileUpload(e, "Nominee ID Proof")}
                    required
                  />
                </motion.label>
              </div>
            </div>
          </motion.div>

          {/* Submit Button for Existing Customer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-red-600 text-white px-12 py-3 text-lg rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Submit
            </motion.button>
          </motion.div>
        </motion.form>
      ) : (
        // New Customer Form
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleNewCustomerSubmit}
          className="space-y-8"
        >
          <h2 className="text-2xl font-semibold">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select
              name="gender"
              value={newCustomerData.gender}
              onChange={handleNewCustomerChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
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
              <option value="Below 3L">Below 3L</option>
              <option value="3L - 6L">3L - 6L</option>
              <option value="6L - 10L">6L - 10L</option>
              <option value="10L - 20L">10L - 20L</option>
              <option value="Above 20L">Above 20L</option>
            </select>

            <select
              name="maritalStatus"
              value={newCustomerData.maritalStatus}
              onChange={handleNewCustomerChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                name="insurancePlan"
                value={newCustomerData.insurancePlan}
                onChange={handleNewCustomerChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="FutureGuard Life Plan">FutureGuard Life Plan</option>
                <option value="SecurePlus Health Plan">SecurePlus Health Plan</option>
                <option value="Retirement Growth Plan">Retirement Growth Plan</option>
              </select>
              <select
                name="insuranceType"
                value={newCustomerData.insuranceType}
                onChange={handleNewCustomerChange}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="Life Insurance">Life Insurance</option>
                <option value="Health Insurance">Health Insurance</option>
                <option value="Retirement Plan">Retirement Plan</option>
              </select>
            </div>
          </motion.div>

          {/* Uploaded Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Uploaded Documents</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {["ID Proof", "Passbook copy", "Photo", "Pan card", "Income Proof"].map((item) => (
                <div key={item} className="space-y-2">
                  <p className="text-sm text-gray-600">{item}</p>
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center p-3 rounded-lg cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleNewCustomerFileUpload(e, item)}
                      required
                    />
                  </motion.label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Nominee Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold">Nominee Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Nominee ID Proof</p>
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center p-3 rounded-lg cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleNewCustomerFileUpload(e, "Nominee ID Proof")}
                    required
                  />
                </motion.label>
              </div>
            </div>
          </motion.div>

          {/* Submit Button for New Customer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-red-600 text-white px-12 py-3 text-lg rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Submit
            </motion.button>
          </motion.div>
        </motion.form>
      )}
    </div>
  );
}

export default AgentDocumentUpload;