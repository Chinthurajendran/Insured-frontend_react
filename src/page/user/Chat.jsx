import React, { useEffect, useRef, useState } from "react"
import useWebSocket from "./useWebSocket"
import axiosInstance from "../../Interceptors/user"
import EmojiPicker from "emoji-picker-react"

const Chat = ({ userId, setIsChatOpen, sendChatWithLocation }) => {
  const [message, setMessage] = useState("")
  const [receiver_id, Setreceiver_id] = useState(null)
  const { messages, sendMessage } = useWebSocket(userId, receiver_id)
  const messagesEndRef = useRef(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
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
            Setreceiver_id(agents[0].id) // Update with nearest agent's ID
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
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-[#0B4B2C] shadow-lg rounded-lg flex flex-col border border-gray-300 z-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0B4B2C] text-white p-3 rounded-t-lg border-b border-gray-300">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-200"
        >
          ✖
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white text-gray-800">
        {messages.map((msg, index) => {
          const isUserMessage = msg.sender_id === userId
          // let isUserMessage = false // Set to true for user messages, false for incoming messages
          return (
            <div
              key={index}
              className={`p-2 mb-2 rounded-md max-w-xs relative ${
                isUserMessage
                  ? "bg-[#0B4B2C] text-white ml-auto"
                  : "bg-[#1E88E5] text-white mr-auto"
              }`}
              style={{
                alignSelf: isUserMessage ? "flex-end" : "flex-start",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: `${Math.min(
                  50 + msg.content.length * 8,
                  window.innerWidth * 0.9
                )}px`,
              }}
            >
              {/* Speech bubble pointer */}
              <span
                className={`absolute top-3 w-0 h-0 border-[8px] border-transparent ${
                  isUserMessage
                    ? "right-[-8px] border-l-[#0B4B2C]"
                    : "left-[-8px] border-r-[#1E88E5]"
                }`}
              ></span>
              {msg.content}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 bg-white border rounded-lg shadow-lg z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Input and Send Button */}
      <div className="p-2 flex items-center space-x-2 border-t bg-white">
      <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="px-3 py-2 bg-[#1E88E5] text-white rounded-lg hover:bg-[#1565C0]"
        >
          😊
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#0B4B2C] text-gray-800"
          placeholder="Type a message..."
        />
<button
  onClick={() => {
    handleSend();
    setShowEmojiPicker(!showEmojiPicker);
  }}
  className="px-3 py-2 bg-[#0B4B2C] text-white rounded-lg hover:bg-[#096b44]"
>
  Send
</button>

      </div>
    </div>
  )
}

export default Chat
