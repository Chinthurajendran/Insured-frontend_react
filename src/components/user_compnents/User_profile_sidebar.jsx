import { useState } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Wallet, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/userAuthentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/user";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { clearTokens } from "../../store/slices/UserToken";


function Sidebar() {
  const [selected, setSelected] = useState("Profile");
  const location = useLocation();
  const user_id = useSelector((state) => state.userAuth.userid)

  const menuItems = [
    { name: "Profile", icon: <User className="h-5 w-5" />, link: "/Userpage/Userprofile" },
    { name: "Your Policies", icon: <FileText className="h-5 w-5" />, link: "/Userpage/Userpolicy" },
    { name: "Wallet", icon: <Wallet className="h-5 w-5" />, link: "/Userpage/Walletpage" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogoutSubmit = async () => {

    if (!user_id) {
      toast.error("No user ID found. Please log in again.")
      return
    }

    try {
      const res = await axiosInstance.put(`user_logout/${user_id}`)

      if (res.status === 200) {
        dispatch(logout())
        dispatch(clearTokens())
        navigate("/")
        toast.success("Logout successful. See you next time!")
      }
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <div className="w-64 h-70 bg-[#0e4a31] p-4 pt-6 pl-6  ml-2 rounded-3xl shadow-lg">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.link}
            onClick={() => setSelected(item.name)}
            className={`flex items-center gap-3 text-white font-bold p-3 rounded-xl transition-all duration-300 ${
              selected === item.name
                ? "bg-[#0A4528] scale-105"
                : "hover:bg-[#0A4528] hover:scale-105"
            }`}
            aria-label={item.name}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        <button
          onClick={handleLogoutSubmit}
          className="flex items-center gap-3 text-white font-bold p-3 rounded-xl transition-all duration-300 hover:bg-red-600 mt-4 w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
