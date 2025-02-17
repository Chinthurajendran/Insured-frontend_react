import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import User_profile_header from "../../components/user_compnents/User_profile_header";
import User_profile_sidebar from "../../components/user_compnents/User_profile_sidebar";

function Userpage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <User_profile_header />

      {/* Sidebar + Content */}
      <div className="flex mt-20">
        {/* Sidebar */}
        <div className="w-1/6">
          <User_profile_sidebar />
        </div>

        {/* Main Content */}
        <div className="w-5/6 p-6">
          <Outlet />

          {/* Redirect to Profile by Default */}
          <Navigate to="/Userpage/Userprofile" replace />
        </div>
      </div>
    </div>
  );
}

export default Userpage;
