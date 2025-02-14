import React from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { agent_logout } from "../../store/slices/agentAuthentication"
import { toast } from "react-toastify"
import axios from "axios"
import { baseURL } from "../../baseUrls/Urls"
import { useSelector } from "react-redux"

function Agent_header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem("access_token")
  


  const handleLogoutSubmit = async () => {
    const agentId = localStorage.getItem("agent_uuid")
    console.log(agentId)

    if (!agentId) {
      toast.error("No agent ID found. Please log in again.")
      return
    }

    try {
      const res = await axios.put(`${baseURL}/agent_auth/agent_logout/${agentId}`,{},{
        headers: { Authorization: `Bearer ${token}`, },
      })
      
      if (res.status === 200) {
        localStorage.clear()
        dispatch(agent_logout())
        navigate("/Agent_login_page")
        toast.success("Logout successful. See you next time!")
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <header className="bg-[#0B4D2E] text-white px-6 py-4 flex justify-center items-center">
      <h2 className="text-xl font-bold">Agnet Panel</h2>
      <button
        onClick={handleLogoutSubmit}
        className="absolute right-6 px-4 py-2 bg-white text-[#0B4D2E] font-bold rounded hover:bg-gray-200 transition duration-300"
      >
        Log out
      </button>
    </header>
  )
}

export default Agent_header
