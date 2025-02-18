import { useState } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Wallet, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/userAuthentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import axiosInstance from "../../Interceptors/user";


function Sidebar() {
  const [selected, setSelected] = useState("Profile");

  const menuItems = [
    { name: "Profile", icon: <User className="h-5 w-5" />, link: "/Userpage/Userprofile" },
    { name: "Your Policies", icon: <FileText className="h-5 w-5" />, link: "/Userpage/Userprofile" },
    { name: "Wallet", icon: <Wallet className="h-5 w-5" />, link: "/Userpage/Userprofile" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Logout
  // const handleLogoutSubmit = () => {
  //   localStorage.clear();
  //   dispatch(logout());
  //   navigate("/");
  //   toast.success("Logout successful. See you next time!",);
  // };


  const handleLogoutSubmit = async () => {
    const user_id = localStorage.getItem("user_id")

    if (!user_id) {
      toast.error("No user ID found. Please log in again.")
      return
    }

    try {
      const res = await axiosInstance.put(`user_logout/${user_id}`)

      if (res.status === 200) {
        localStorage.removeItem("user_id")
        localStorage.removeItem("user_name")
        localStorage.removeItem("user_access_token")
        localStorage.removeItem("user_refresh_token")
        localStorage.removeItem("user_role")
        dispatch(logout())
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

        {/* Logout Button */}
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
