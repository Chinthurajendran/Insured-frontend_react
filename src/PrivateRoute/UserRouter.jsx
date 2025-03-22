import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/userAuthentication";
import { clearTokens } from "../store/slices/UserToken";
import { useEffect, useState } from "react";

const UserRouter = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated);
  const istoken = useSelector((state) => state.userToken.user_access_token);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || istoken == null) {
      dispatch(logout());
      dispatch(clearTokens());
      setShouldRedirect(true);
    }
  }, [isAuthenticated, istoken, dispatch]);

  if (shouldRedirect) {
    return <Navigate to="/Login_page" replace />;
  }

  return <Outlet />;
};

export default UserRouter;
