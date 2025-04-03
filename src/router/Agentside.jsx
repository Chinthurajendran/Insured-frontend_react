import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Agent_login_page from "../page/agent/Agent_login_page.jsx"
import Agent_sign_up_page from "../page/agent/Agent_sign_up_page.jsx"
import AgentHome from "../page/agent/AgentHome.jsx"
import Demo from "../page/admin/demo.jsx"
import AgentProfle from "../page/agent/AgentProfle.jsx"
import AgentDocumentUpload from "../page/agent/AgentDocumentUpload.jsx"
import AgentPolicyList from "../page/agent/AgentPolicyList.jsx"
import PolicyStatus from "../page/agent/PolicyStatus.jsx"
import PolicyResubmit from "../page/agent/PolicyResubmit.jsx"
import CustomerSearch from "../page/agent/CustomerSearch.jsx"
import AgentPasswordRecovery from "../page/agent/AgentPasswordRecovery.jsx"
import AgentResetpassword from "../page/agent/AgentResetpassword.jsx"
import AgentRouter from "../PrivateRoute/AgentRouter.jsx"
import CustomerPolicyList from "../page/agent/CustomerPolicyList.jsx"
import CustomerInfo from "../page/agent/CustomerInfo.jsx"
import CustomerAssistance from "../page/agent/CustomerAssistance.jsx"
import CallNotification from "../page/agent/CallNotification.jsx"
import DashboardGraph from "../page/agent/DashboardGraph.jsx"

function Agentside() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Agent_login_page" element={<Agent_login_page />} />
        <Route path="/Agent_sign_up_page" element={<Agent_sign_up_page />} />
        <Route element={<AgentRouter />}>
          <Route path="/Agent_home" element={<AgentHome />}>
            <Route path="demo" element={<Demo />} />
            <Route path="AgentProfle" element={<AgentProfle />} />
            <Route
              path="AgentDocumentUpload"
              element={<AgentDocumentUpload />}
            />
            <Route path="AgentPolicyList" element={<AgentPolicyList />} />
            <Route path="PolicyStatus" element={<PolicyStatus />} />
            <Route path="CustomerSearch" element={<CustomerSearch />} />
            <Route path="CustomerAssistance" element={<CustomerAssistance />} />
            <Route path="DashboardGraph" element={<DashboardGraph />} />
          </Route>
          <Route path="/PolicyResubmit" element={<PolicyResubmit />} />
          <Route path="/CustomerPolicyList" element={<CustomerPolicyList />} />
          <Route path="/CustomerInfo" element={<CustomerInfo />} />
          <Route path="/CallNotification" element={<CallNotification />} />
        </Route>
        <Route path="/AgentResetpassword" element={<AgentResetpassword />} />
        <Route
            path="/AgentPasswordRecovery"
            element={<AgentPasswordRecovery />}
          />
      </Routes>
    </BrowserRouter>
  )
}

export default Agentside
