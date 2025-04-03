import React, { useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import Admin_header from "../../components/admin_compnents/Admin_header"
import AdminSidebar from "../../components/admin_compnents/Admin_sidebar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function Admin_home() {
  const navigate = useNavigate()
  const admin_authenticated = useSelector(
    (state) => state.adminAuth.isAuthenticated_admin
  )

  useEffect(() => {
    if (!admin_authenticated) {
      navigate("/Admin_login_page")
    }
  }, [admin_authenticated, navigate])
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Admin_header />
      <div className="flex flex-grow">
        <AdminSidebar />
        <div className="w-5/6 p-6">
          <div className="h-[85vh] overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_home
