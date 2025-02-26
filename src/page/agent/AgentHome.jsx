import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Agent_header from "../../components/adent_compnents/Agent_header";
import Agent_sidebar from "../../components/adent_compnents/Agent_sidebar";
import { useNavigate } from "react-router-dom";

function AgentHome() {
  const agent_token = localStorage.getItem("agent_access_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!agent_token) {
      navigate("/Agent_login_page");
    }

    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [agent_token, navigate]);

  return (
    <div className="h-screen overflow-hidden">
      <Agent_header />
      <div className="flex h-full">
        <Agent_sidebar />
        <div className="w-5/6 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AgentHome;
