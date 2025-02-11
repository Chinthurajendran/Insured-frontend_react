import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  ShieldCheck,
  Briefcase,
  Phone,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function Admin_sidebar() {
  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);
  const [isAgencyOpen, setIsAgencyOpen] = useState(false);

  return (
    <aside className="w-1/6 bg-[#0B4D2E] text-white min-h-screen p-4 shadow-lg">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="Demo"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <Home className="h-5 w-5 mr-3" /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="users"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <Users className="h-5 w-5 mr-3" /> Users
            </Link>
          </li>
          <li>
            <button
              onClick={() => setIsPoliciesOpen(!isPoliciesOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3" /> Policies
              </div>
              {isPoliciesOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            {isPoliciesOpen && (
              <ul className="ml-6 mt-2 space-y-2 border-l-2 border-[#083D24] pl-3">
                <li>
                  <Link
                    to="Demo"
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]"
                  >
                    <ShieldCheck className="h-5 w-5 mr-3" /> Policy Approvals
                  </Link>
                </li>
                <li>
                  <Link
                    to="policy"
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]"
                  >
                    <FileText className="h-5 w-5 mr-3" /> Life Insurance
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              to="Demo"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <FileText className="h-5 w-5 mr-3" /> Policy Details
            </Link>
          </li>
          <li>
            <button
              onClick={() => setIsAgencyOpen(!isAgencyOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-3" /> Agency
              </div>
              {isAgencyOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
            {isAgencyOpen && (
              <ul className="ml-6 mt-2 space-y-2 border-l-2 border-[#083D24] pl-3">
                <li>
                  <Link
                    to="agentmanagement"
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]"
                  >
                    <Briefcase className="h-5 w-5 mr-3" /> Agency Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="Agent_list"
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-[#083D24]"
                  >
                    <Briefcase className="h-5 w-5 mr-3" /> Agent Listings
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              to="Demo"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-[#083D24]"
            >
              <Phone className="h-5 w-5 mr-3" /> Customer Care
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Admin_sidebar;

