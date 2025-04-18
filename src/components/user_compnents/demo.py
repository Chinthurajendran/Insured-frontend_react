# import React, { useEffect, useState } from "react";
# import { UserIcon, BellIcon } from "@heroicons/react/20/solid";
# import { Link } from "react-router-dom";
# import { useSelector } from "react-redux";
# import Notification from "../../page/user/Notification";
# import axiosInstance from "../../Interceptors/user";
# import Chat from "../../page/user/Chat";
# import customer_white from "../../assets/customer-service-white.png"

# const UserHeader = () => {
#   const user_token = useSelector((state) => state.userAuth.isAuthenticated);
#   const userId = useSelector((state) => state.userAuth.userid);
#   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
#   const [isChatOpen, setIsChatOpen] = useState(false);
#   const [message, setMessage] = useState([]);
#   const [location, setLocation] = useState({ latitude: null, longitude: null });

#   const handleChatToggle = () => {
#   if ("geolocation" in navigator) {
#     navigator.geolocation.getCurrentPosition(
#       (position) => {
#         const { latitude, longitude } = position.coords;

#         setLocation({latitude, longitude});

#         setIsChatOpen(true);
#       },
#       (error) => {
#         console.error("Failed to retrieve location:", error.message);
#         alert("Unable to fetch location. Please enable location access.");
#       }
#     );
#   } else {
#     console.error("Geolocation is not supported by your browser.");
#     alert("Geolocation is not supported by your browser.");
#   }
#   };

  

#   const handleNotificationToggle = async () => {
#     setIsNotificationOpen((prev) => !prev);
#   };

#   useEffect(() => {
#     const fetchNotifications = async () => {
#       try {
#         const res = await axiosInstance.get('Getnotification/${userId}');
#         if (res.status === 200) {
#           setMessage(res.data.message);
#         }
#       } catch (error) {
#         console.log("Failed to fetch notifications.", error);
#       }
#     };

#     fetchNotifications();
#   }, [userId]);

#   return (
#     <header
#       className="absolute w-full z-10 px-6 py-4"
#       style={{ backgroundColor: "#0D4A31" }}
#     >
#       <nav className="flex items-center justify-between">
#         <a href="/" className="text-white text-2xl font-bold hover:scale-110">
#           Insured+
#         </a>

#         <div className="flex items-center space-x-8">
#           <div className="hidden md:flex space-x-6">
#             <a href="/" className="text-white hover:scale-110">
#               Home
#             </a>
#             <a href="/service" className="text-white hover:scale-110">
#               Service
#             </a>
#             <a href="/insurance" className="text-white hover:scale-110">
#               Insurance Services
#             </a>
#           </div>

#           <div className="flex items-center space-x-4">
#             <button className="text-white hover:scale-110" onClick={handleChatToggle}>
#               {/* <PhoneIcon className="w-6 h-6" /> */}
#               <img src={customer_white} alt="Customer Care" className="w-7 h-7" />
#             </button>
#             {isChatOpen && <Chat userId={userId} setIsChatOpen={setIsChatOpen} sendChatWithLocation={location} />}

#             {user_token ? (
#               <>
#                 <button
#                   className="text-white hover:scale-110 relative"
#                   onClick={handleNotificationToggle}
#                 >
#                   <div className="relative">
#                     <BellIcon className="w-6 h-6 " />

#                     {/* Notification count badge */}
#                     {message.length > 0 && (
#                       <span className="absolute -top-2 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
#                         {message.length}
#                       </span>
#                     )}
#                   </div>

#                   {isNotificationOpen && <Notification messages={message} />}
#                 </button>

#                 <Link to={"/Userpage/Userprofile"}>
#                   <button className="text-white hover:scale-110">
#                     <UserIcon className="w-6 h-6" />
#                   </button>
#                 </Link>
#               </>
#             ) : (
#               <Link to="/Loginpage_with_google">
#                 <button className="bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors px-6 py-1.5">
#                   <span>Sign In</span>
#                 </button>
#               </Link>
#             )}
#           </div>
#         </div>
#       </nav>
#     </header>
#   );
# };

# export default UserHeader;