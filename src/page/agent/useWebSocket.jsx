import {useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../baseUrls/Urls";

const useWebSocket = (sender_id,receiver_id) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const agentId = useSelector((state) => state.agentAuth.agent_uuid);



  useEffect(() => {
    if (!receiver_id) {
      console.warn("Receiver ID is not set. Skipping WebSocket initialization.");
      return;
    }
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${baseURL}/message_auth/messages/${receiver_id}?sender_id=${sender_id}`);
        console.log("📜 Chat history:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
    };

    fetchChatHistory();
    console.log("agent",agentId)
    console.log("agent_sender_id",sender_id)
    console.log("user_receiver_id",receiver_id)

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sender_id}`);

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
    };


    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("📩 Received:", message);
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };



    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed. Attempting to reconnect...");
      setTimeout(() => {
        const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${sender_id}`);
        setSocket(newSocket);
      }, 3000);
    };

    setSocket(ws);

    return () => {
      console.log("🛑 Closing WebSocket connection");
      ws.close();
    };
  }, [receiver_id]);


  const sendMessage = (message) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket is not ready yet. Retrying...");
      return;
    }
    const payload = {
      content: message,
      receiver_id: receiver_id,
      sender_id: sender_id,
    };
    socket.send(JSON.stringify(payload));
  };
  

  return { messages, sendMessage };
};

export default useWebSocket;
