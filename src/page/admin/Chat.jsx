import React, { useEffect, useRef, useState } from "react"
import useWebSocket from "./useWebSocket"
import Image from "../../assets/happy3.png"
import EmojiPicker from "emoji-picker-react"

const Chat = ({ setIsChatOpen, sender_id, receiver_id }) => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { messages, sendMessage } = useWebSocket(sender_id, receiver_id)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[450px] bg-[#0B4B2C] shadow-2xl rounded-2xl flex flex-col border border-gray-400 z-50 overflow-hidden">
      <div className="flex justify-between items-center bg-[#0B4B2C] text-white p-4 rounded-t-2xl border-b border-gray-400 shadow-md">
        <h2 className="text-lg font-semibold">Chat</h2>
        <button
          onClick={handleClose}
          className="text-white hover:text-gray-300 transition-all transform hover:scale-110"
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

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 text-gray-900 space-y-2">
        {messages.map((msg, index) => {
          const isUserMessage = msg.sender_id === sender_id
          const time = new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })

          return (
            <div
              key={index}
              className={`relative p-3 rounded-lg shadow-md text-sm ${
                isUserMessage
                  ? "bg-[#0B4B2C] text-white ml-auto rounded-br-none"
                  : "bg-[#1E88E5] text-white mr-auto rounded-bl-none"
              }`}
              style={{
                alignSelf: isUserMessage ? "flex-end" : "flex-start",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxWidth: `${Math.min(
                  80 + msg.content.length * 8,
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

      {showEmojiPicker && (
        <div className="absolute bottom-16 left-2 bg-white border rounded-lg shadow-lg z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
{/* 
      <div className="p-3 flex items-center space-x-2 border-t bg-white shadow-md rounded-b-2xl">
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
      </div> */}
    </div>
  )
}

export default Chat
