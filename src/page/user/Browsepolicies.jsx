import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import.meta.env

const baseURL = import.meta.env.VITE_API_LOCAL_URL

const PolicyCard = ({ image, title, description, onClick }) => (
  <div
    className="max-w-sm overflow-hidden bg-white rounded-lg shadow-lg cursor-pointer transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#0B4B2C]"
    onClick={onClick}
  >
    <img
      src={image}
      alt={title}
      className="w-full h-56 object-cover rounded-t-lg"
    />
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 text-sm line-clamp-3">{description}</p>
    </div>
  </div>
)

function Browsepolicies() {
  const [policy, setPolicy] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${baseURL}/auth/Policyinfo_list`)
        if (response.status === 200) {
          const policies = response.data?.policies || response.data
          const approvedPolicies = policies.filter(
            (policy) => policy.delete_status === "False"
          )
          setPolicy(approvedPolicies)
        }
      } catch (error) {
        console.error("Error fetching policies:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPolicies()
  }, [])

  const handleCardClick = (policyId) => {
    navigate(`/Policyinformation`, { state: { policyinfo_uid: policyId } })
  }

  return (
    <div className="bg-[#0B4B2C] min-h-screen py-20 flex items-center">
      <section className="w-full">
        <div className="container mx-auto px-6">
          <h2 className="text-white text-4xl font-extrabold mb-12 text-center animate-fadeIn">
            Individual & Umbrella Policies
          </h2>
          {loading ? (
            <p className="text-white text-center text-xl animate-pulse">
              Loading policies...
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {policy.map((policys) => (
                <PolicyCard
                  key={policys.policyinfo_uid}
                  image={policys.photo}
                  title={policys.policyinfo_name}
                  description={policys.titledescription}
                  onClick={() => handleCardClick(policys.policyinfo_uid)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Browsepolicies
