import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Agent_header from "../../components/adent_compnents/Agent_header";
import Agent_sidebar from "../../components/adent_compnents/Agent_sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CallNotification from "./CallNotification";

function AgentHome() {
  const agent_authenticated = useSelector((state) => state.agentAuth.isAuthenticated_agent)
  const navigate = useNavigate();

  useEffect(() => {
    if (!agent_authenticated) {
      navigate("/Agent_login_page");
    }

    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [agent_authenticated, navigate]);

  return (
    <div className="h-screen overflow-hidden">
      <Agent_header />
      <div className="flex h-full">
        <Agent_sidebar />
        <div className="w-5/6 p-6">
        <CallNotification />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AgentHome;
