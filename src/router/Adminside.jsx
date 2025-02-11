import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Admin_login_page from "../page/admin/Admin_login_page.jsx"
import Admin_home from "../page/admin/Admin_home.jsx"
import AdminUserList from "../page/admin/AdminUserList.jsx"
import Admin_policy_management from "../page/admin/Admin_policy_management.jsx"
import Policy_create_page from "../page/admin/Policy_create_page.jsx"
import Demo from "../page/admin/demo.jsx"
import Agent_management from "../page/admin/Agent_management.jsx"
import Agent_approval_page from "../page/admin/Agent_approval_page.jsx"
import Agent_list from "../page/admin/Agent_list.jsx"

function Adminside() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Admin_login_page" element={<Admin_login_page />} />
          <Route path="/Admin_home" element={<Admin_home />}>
            <Route path="users" element={<AdminUserList />} />
            <Route path="policy" element={<Admin_policy_management />} />
            <Route path="agentmanagement" element={<Agent_management />} />
            <Route path="Agent_list" element={<Agent_list />} />
            <Route path="Demo" element={<Demo />} />
          </Route>
          <Route path="/Agent_approval_page" element={<Agent_approval_page />} />
          <Route path="/Policy_create_page" element={<Policy_create_page />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Adminside
