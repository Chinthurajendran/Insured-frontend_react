import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { baseURL } from "../../baseUrls/Urls"
// Removed UI library imports
import {
  Shield,
  Home,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Briefcase,
  Heart,
  Car,
  Plane,
  Stethoscope,
} from "lucide-react";



function PolicyInformation() {
  const location = useLocation()
  const PolicyId = location.state?.policyinfo_uid
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/auth/PolicyinfoDetails/${PolicyId}`
        )
        if (response.status === 200) {
          setPolicy(response.data?.policies || response.data)
        }
      } catch (error) {
        console.error("Error fetching policy details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicy()
  }, [PolicyId])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-slate-700 text-xl font-medium">
            Loading policy details...
          </p>
        </div>
      </div>
    )
  }

  if (!policy || policy.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-16 w-16 text-amber-500" />
            <h2 className="text-2xl font-bold text-slate-800">
              No Policy Found
            </h2>
            <p className="text-slate-600 text-center">
              We couldn't find any policy details for the requested information.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { photo, policyinfo_name, description } = policy[0] || {}
  const isHomeInsurance = policyinfo_name === "Home Insurance"
  const isBusinessInsurance = policyinfo_name === "Business Insurance"
  const isLifeInsurance = policyinfo_name === "Life Insurance"
  const isAutoInsurance = policyinfo_name === "Auto Insurance"
  const isTravelInsurance = policyinfo_name === "Travel Insurance"
  const isHealthInsurance = policyinfo_name === "Health Insurance"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10"></div>
        {photo ? (
          <img
            src={photo || "/placeholder.svg"}
            alt={policyinfo_name}
            className="w-full h-[500px] object-cover"
          />
        ) : (
          <div className="w-full h-[500px] bg-gradient-to-r from-primary to-primary/60"></div>
        )}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-white" />
            <div className="h-10 w-[2px] bg-white/30"></div>

            {isHomeInsurance && <Home className="h-10 w-10 text-white" />}
            {isBusinessInsurance && (
              <Briefcase className="h-10 w-10 text-white" />
            )}
            {isLifeInsurance && <Heart className="h-10 w-10 text-white" />}
            {isAutoInsurance && <Car className="h-10 w-10 text-white" />}
            {isTravelInsurance && <Plane className="h-10 w-10 text-white" />}
            {isHealthInsurance && (
              <Stethoscope className="h-10 w-10 text-white" />
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center tracking-tight mb-4 max-w-4xl">
            {policyinfo_name}
          </h1>
          <div className="w-24 h-1 bg-white/70 rounded-full mb-6"></div>
          <p className="text-white/90 text-xl max-w-2xl text-center font-light">
            Comprehensive coverage designed to protect what matters most to you
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-30 pb-20">
        <div className="shadow-xl border-0 overflow-hidden bg-white rounded-lg">
          <div className="p-0">
            <div>
              <div className="bg-white border-b">
                <div className="max-w-5xl mx-auto">
                  <div className="flex h-16 w-full border-b">
                    <button
                      onClick={() => handleTabChange("overview")}
                      className={`px-4 h-16 text-base ${
                        activeTab === "overview"
                          ? "border-b-2 border-primary font-medium"
                          : ""
                      }`}
                    >
                      Overview
                    </button>
                    {(isHomeInsurance ||
                      isBusinessInsurance ||
                      isLifeInsurance ||
                      isAutoInsurance ||
                      isTravelInsurance ||
                      isHealthInsurance) && (
                      <>
                        <button
                          onClick={() => handleTabChange("benefits")}
                          className={`px-4 h-16 text-base ${
                            activeTab === "benefits"
                              ? "border-b-2 border-primary font-medium"
                              : ""
                          }`}
                        >
                          Benefits
                        </button>
                        <button
                          onClick={() => handleTabChange("types")}
                          className={`px-4 h-16 text-base ${
                            activeTab === "types"
                              ? "border-b-2 border-primary font-medium"
                              : ""
                          }`}
                        >
                          Types
                        </button>
                        <button
                          onClick={() => handleTabChange("documents")}
                          className={`px-4 h-16 text-base ${
                            activeTab === "documents"
                              ? "border-b-2 border-primary font-medium"
                              : ""
                          }`}
                        >
                          Required Documents
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12">
                <div className="max-w-5xl mx-auto">
                  {activeTab === "overview" && (
                    <div className="mt-0">
                      <div className="prose prose-slate max-w-none">
                        <div
                          className="text-slate-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: description }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {isHomeInsurance && activeTab === "benefits" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Key Benefits
                          </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            {
                              title: "Property Protection",
                              description:
                                "Covers damages due to fire, theft, and natural disasters.",
                            },
                            {
                              title: "Personal Belongings Coverage",
                              description:
                                "Compensation for loss or damage to household items.",
                            },
                            {
                              title: "Liability Coverage",
                              description:
                                "Protects against financial liabilities for accidents on your property.",
                            },
                            {
                              title: "Alternative Living Expenses",
                              description:
                                "Covers costs for temporary accommodation.",
                            },
                            {
                              title: "Theft & Burglary Protection",
                              description:
                                "Financial security against break-ins.",
                            },
                            {
                              title: "Disaster Coverage",
                              description:
                                "Protection against floods, earthquakes, and fires.",
                            },
                          ].map((benefit, index) => (
                            <div
                              key={index}
                              className="border border-slate-200 hover:border-primary/50 transition-colors bg-white rounded-lg"
                            >
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                  {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isBusinessInsurance && activeTab === "benefits" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Key Benefits
                          </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            {
                              title: "Property Coverage",
                              description:
                                "Protects business premises and assets from damage or theft.",
                            },
                            {
                              title: "Liability Protection",
                              description:
                                "Covers legal costs in case of third-party claims.",
                            },
                            {
                              title: "Employee Coverage",
                              description:
                                "Provides medical and accident coverage for employees.",
                            },
                            {
                              title: "Business Interruption Insurance",
                              description:
                                "Covers loss of income due to operational halts.",
                            },
                            {
                              title: "Cyber Risk Coverage",
                              description:
                                "Protection against data breaches and cyberattacks.",
                            },
                          ].map((benefit, index) => (
                            <div
                              key={index}
                              className="border border-slate-200 hover:border-primary/50 transition-colors bg-white rounded-lg"
                            >
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                  {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {isAutoInsurance && activeTab === "benefits" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Key Benefits
                          </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            {
                              title: "Financial Protection",
                              description:
                                "Covers damages to your vehicle and liabilities in case of accidents.",
                            },
                            {
                              title: "Third-Party Liability",
                              description:
                                "Protects against legal and financial liabilities arising from injury or damage to others.",
                            },
                            {
                              title: "Vehicle Damage Coverage",
                              description:
                                "Provides compensation for repairs or replacement due to accidents, theft, fire, or natural disasters.",
                            },
                            {
                              title: "Medical Expense Coverage",
                              description:
                                "Covers medical bills for injuries sustained in an accident.",
                            },
                            {
                              title: "Peace of Mind",
                              description:
                                "Ensures you are financially secure in unexpected situations.",
                            },
                          ].map((benefit, index) => (
                            <div
                              key={index}
                              className="border border-slate-200 hover:border-primary/50 transition-colors bg-white rounded-lg"
                            >
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                  {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isTravelInsurance && activeTab === "benefits" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Key Benefits
                          </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            {
                              title: "Medical Emergency Coverage",
                              description:
                                "Covers hospitalization and medical treatment abroad.",
                            },
                            {
                              title: "Trip Cancellation/Interruption",
                              description:
                                "Reimburses non-refundable expenses if a trip is canceled due to emergencies.",
                            },
                            {
                              title: "Lost or Delayed Baggage",
                              description:
                                "Compensation for lost, stolen, or delayed luggage.",
                            },
                            {
                              title: "Flight Delays & Missed Connections",
                              description:
                                "Covers extra expenses due to travel delays.",
                            },
                            {
                              title: "Personal Liability Coverage",
                              description:
                                "Protection against legal expenses due to accidental damage or injury to others.",
                            },
                          ].map((benefit, index) => (
                            <div
                              key={index}
                              className="border border-slate-200 hover:border-primary/50 transition-colors bg-white rounded-lg"
                            >
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                  {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isHealthInsurance && activeTab === "benefits" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Key Benefits
                          </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            {
                              title: "Cashless Hospitalization",
                              description:
                                "Many insurers provide cashless treatment at network hospitals.",
                            },
                            {
                              title: "Medical Expense Coverage",
                              description:
                                "Covers hospital bills, doctor consultations, and surgeries.",
                            },
                            {
                              title: "Pre & Post-Hospitalization Expenses",
                              description:
                                "Covers costs incurred before and after hospitalization.",
                            },
                            {
                              title: "Critical Illness Coverage",
                              description:
                                "Provides a lump sum payout for serious diseases like cancer, heart attack, and stroke.",
                            },
                            {
                              title: "Tax Benefits",
                              description:
                                "Premiums paid are eligible for tax deductions under applicable laws.",
                            },
                          ].map((benefit, index) => (
                            <div
                              key={index}
                              className="border border-slate-200 hover:border-primary/50 transition-colors bg-white rounded-lg"
                            >
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                  {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isLifeInsurance && activeTab === "benefits" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Key Benefits
                          </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                          {[
                            {
                              title: "Financial Protection",
                              description:
                                "Ensures the policyholder’s family or dependents remain financially secure.",
                            },
                            {
                              title: "Income Replacement",
                              description:
                                "Helps replace lost income, ensuring loved ones can maintain their lifestyle.",
                            },
                            {
                              title: "Debt Coverage",
                              description:
                                "Can be used to pay off outstanding loans, such as mortgages or personal debts.",
                            },
                            {
                              title: "Tax Benefits",
                              description:
                                "Many life insurance policies offer tax advantages under government regulations.",
                            },
                            {
                              title: "Savings & Investment",
                              description:
                                "Some policies, like whole or universal life insurance, include a cash value component that grows over time.",
                            },
                          ].map((benefit, index) => (
                            <div
                              key={index}
                              className="border border-slate-200 hover:border-primary/50 transition-colors bg-white rounded-lg"
                            >
                              <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                  {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                  {benefit.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isHomeInsurance && activeTab === "types" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Types of Home Insurance
                          </h2>
                        </div>

                        <div className="space-y-6 mt-8">
                          {[
                            {
                              title: "Standard Fire & Special Perils Policy",
                              description:
                                "Covers damages from fire and riots.",
                            },
                            {
                              title: "Home Structure Insurance",
                              description:
                                "Protects building structures like walls and fixtures.",
                            },
                            {
                              title: "Content Insurance",
                              description:
                                "Covers belongings like furniture and valuables.",
                            },
                            {
                              title: "Landlord Insurance",
                              description:
                                "Coverage for rental properties and loss of rent.",
                            },
                            {
                              title: "Tenant Insurance",
                              description:
                                "Covers tenants' belongings in rented homes.",
                            },
                          ].map((type, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border-l-4 border-primary/70 bg-slate-50 rounded-r-lg"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {type.title}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isHealthInsurance && activeTab === "types" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Types of Health Insurance
                          </h2>
                        </div>

                        <div className="space-y-6 mt-8">
                          {[
                            {
                              title: "Individual Health Insurance",
                              description:
                                "Covers one person’s medical expenses.",
                            },
                            {
                              title: "Family Floater Health Insurance",
                              description:
                                "Covers the entire family under a single policy.",
                            },
                            {
                              title: "Critical Illness Insurance",
                              description:
                                "Provides a lump sum payout for life-threatening diseases.",
                            },
                            {
                              title: "Senior Citizen Health Insurance",
                              description:
                                "Designed for individuals aged 60 and above.",
                            },
                            {
                              title: "Group Health Insurance",
                              description:
                                "Offered by employers for employees’ medical coverage.",
                            },
                          ].map((type, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border-l-4 border-primary/70 bg-slate-50 rounded-r-lg"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {type.title}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isAutoInsurance && activeTab === "types" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Types of Auto Insurance
                          </h2>
                        </div>

                        <div className="space-y-6 mt-8">
                          {[
                            {
                              title: "Third-Party Insurance",
                              description:
                                "Covers damages to another person’s property, vehicle, or injuries but does not cover your own vehicle.",
                            },
                            {
                              title: "Comprehensive Insurance",
                              description:
                                "Offers extensive protection, covering damages to both your vehicle and third-party liabilities.",
                            },
                            {
                              title: "Collision Coverage",
                              description:
                                "Pays for repairs or replacement of your vehicle in case of a crash, regardless of fault.",
                            },
                            {
                              title: "Personal Injury Protection (PIP)",
                              description:
                                "Covers medical expenses and lost wages for you and your passengers.",
                            },
                            {
                              title: "Uninsured/Underinsured Motorist Coverage",
                              description:
                                "Protects you in case of an accident with a driver who lacks sufficient insurance.",
                            },
                          ].map((type, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border-l-4 border-primary/70 bg-slate-50 rounded-r-lg"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {type.title}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isLifeInsurance && activeTab === "types" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Types of Life Insurance
                          </h2>
                        </div>

                        <div className="space-y-6 mt-8">
                          {[
                            {
                              title: "Term Life Insurance",
                              description:
                                "Covers a specific period (e.g., 10, 20, or 30 years) and pays out only if the policyholder dies within that time.",
                            },
                            {
                              title: "Whole Life Insurance",
                              description:
                                "Provides lifelong coverage with a savings component that accumulates cash value.",
                            },
                            {
                              title: "Universal Life Insurance",
                              description:
                                "Offers flexible premiums and death benefits with a cash value investment component.",
                            },
                            {
                              title: "Endowment Plans",
                              description:
                                "A combination of insurance and savings, providing a payout at the end of the policy term or upon death.",
                            },
                          ].map((type, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border-l-4 border-primary/70 bg-slate-50 rounded-r-lg"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {type.title}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isTravelInsurance && activeTab === "types" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Types of Travel Insurance
                          </h2>
                        </div>

                        <div className="space-y-6 mt-8">
                          {[
                            {
                              title: "Single-Trip Insurance",
                              description:
                                "Covers one trip for a fixed period.",
                            },
                            {
                              title: "Multi-Trip Insurance",
                              description:
                                "Covers multiple trips within a year.",
                            },
                            {
                              title: "Student Travel Insurance",
                              description:
                                "Designed for students studying abroad.",
                            },
                            {
                              title: "Senior Citizen Travel Insurance",
                              description:
                                "Specialized coverage for elderly travelers.",
                            },
                          ].map((type, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border-l-4 border-primary/70 bg-slate-50 rounded-r-lg"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {type.title}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isBusinessInsurance && activeTab === "types" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <FileText className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Types of Business Insurance
                          </h2>
                        </div>

                        <div className="space-y-6 mt-8">
                          {[
                            {
                              title: "General Liability Insurance",
                              description:
                                "Covers lawsuits from third parties.",
                            },
                            {
                              title: "Commercial Property Insurance",
                              description:
                                "Protects buildings, equipment, and inventory.",
                            },
                            {
                              title: "Workers’ Compensation Insurance",
                              description:
                                "Covers employees for work-related injuries.",
                            },
                            {
                              title: "Cyber Insurance",
                              description:
                                "Protects against cyber threats and data breaches.",
                            },
                          ].map((type, index) => (
                            <div
                              key={index}
                              className="flex gap-4 p-4 border-l-4 border-primary/70 bg-slate-50 rounded-r-lg"
                            >
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {type.title}
                                </h3>
                                <p className="text-slate-600 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {isHomeInsurance && activeTab === "documents" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Required Documents
                          </h2>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                          <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Identity Proof:
                                </span>{" "}
                                Aadhaar Card, PAN Card, Passport, or Voter ID.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Address Proof:
                                </span>{" "}
                                Utility Bills, Aadhaar Card, or Rental
                                Agreement.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Property Documents:
                                </span>{" "}
                                Sale Deed or Property Tax Receipts.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                Property Valuation Report (if required).
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                Photographs of the Property for verification.
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isHealthInsurance && activeTab === "documents" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Required Documents
                          </h2>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                          <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Identity Proof:
                                </span>{" "}
                                Aadhaar Card, Passport, PAN Card.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Address Proof:
                                </span>{" "}
                                Utility Bills, Voter ID, Rental Agreement.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Age Proof:
                                </span>{" "}
                                Birth Certificate, School Leaving Certificate.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                Medical Reports (if required for specific
                                policies).
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isLifeInsurance && activeTab === "documents" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Required Documents
                          </h2>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                          <ul className="space-y-4">
                            {[
                              {
                                title:
                                  "Identity Proof (Any one of the following):",
                                details: [
                                  "Aadhaar Card",
                                  "PAN Card",
                                  "Passport",
                                  "Voter ID",
                                  "Driving License",
                                ],
                              },
                              {
                                title:
                                  "Address Proof (Any one of the following):",
                                details: [
                                  "Aadhaar Card",
                                  "Utility Bills (Electricity, Water, Gas)",
                                  "Ration Card",
                                  "Rental Agreement",
                                ],
                              },
                              {
                                title: "Age Proof (Any one of the following):",
                                details: [
                                  "Birth Certificate",
                                  "Passport",
                                  "School/College Leaving Certificate",
                                ],
                              },
                              {
                                title:
                                  "Income Proof (For high-value policies):",
                                details: [
                                  "Salary Slips",
                                  "Income Tax Returns (ITR)",
                                  "Form 16",
                                ],
                              },
                              {
                                title:
                                  "Medical Reports (If required by the insurer for risk assessment)",
                                details: [],
                              },
                              {
                                title: "Recent Passport-size Photographs",
                                details: [],
                              },
                            ].map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {doc.title}
                                  </span>
                                  {doc.details.length > 0 && (
                                    <ul className="ml-4 mt-1 list-disc text-slate-600">
                                      {doc.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isTravelInsurance && activeTab === "documents" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Required Documents
                          </h2>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                          <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Passport & Visa Copies
                                </span>
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Flight Tickets & Itinerary
                                </span>
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Identity Proof:
                                </span>{" "}
                                Aadhaar Card, PAN Card
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Medical Reports:
                                </span>{" "}
                                If required for senior citizens.
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isAutoInsurance && activeTab === "documents" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Required Documents
                          </h2>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                          <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Identity Proof (Any one):
                                </span>{" "}
                                Aadhaar Card, PAN Card, Passport, Voter ID, or
                                Driving License.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Address Proof (Any one):
                                </span>{" "}
                                Aadhaar Card, Utility Bills (Electricity, Water,
                                Gas), Ration Card, or Rental Agreement.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Vehicle Documents:
                                </span>{" "}
                                Vehicle Registration Certificate (RC), Pollution
                                Under Control (PUC) Certificate, and Previous
                                Insurance Policy (if applicable).
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <span className="font-semibold text-slate-800">
                                  Income Proof (For high-value policies):
                                </span>{" "}
                                Salary Slips, Income Tax Returns (ITR), or Form
                                16.
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                <CheckCircle className="h-5 w-5 text-primary" />
                              </div>
                              <div>Recent Passport-size Photographs.</div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {isBusinessInsurance && activeTab === "documents" && (
                    <div className="mt-0">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <Clock className="h-8 w-8 text-primary" />
                          <h2 className="text-2xl font-bold text-slate-800">
                            Required Documents
                          </h2>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-8">
                          <ul className="space-y-4">
                            {[
                              {
                                title: "Business Registration Certificate",
                                description: "",
                              },
                              {
                                title: "Company Financial Statements",
                                description: "",
                              },
                              {
                                title: "Address Proof",
                                description: "Utility Bills, Rental Agreement.",
                              },
                              {
                                title: "Identity Proof",
                                description: "PAN Card, Aadhaar Card.",
                              },
                            ].map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="mt-1 bg-primary/10 p-1 rounded-full">
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    {doc.title}
                                  </span>
                                  {doc.description && <> – {doc.description}</>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PolicyInformation
