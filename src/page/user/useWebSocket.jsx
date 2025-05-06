import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import.meta.env
const baseURL = import.meta.env.VITE_API_LOCAL_URL
const socketURL = import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL


const useWebSocket = (userId,receiver_id) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const token = useSelector((state) => state.userToken.user_access_token)



  useEffect(() => {
    if (!receiver_id) {
      console.warn("Receiver ID is not set. Skipping WebSocket initialization.");
      return;
    }
    
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${baseURL}/message_auth/messages/${receiver_id}?sender_id=${userId}`);

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
    };

    fetchChatHistory();
    
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${socketURL}/ws/${userId}`);

    ws.onopen = () => {
    };
;

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.warn("WebSocket closed. Attempting to reconnect...");
      setTimeout(() => {
        const newSocket = new WebSocket(`ws://${socketURL}/ws/${userId}`);
        setSocket(newSocket);
      }, 3000);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [receiver_id]);


  const sendMessage = (message) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not ready yet. Retrying...");
      return;
    }
    const payload = {
      content: message,
      receiver_id: receiver_id,
      sender_id: userId,
    };
    socket.send(JSON.stringify(payload));
  };
  

  return { messages, sendMessage };
};

export default useWebSocket;
