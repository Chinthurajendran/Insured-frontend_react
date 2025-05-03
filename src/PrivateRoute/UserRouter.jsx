import { Navigate, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/slices/userAuthentication"
import { clearTokens } from "../store/slices/UserToken"
import { useEffect, useState } from "react"
import axiosInstance from "../Interceptors/user"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const UserRouter = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isUser = useSelector((state) => state.userAuth.userid)
  const isAuthenticated = useSelector((state) => state.userAuth.isAuthenticated)
  const istoken = useSelector((state) => state.userToken.user_access_token)
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const handleLogoutSubmit = async () => {
    if (!isUser) {
      toast.error("No user ID found. Please log in again.")
      return
    }

    try {
      const res = await axiosInstance.put(`user_logout/${isUser}`)

      if (res.status === 200) {
        dispatch(logout())
        dispatch(clearTokens())
        console.log("Logout successful.")
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  useEffect(() => {
    if (!isAuthenticated || istoken == null) {
      handleLogoutSubmit()
      dispatch(logout())
      dispatch(clearTokens())
      setShouldRedirect(true)
    }
  }, [istoken])

  useEffect(() => {
    const userblock = async () => {
      try {
        const res = await axiosInstance.get(`user_is_blocked/${isUser}`)
        if (res.status === 200) {
          if (res.data.block_status == true) {
            handleLogoutSubmit()
            navigate("/Login_page")
            toast.warn(
              "Access denied: Your account has been blocked. Please contact support for assistance."
            )
          }
        }
      } catch (error) {
        if (error.response && error.response.data) {
          console.log(error.response.data.detail)
        } else {
          console.log("Something went wrong. Please try again.")
        }
      }
    }

    userblock()
  },[isUser,navigate])

  if (shouldRedirect) {
    return <Navigate to="/Login_page" replace />
  }

  return <Outlet />
}

export default UserRouter
