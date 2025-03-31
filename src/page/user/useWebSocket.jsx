import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../baseUrls/Urls";

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

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);

    // is an event handler that runs when the WebSocket connection is successfully opened.
    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
    };

    // is triggered whenever the WebSocket receives a new message from the server.
    // ws.onmessage = (event) => {
    //   console.log("📩 Received:", event.data);
    //   setMessages((prev) => [...prev, event.data]);
    // };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("📩 Received:", message);
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };

    // is triggered whenever the WebSocket connection is closed.
    // ws.onclose = () => {
    //   console.warn("⚠️ WebSocket closed. Attempting to reconnect...");
    //   setTimeout(() => {
    //     setSocket(new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`)); // Reconnect
    //   }, 3000);
    // };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed. Attempting to reconnect...");
      setTimeout(() => {
        const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${userId}`);
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
    // socket.send(message);
    const payload = {
      content: message,
      receiver_id: receiver_id,
      sender_id: userId, // Include receiver_id in the payload
    };
    socket.send(JSON.stringify(payload));
  };
  

  return { messages, sendMessage };
};

export default useWebSocket;
