import React from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { agent_logout } from '../store/slices/agentAuthentication';


const AgentRouter = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.agentAuth.isAuthenticated_agent)

  if (!isAuthenticated) {
    dispatch(agent_logout());
    return <Navigate to="/Agent_login_page" replace />;
  }

  return <Outlet />;
}

export default AgentRouter;