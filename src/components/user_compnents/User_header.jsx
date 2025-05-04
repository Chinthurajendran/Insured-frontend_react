import React, { useEffect, useState } from "react"
import { UserIcon, BellIcon } from "@heroicons/react/20/solid"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import Notification from "../../page/user/Notification"
import axiosInstance from "../../Interceptors/user"
import Chat from "../../page/user/Chat"
import customer_white from "../../assets/customer-service-white.png"
import customer_green from "../../assets/customer-service-green.png"
import { useRef } from "react"
import.meta.env

const socketURL = import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL

const UserHeader = () => {
  const user_token = useSelector((state) => state.userAuth.isAuthenticated)
  const userId = useSelector((state) => state.userAuth.userid)
  const location = useLocation()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [locations, setLocation] = useState({ latitude: null, longitude: null })
  const [message, setMessage] = useState([])
  const [socket, setSocket] = useState(null)
  const protocol = window.location.protocol === "https:" ? "wss" : "ws"
  const websocketUrl = `${protocol}://${socketURL}/ws/notification/${userId}`
  const wsRef = useRef(null)

  const isProfilePage =
    location.pathname.includes("/Userpage/Userprofile") ||
    location.pathname.includes("/Userpage/Userpolicy") ||
    location.pathname.includes("/Userpage/Walletpage")

  const handleNotificationToggle = async () => {
    setIsNotificationOpen((prev) => !prev)
  }
  const handleChatToggle = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          setLocation({ latitude, longitude })

          setIsChatOpen(true)
        },
        (error) => {
          console.error("Failed to retrieve location:", error.message)
          alert("Unable to fetch location. Please enable location access.")
        }
      )
    } else {
      console.error("Geolocation is not supported by your browser.")
      alert("Geolocation is not supported by your browser.")
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get(`Getnotification/${userId}`)
      if (res.status === 200) {
        setMessage(res.data.message)
      }
    } catch (error) {
      console.log("Failed to fetch notifications.", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    const ws = new WebSocket(websocketUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket Connected")
    }

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data)

      if (newNotification.action === "DELETE") {
        setMessage([])
      } else {
        setMessage((prevMessages) => {
          const exists = prevMessages.some(
            (msg) => msg.notification_uid === newNotification.notification_uid
          )
          return exists ? prevMessages : [...prevMessages, newNotification]
        })
      }
    }

    ws.onclose = () => {
      console.warn(" WebSocket Disconnected. Reconnecting in 3s...")
      setTimeout(() => {
        wsRef.current = new WebSocket(websocketUrl)
      }, 3000)
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <header
      className={`absolute w-full z-10 px-6 py-4 transition-all duration-300 ${
        isProfilePage ? "bg-white border-b-4 border-[#0D4A31]" : "bg-[#0D4A31]"
      }`}
    >
      <nav className="flex items-center justify-between">
        <a
          href="/"
          className={`text-2xl font-bold transition-all duration-300 ${
            isProfilePage ? "text-[#0e4a31]" : "text-white"
          } hover:scale-110`}
        >
          Insured+
        </a>

        <div className="flex items-center space-x-8">
          <div className="hidden md:flex space-x-6">
            <a
              href="/"
              className={`font-bold transition-all duration-300 ${
                isProfilePage ? "text-[#0e4a31]" : "text-white"
              } hover:scale-110`}
            >
              Home
            </a>
            <a
              href="/Browsepolicies"
              className={`font-bold transition-all duration-300 ${
                isProfilePage ? "text-[#0e4a31]" : "text-white"
              } hover:scale-110`}
            >
              Service
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {user_token && (
              <button
                className={`transition-all duration-300 ${
                  isProfilePage ? "text-[#0e4a31]" : "text-white"
                } hover:scale-110`}
                onClick={handleChatToggle}
              >
                <img
                  src={isProfilePage ? customer_green : customer_white}
                  alt="Customer Care"
                  className="w-7 h-7"
                />
              </button>
            )}
            {isChatOpen && (
              <Chat
                userId={userId}
                setIsChatOpen={setIsChatOpen}
                sendChatWithLocation={locations}
              />
            )}

            {user_token ? (
              <>
                <div className="relative">
                  <button
                    className={`relative transition-all duration-300 ${
                      isProfilePage ? "text-[#0e4a31]" : "text-white"
                    } hover:scale-110`}
                    onClick={handleNotificationToggle}
                  >
                    <BellIcon className="w-6 h-6" />
                    {message.length > 0 && (
                      <span className="absolute -top-2 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {message.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <Notification
                      messages={message}
                      fetchNotifications={fetchNotifications}
                    />
                  )}
                </div>

                <Link to={"/Userpage/Userprofile"}>
                  <button
                    className={`relative transition-all duration-300 p-1 ${
                      isProfilePage
                        ? "bg-white text-[#0e4a31]  border-[#0e4a31]"
                        : "text-white"
                    }`}
                  >
                    <UserIcon className="w-6 h-6" />
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/Loginpage_with_google">
                <button className="bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors px-6 py-1.5">
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default UserHeader
