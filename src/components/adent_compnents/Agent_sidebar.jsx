import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, ChevronDown, ChevronRight, Upload, CheckCircle, Database, HelpCircle } from 'lucide-react';

function Agent_sidebar() {
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  const handleTogglePolicies = () => {
    setIsPoliciesOpen(!isPoliciesOpen);
  };

  return (
    <aside className="w-1/6 bg-[#0B4D2E] text-white min-h-screen p-4 shadow-lg">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="AgentProfle" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]">
              <Home className="h-5 w-5 mr-3" /> Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleTogglePolicies}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3" /> Policies
              </div>
              {isPoliciesOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {isPoliciesOpen && (
              <ul className="ml-6 mt-2 space-y-2 border-l-2 border-[#083D24] pl-3">
                <li>
                  <div className="flex items-center">
                    <Upload className="h-5 w-5 mr-3" /> 
                    <Link to="demo" className="px-4 py-2 rounded-lg hover:bg-[#083D24]"> Document upload </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" /> 
                    <Link to="demo" className="px-4 py-2 rounded-lg hover:bg-[#083D24]"> Approval & Rejection </Link>
                  </div>
                </li>
              </ul>
            )}
          </li>
          <li>
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-3" /> 
              <Link to="demo" className="px-4 py-3 rounded-lg hover:bg-[#083D24]"> Customer database </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-3" /> 
              <Link to="demo" className="px-4 py-3 rounded-lg hover:bg-[#083D24]"> Customer assistance </Link>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Agent_sidebar;
