import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axiosInstance from "../../Interceptors/agent"
import { toast } from "react-toastify"
import {
  CalendarDays,
  CreditCard,
  Home,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react"

function CustomerInfo() {
  const location = useLocation()
  const PolicyId = location.state?.policies

  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axiosInstance.get(`customerinfo/${PolicyId}`)
        if (response.status === 200 && response.data?.policies) {
          const policyData = {
            ...response.data.policies,
            monthly_amount: Math.round(response.data.policies.monthly_amount),
          }
          setPolicy(policyData)
        } else {
          toast.warn("Unexpected response structure. Please try again.")
        }
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Customer info not found. Please check again.")
        } else {
          toast.error("Failed to fetch policies. Please try again.")
        }
        console.error("Error fetching policies:", error)
      } finally {
        setLoading(false)
      }
    }

    if (PolicyId) fetchPolicies()
  }, [PolicyId])

  // Helper function to get the appropriate icon for each field
  const getFieldIcon = (key) => {
    const iconMap = {
      policy_holder: <User className="h-5 w-5 text-green-700" />,
      policy_number: <Shield className="h-5 w-5 text-green-700" />,
      email: <Mail className="h-5 w-5 text-green-700" />,
      phone: <Phone className="h-5 w-5 text-green-700" />,
      address: <Home className="h-5 w-5 text-green-700" />,
      monthly_amount: <CreditCard className="h-5 w-5 text-green-700" />,
      start_date: <CalendarDays className="h-5 w-5 text-green-700" />,
      end_date: <CalendarDays className="h-5 w-5 text-green-700" />,
    }
    return iconMap[key] || <Shield className="h-5 w-5 text-green-700" />
  }

  // Format field names for display
  const formatFieldName = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">
          Customer Policy Details
        </h1>

        {loading ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col items-center space-y-4 p-6 pb-2">
              <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ) : policy ? (
          <div className="grid gap-6">
            <div className="bg-white rounded-lg overflow-hidden border-none shadow-lg relative">
              <div className="absolute top-0 left-0 right-0 h-32 bg-green-100"></div>
              <div className="relative pt-10 px-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-700 to-green-900 opacity-20 blur-md"></div>
                    <img
                      src={policy.photo || "/placeholder.svg"}
                      alt="Policy Holder"
                      className="relative w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">
                    {policy.policy_holder}
                  </h2>
                  <span
                    className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      policy.payment_status
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {policy.payment_status ? "Payment Required" : "Paid"}
                  </span>
                </div>
              </div>
              <div className="pt-4 px-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(policy).map(([key, value]) => {
                    if (
                      key === "photo" ||
                      key === "payment_status" ||
                      key === "policydetails_uid" ||
                      key === "policy_holder" ||
                      key === "policy_number"
                    )
                      return null

                    return (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 transition-all hover:bg-gray-100">
                        {getFieldIcon(key)}
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {formatFieldName(key)}
                          </p>
                          <p className="font-medium">
                            {key.includes("amount")
                              ? `₹${value}`
                              : key.includes("coverage")
                              ? `${value} years`
                              : value.toString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {policy.payment_status && (
                <div className="px-6 py-4 mt-2">
                  <div className="h-px w-full bg-gray-200 my-4"></div>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Payment</p>
                      <p className="text-2xl font-bold">
                        ₹{policy.monthly_amount}
                      </p>
                    </div>
                    <button
                      className="px-8 py-3 bg-green-800 text-white rounded-lg font-medium transition-all hover:bg-green-700 hover:scale-105"
                      onClick={() => toast.success("Redirecting to payment...")}
                    >
                      Make Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg border-none">
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Shield className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                No Policy Details Found
              </h3>
              <p className="text-gray-500 text-center">
                We couldn't find any policy information for this customer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerInfo
