import { useEffect, useRef, useState } from "react";

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
      const ws = new WebSocket(`ws://api.insuredplus.shop/ws/webrtcvedio/${agentId}`);

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
      if (socket) {
        socket.close();
      }
    };
  }, [agentId]);

  // Handle WebSocket messages
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

  // Accept incoming call
  const acceptCall = async () => {
    setIncomingCall(false);

    try {
      if (!offerRef.current) {
        console.error("🚫 No offer to accept");
        return;
      }

      // Get local media stream
      localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (localVideoRef.current && localStream.current) {
        localVideoRef.current.srcObject = localStream.current;
      } else {
        console.warn("⚠️ Local video ref or stream missing");
      }

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // ICE candidate handler
      peer.onicecandidate = (event) => {
        if (event.candidate && socket && callerIdRef.current) {
          socket.send(JSON.stringify({
            type: "candidate",
            target_id: callerIdRef.current,
            candidate: event.candidate,
          }));
        }
      };

      // Track handler
      peer.ontrack = (event) => {
        if (!remoteStream.current) {
          remoteStream.current = new MediaStream();
        }

        event.streams[0].getTracks().forEach((track) => {
          remoteStream.current.addTrack(track);
        });

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
      };

      // Add local tracks to peer connection
      localStream.current.getTracks().forEach(track => {
        peer.addTrack(track, localStream.current);
      });

      peerConnectionRef.current = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(offerRef.current));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      // Send the answer
      socket.send(JSON.stringify({
        type: "answer",
        target_id: callerIdRef.current,
        answer,
      }));

    } catch (err) {
      console.error("❌ Error accepting call:", err);
    }
  };

  // Handle ICE candidate
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

  // End the call
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
