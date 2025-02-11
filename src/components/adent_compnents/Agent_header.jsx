import React from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { agent_logout } from "../../store/slices/agentAuthentication"
import { toast } from "react-toastify"

function Agent_header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogoutSubmit = () => {
    localStorage.clear()
    dispatch(agent_logout())
    console.log("hhee")
    navigate("/Agent_login_page")
    toast.success("Logout successful. See you next time!")
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
