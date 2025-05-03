import React, { useEffect, useRef, useState } from "react"
import useWebSocket from "./useWebSocket"
import axiosInstance from "../../Interceptors/user"
import EmojiPicker from "emoji-picker-react"
import Image from "../../assets/happy3.png"
import useWebRTC from "./useWebRTC"
import useWebRTCVideocall from "./useWebRTCVideocall"

const Chat = ({ userId, setIsChatOpen, sendChatWithLocation }) => {
  const [message, setMessage] = useState("")
  const [receiver_id, Setreceiver_id] = useState(null)
  const { messages, sendMessage } = useWebSocket(userId, receiver_id)
  const [VideoCallScreen, showVideoCallScreen] = useState(false)
  const [showCallScreen, setShowCallScreen] = useState(false)
  const { startCall, localStream, remoteStream, endCall } = useWebRTC(
    userId,
    receiver_id,
    setShowCallScreen
  )
  const { startVideoCall, endVideoCall, localVideoRef, remoteVideoRef } =
    useWebRTCVideocall(userId, receiver_id, setShowCallScreen)
  const messagesEndRef = useRef(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const handleCall = () => {
    setShowCallScreen(true)
    startCall()
  }

  const handleEndCall = () => {
    setShowCallScreen(false)
    endCall()
  }

  const handleVideoCall = () => {
    showVideoCallScreen(true)
    startVideoCall()
  }

  const handleEndVideoCall = () => {
    showVideoCallScreen(false)
    endVideoCall()
  }

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji)
  }

  const handleClose = () => {
    setIsChatOpen(false)
  }
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const locationString = `${sendChatWithLocation.latitude},${sendChatWithLocation.longitude}`
        const response = await axiosInstance.get(
          `nearestagent/${locationString}`
        )
        if (response.status === 200) {
          const agents = response.data?.agents || response.data
          if (Array.isArray(agents) && agents.length > 0) {
            Setreceiver_id(agents[0].id)
          } else {
            console.warn("No agents found.")
          }
        }
      } catch (error) {
        console.error("Error fetching policy details:", error)
      }
    }
    fetchPolicy()
  }, [userId])

  useEffect(() => {
    if (remoteStream.current) {
      console.log("Audio element stream:", remoteStream.current)
    }
  }, [remoteStream.current])
  
  return (
    <div className="fixed bottom-4 right-4 w-96 h-[450px] bg-[#0B4B2C] shadow-2xl rounded-2xl flex flex-col border border-gray-400 z-50 overflow-hidden">
      <div className="flex justify-between items-center bg-[#0B4B2C] text-white p-4 rounded-t-2xl border-b border-gray-400 shadow-md">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex items-center gap-3 ml-auto">
          <button
            className="text-white hover:text-gray-300 transition-all transform hover:scale-110 p-2 rounded-full hover:bg-gray-700/20"
            aria-label="Phone Call"
            onClick={handleCall}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M6.6,10.8c1.2,2.6,3.1,4.7,5.7,5.7l2-2c0.3-0.3,0.7-0.4,1.1-0.3c1,0.3,2.1,0.5,3.1,0.5c0.6,0,1,0.4,1,1v3.2 c0,0.6-0.4,1-1,1c-8.3,0-15-6.7-15-15c0-0.6,0.4-1,1-1h3.2c0.6,0,1,0.4,1,1c0,1.1,0.2,2.1,0.5,3.1c0.1,0.4,0,0.8-0.3,1.1 L6.6,10.8z" />
            </svg>
          </button>
          <audio
            ref={(ref) => ref && (ref.srcObject = localStream.current)}
            autoPlay
            muted
          />
          <audio
            ref={(ref) => ref && (ref.srcObject = remoteStream.current)}
            autoPlay
          />
          <button
            className="text-white hover:text-gray-300 transition-all transform hover:scale-110 p-2 rounded-full hover:bg-gray-700/20"
            aria-label="Video Call"
            onClick={handleVideoCall}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8v8a1 1 0 01-1.447.894L15 14v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h8a2 2 0 012 2v2z"
              />
            </svg>
          </button>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-all transform hover:scale-110 p-2 rounded-full hover:bg-gray-700/20"
            aria-label="Close Chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 text-gray-900 space-y-2">
        {messages?.map((msg, index) => {
          const isUserMessage = msg.sender_id === userId
          const time = new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })

          return (
            <div
              key={index}
              className={`relative px-3 py-2 rounded-lg shadow-md max-w-xs text-sm ${
                isUserMessage
                  ? "bg-[#0B4B2C] text-white ml-auto rounded-br-none"
                  : "bg-[#1E88E5] text-white mr-auto rounded-bl-none"
              }`}
              style={{
                alignSelf: isUserMessage ? "flex-end" : "flex-start",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: `${Math.min(
                  80 + (msg.content?.length ?? 0) * 8,
                  window.innerWidth * 0.9
                )}px`,
              }}
            >
              <div className="pr-10">{msg.content}</div>
              <span className="absolute bottom-1 right-2 text-[10px] text-white/60">
                {time}
              </span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {showCallScreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 bg-opacity-95 flex flex-col items-center justify-center z-50">
          <div className="mb-6 animate-pulse">
            <div className="flex items-center justify-center w-32 h-32 bg-gray-800 rounded-full border-2 border-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-16 h-16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zM12 14c-4 0-6 1.5-6 3v3h12v-3c0-1.5-2-3-6-3z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110 focus:outline-none"
              onClick={handleEndCall}
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {VideoCallScreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 bg-opacity-95 flex flex-col items-center justify-center z-50">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full h-full">
            <div className="relative w-40 h-40 lg:w-64 lg:h-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              ></video>
              <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                You
              </p>
            </div>
            <div className="relative w-64 h-64 lg:w-[75%] lg:h-[75%] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              ></video>
              <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                Caller
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <button
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110 focus:outline-none"
              onClick={handleEndVideoCall}
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 bg-white border rounded-lg shadow-lg z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="p-2 flex items-center space-x-2 border-t bg-white">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-12 py-2 border rounded-full focus:outline-none focus:ring focus:ring-[#0B4B2C] text-gray-800 shadow-sm"
            placeholder="Type a message..."
          />

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-all"
          >
            <img src={Image} alt="Emoji" width={24} height={24} />
          </button>
        </div>

        <button
          onClick={() => {
            handleSend()
            setShowEmojiPicker(false)
          }}
          className="px-4 py-2 bg-[#0B4B2C] text-white rounded-full hover:bg-[#096b44] transition-all shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M2.01 21L23 12 2.01 3v7l15 2.005L2.01 14z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Chat
