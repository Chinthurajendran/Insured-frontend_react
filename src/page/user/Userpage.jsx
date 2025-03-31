import React from "react";
import { Outlet } from "react-router-dom";
import User_profile_sidebar from "../../components/user_compnents/User_profile_sidebar";
import UserHeader from "../../components/user_compnents/User_header";
function Userpage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <UserHeader />
      

      <div className="flex mt-20">

        <div className="w-1/6">
          <User_profile_sidebar />
        </div>

        <div className="w-5/6 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Userpage;
