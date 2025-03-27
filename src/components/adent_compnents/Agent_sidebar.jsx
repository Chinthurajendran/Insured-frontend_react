import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, ChevronDown, ChevronRight, List, Upload, CheckCircle, Database, HelpCircle } from 'lucide-react';

function AgentSidebar() {
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

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
              onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-3" /> Policies
              </span>
              {isPoliciesOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {isPoliciesOpen && (
              <ul className="ml-6 mt-2 space-y-2 border-l-2 border-[#083D24] pl-3">
                <li>
                  <Link to="AgentPolicyList" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]">
                    <List className="h-5 w-5 mr-3" /> Policy List
                  </Link>
                </li>
                <li>
                  <Link to="AgentDocumentUpload" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]">
                    <Upload className="h-5 w-5 mr-3" /> Document Upload
                  </Link>
                </li>
                <li>
                  <Link to="PolicyStatus" className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]">
                    <CheckCircle className="h-5 w-5 mr-3" /> Approval & Rejection
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="CustomerSearch" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]">
              <Database className="h-5 w-5 mr-3" /> Customer Database
            </Link>
          </li>
          <li>
            <Link to="CustomerAssistance" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]">
              <HelpCircle className="h-5 w-5 mr-3" /> Customer Assistance
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default AgentSidebar;
