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

function Adminside() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Admin_login_page" element={<Admin_login_page />} />
          <Route path="/Admin_home" element={<Admin_home />}>
            <Route path="users" element={<Admin_user_management />} />
            <Route path="policy" element={<Admin_policy_list />} />
            <Route path="agentmanagement" element={<Agent_management />} />
            <Route path="Agent_list" element={<Agent_list />} />
            <Route path="Demo" element={<Demo_loading_page />} />
          </Route>
          <Route path="/Agent_approval_rejection_page" element={<Agent_approval_rejection_page />} />
          <Route path="/Policy_create_page" element={<Admin_policy_create />} />
          <Route path="/Admin_policy_edit" element={<Admin_policy_edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Adminside
