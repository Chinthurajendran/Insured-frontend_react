import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Agent_login_page from "../page/agent/Agent_login_page.jsx"
import Agent_sign_up_page from "../page/agent/Agent_sign_up_page.jsx"
import Agent_home from "../page/agent/Agent_home.jsx"
import Demo from "../page/admin/demo.jsx"

function Agentside() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/Agent_login_page" element={<Agent_login_page />} />
          <Route path="/Agent_sign_up_page" element={<Agent_sign_up_page />} />
          <Route path="/Agent_home" element={<Agent_home />}>
          <Route path="Demo" element={<Demo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Agentside
