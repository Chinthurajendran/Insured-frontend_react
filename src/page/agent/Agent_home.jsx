import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Agent_header from "../../components/adent_compnents/Agent_header"
import Agent_sidebar from "../../components/adent_compnents/Agent_sidebar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";


function Agent_home() {
    const isAuthenticated = useSelector((state) => state.agentAuth.isAuthenticated);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/Agent_home");
      }
    }, [isAuthenticated, navigate]);
  
  return (
    <div>
      <Agent_header />
      <div className="flex">
        <Agent_sidebar />
        <div className="w-5/6 p-6">
          <Outlet /> {/* Child routes will be rendered here */}
        </div>
      </div>
    </div>
  )
}

export default Agent_home
