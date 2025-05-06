import { useEffect, useRef, useState } from "react";

const socketURL = import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL;

const useWebRTCAgentVideoCall = (agentId, showVideoCallScreen) => {
  const [incomingCalls, setIncomingCall] = useState(false);
  const [socket, setSocket] = useState(null);
  const peerConnectionRef = useRef(null);

  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callerIdRef = useRef(null);
  const offerRef = useRef(null);

  useEffect(() => {
    const setupWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const ws = new WebSocket(`${socketURL}/ws/webrtcvedio/${agentId}`);

      ws.onopen = () => console.log("✅ WebSocket connected");

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };

      ws.onclose = () => {
        console.warn("❌ WebSocket closed. Retrying...");
        setTimeout(setupWebSocket, 3000);
      };

      setSocket(ws);
    };

    setupWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [agentId]);

  const handleWebSocketMessage = async (message) => {
    switch (message.type) {
      case "offer":
        callerIdRef.current = message.sender_id;
        offerRef.current = message.offer;
        setIncomingCall(true);
        break;

      case "candidate":
        handleCandidate(message.candidate);
        break;

      case "call-ended":
        endCall();
        showVideoCallScreen(false);
        break;

      case "answer":
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(message.answer)
          );
        }
        break;

      default:
        console.warn("❓ Unknown message type:", message.type);
    }
  };

  const acceptCall = async () => {
    setIncomingCall(false);

    try {
      if (!offerRef.current) {
        console.error("🚫 No offer to accept");
        return;
      }

      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      localStream.current.getTracks().forEach(track => {
        track.enabled = true;
        console.log("🔄 Enabling and adding local track:", track.kind);
      });

      if (localVideoRef.current && localStream.current) {
        localVideoRef.current.srcObject = localStream.current;
      } else {
        console.warn("⚠️ Local video ref or stream missing");
      }

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (event) => {
        if (event.candidate && socket && callerIdRef.current) {
          socket.send(JSON.stringify({
            type: "candidate",
            target_id: callerIdRef.current,
            candidate: event.candidate,
          }));
        }
      };

      peer.ontrack = (event) => {
        console.log("📹 Received remote track:", event.track);
        console.log("📦 Event streams:", event.streams);

        if (!remoteStream.current) {
          remoteStream.current = new MediaStream();
        }

        remoteStream.current.addTrack(event.track);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play();
          };
          console.log("✅ Set remote video srcObject");
        }
      };

      localStream.current.getTracks().forEach(track => {
        peer.addTrack(track, localStream.current);
      });

      peerConnectionRef.current = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(offerRef.current));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.send(JSON.stringify({
        type: "answer",
        target_id: callerIdRef.current,
        answer,
      }));

    } catch (err) {
      console.error("❌ Error accepting call:", err);
    }
  };

  const handleCandidate = async (candidate) => {
    if (!peerConnectionRef.current) {
      console.warn("⏳ PeerConnection not ready");
      return;
    }

    try {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("❌ Failed to add ICE candidate:", err);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

    if (remoteStream.current) {
      remoteStream.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (socket && callerIdRef.current) {
      socket.send(JSON.stringify({ type: "call-ended", target_id: callerIdRef.current }));
    }

    setIncomingCall(false);
  };

  return {
    acceptCall,
    endCall,
    incomingCalls,
    localVideoRef,
    remoteVideoRef,
  };
};

export default useWebRTCAgentVideoCall;