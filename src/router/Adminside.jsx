import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Admin_login_page from "../page/admin/Admin_login_page.jsx"
import Admin_home from "../page/admin/Admin_home.jsx"
import Admin_user_management from "../page/admin/Admin_user_management.jsx"
import Admin_policy_list from "../page/admin/Admin_policy_list.jsx"
import Admin_policy_create from "../page/admin/Admin_policy_create.jsx"

import Demo_loading_page from "../page/admin/demo.jsx"

import Agent_management from "../page/admin/Agent_management.jsx"
import Agent_approval_rejection_page from "../page/admin/Agent_approval_rejection_page"
import Agent_list from "../page/admin/Agent_list.jsx"
import Admin_policy_edit from "../page/admin/Admin_policy_edit.jsx"
import PolicyApprovalRejection from "../page/admin/PolicyApprovalRejection.jsx"
import PolicyApprovalRejection_page from "../page/admin/PolicyApprovalRejection_page.jsx"
import PolicyList from "../page/admin/PolicyList.jsx"
import PolicyInfo from "../page/admin/PolicyInfo.jsx"
import PolicyInfoCreate from "../page/admin/PolicyInfoCreate.jsx"
import AdminRouter from "../PrivateRoute/AdminRouter.jsx"
import DashboardGraph from "../page/admin/DashboardGraph.jsx"

function Adminside() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Admin_login_page" element={<Admin_login_page />} />
          <Route element={<AdminRouter />}>
            <Route path="/Admin_home" element={<Admin_home />}>
              <Route path="users" element={<Admin_user_management />} />
              <Route path="policy" element={<Admin_policy_list />} />
              <Route path="agentmanagement" element={<Agent_management />} />
              <Route path="Agent_list" element={<Agent_list />} />
              <Route path="DashboardGraph" element={<DashboardGraph />} />
              <Route
                path="PolicyApprovel"
                element={<PolicyApprovalRejection />}
              />
              <Route path="PolicyList" element={<PolicyList />} />
              <Route path="PolicyInfo" element={<PolicyInfo />} />
              <Route path="Demo" element={<Demo_loading_page />} />
            </Route>
            <Route
              path="PolicyApprovalRejection_page"
              element={<PolicyApprovalRejection_page />}
            />
            <Route
              path="/Agent_approval_rejection_page"
              element={<Agent_approval_rejection_page />}
            />
            <Route
              path="/Policy_create_page"
              element={<Admin_policy_create />}
            />
            <Route path="/Admin_policy_edit" element={<Admin_policy_edit />} />
            <Route path="/PolicyInfoCreate" element={<PolicyInfoCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Adminside
