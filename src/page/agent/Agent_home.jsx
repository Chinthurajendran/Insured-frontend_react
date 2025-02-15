import React, { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import Agent_header from "../../components/adent_compnents/Agent_header"
import Agent_sidebar from "../../components/adent_compnents/Agent_sidebar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function Agent_home() {
  const agent_token = localStorage.getItem("agent_access_token")
  const navigate = useNavigate()

  useEffect(() => {
    if (!agent_token) {
      navigate("/Agent_login_page")
    }
  }, [agent_token, navigate])

  return (
    <div>
      <Agent_header />
      <div className="flex">
        <Agent_sidebar />
        <div className="w-5/6 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Agent_home
