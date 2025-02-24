import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Agent_login_page from '../page/agent/Agent_login_page.jsx';
import Agent_sign_up_page from '../page/agent/Agent_sign_up_page.jsx';
import AgentHome from '../page/agent/AgentHome.jsx';
import Demo from '../page/admin/demo.jsx';
import AgentProfle from '../page/agent/AgentProfle.jsx';

function Agentside() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Agent_login_page" element={<Agent_login_page />} />
        <Route path="/Agent_sign_up_page" element={<Agent_sign_up_page />} />

        <Route path="/Agent_home" element={<AgentHome />}>
            <Route path="demo" element={<Demo />} />
            <Route path="AgentProfle" element={<AgentProfle />} />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default Agentside;
