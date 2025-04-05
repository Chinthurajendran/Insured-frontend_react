import React, { useEffect, useState } from "react"
import useWebSocket from "./useWebSocket"
import axiosInstance from "../../Interceptors/user"

const Chat = ({setIsChatOpen,sender_id,receiver_id}) => {
  const [message, setMessage] = useState("")
  const { messages, sendMessage } = useWebSocket(sender_id,receiver_id)

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

  const handleClose = () => {
    setIsChatOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-[#0B4B2C] shadow-lg rounded-lg flex flex-col border border-gray-300 z-50">
      <div className="flex justify-between items-center bg-[#0B4B2C] text-white p-3 rounded-t-lg border-b border-gray-300">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-200"
        >
          ✖
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white text-gray-800">
        {messages.map((msg, index) => {
          let isUserMessage = false 
          return (
            <div
              key={index}
              className={`p-2 mb-2 rounded-md max-w-xs relative ${
                isUserMessage
                  ? "bg-[#0B4B2C] text-white self-end"
                  : "bg-[#1E88E5] text-white self-start"
              }`}
              style={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: `${Math.min(
                  50 + msg.content.length * 8,
                  window.innerWidth * 0.9
                )}px`,
              }}
            >
              <span
                className={`absolute ${
                  isUserMessage
                    ? "right-[-10px] top-3 border-l-[#0B4B2C]"
                    : "left-[-10px] top-3 border-r-[#1E88E5]"
                } border-t-[8px] border-b-[8px] border-transparent`}
              ></span>
              {msg.content}
            </div>
          )
        })}
      </div>

      {/* Input and Send Button */}
      {/* <div className="p-2 flex items-center space-x-2 border-t bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-[#0B4B2C] text-gray-800"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-3 py-2 bg-[#0B4B2C] text-white rounded-lg hover:bg-[#096b44]"
        >
          Send
        </button>
      </div> */}
    </div>
  )
}

export default Chat
