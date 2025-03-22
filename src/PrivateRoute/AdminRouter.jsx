import React from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { admin_logout } from '../store/slices/adminAuthentication';
import { clearAdminTokens } from '../store/slices/AdminToken';


const AdminRouter = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.adminAuth.isAuthenticated_admin)

  if (!isAuthenticated) {
    dispatch(admin_logout());
    dispatch(clearAdminTokens());
    return <Navigate to="/Admin_login_page" replace />;
  }

  return <Outlet />;
}

export default AdminRouter;