import { useState } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Wallet, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/userAuthentication";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [selected, setSelected] = useState("Profile");

  const menuItems = [
    { name: "Profile", icon: <User className="h-5 w-5" />, link: "/Userprofile" },
    { name: "Your Policies", icon: <FileText className="h-5 w-5" />, link: "/YourPolicies" },
    { name: "Wallet", icon: <Wallet className="h-5 w-5" />, link: "/Wallet" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Logout
  const handleLogoutSubmit = () => {
    localStorage.clear(); // Clear all localStorage data
    dispatch(logout()); // Dispatch logout action to update Redux state
    navigate("/"); // Navigate to home or login page
  };

  return (
    <div className="w-64 h-70 bg-[#0e4a31] p-4 pt-6 pl-6 mt-20 ml-2 rounded-3xl shadow-lg">
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
