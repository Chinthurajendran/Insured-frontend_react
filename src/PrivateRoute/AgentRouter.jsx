import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { agent_logout } from "../store/slices/agentAuthentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../Interceptors/agent";
import { clearagentTokens } from "../store/slices/AgentToken";

const AgentRouter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Redux state values
  const isagent = useSelector((state) => state.agentAuth.agent_uuid);
  const isAuthenticated = useSelector(
    (state) => state.agentAuth.isAuthenticated_agent
  );
  const istoken = useSelector((state) => state.agentToken.agent_access_token);

  // Handle agent logout process
  const handleLogoutSubmit = async () => {
    if (!isagent) {
      console.log("No agent ID found");
      return;
    }

    try {
      const res = await axiosInstance.put(`agent_logout/${isagent}`);

      if (res.status === 200) {
        console.log("Logout successful:", res);
        dispatch(agent_logout());
        dispatch(clearagentTokens());
      } else {
        console.log("Unexpected response:", res);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    
    if (!isAuthenticated || istoken == null) {
      console.log("Agent is not authenticated or token is missing");
      handleLogoutSubmit();
      dispatch(agent_logout());
      dispatch(clearagentTokens());
      setShouldRedirect(true);
    }
  }, [isAuthenticated, istoken, dispatch]);

  useEffect(() => {
    if (isagent) {
    

      const agentblock = async () => {
        try {
          const res = await axiosInstance.get(`agent_is_blocked/${isagent}`);

          if (res.status === 200) {
            if (res.data.block_status === true) {
              console.log("Agent is blocked, logging out...");
              handleLogoutSubmit();
              navigate("/Agent_login_page");
              toast.warn(
                "Access denied: Your account has been blocked. Please contact support for assistance."
              );
            }
          } else {
            console.log("Unexpected block status response:", res);
          }
        } catch (error) {
          if (error.response && error.response.data) {
            console.log("Error response data:", error.response.data);
          } else {
            console.log("Error occurred during agent block check:", error);
          }
        }
      };

      agentblock();
    }
  }, [isagent, navigate]);

  if (shouldRedirect) {
    return <Navigate to="/Agent_login_page" replace />;
  }

  return <Outlet />;
};

export default AgentRouter;
