import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Admin_header from "../../components/admin_compnents/Admin_header";
import AdminSidebar from "../../components/admin_compnents/Admin_sidebar";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

function Admin_home() {
  const navigate = useNavigate();
  const admin_token = localStorage.getItem('admin_access_token')

  useEffect(() => {
    if (!admin_token) {
      navigate("/Admin_login_page");
    }
  }, [admin_token, navigate]);
  return (
    <div>
      <Admin_header />
      <div className="flex">
        <AdminSidebar />
        <div className="w-5/6 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Admin_home;
