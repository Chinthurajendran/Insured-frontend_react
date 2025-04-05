import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const useWebRTCAgent = (agentId,setShowCallScreen) => {
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const remoteAudioRef = useRef(new Audio()); // Reference to play remote audio
  const callerIdRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const offerRef = useRef(null); // Store the received offer
  const callerId = useSelector((state) => state.agentAuth.agent_username)


  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/webrtc/${agentId}`);

    ws.onopen = () =>{ console.log("✅ WebSocket connected (Agent)")};

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message (Agent):", message);

      if (message.type === "offer") {
        console.log("Incoming call from:", message.sender_id);
        callerIdRef.current = message.sender_id;
        offerRef.current = message.offer; // Store the offer for later use
        setIncomingCall(true);
      } else if (message.type === "candidate") {
        console.log("Handling candidate:", message);
        console.log("Incoming call from:", message.sender_id);
        callerIdRef.current = message.sender_id;
        await handleCandidate(message);
      } else if (message.type === "call-ended") {
        console.log("Call ended by caller:", message);
        callerIdRef.current = message.sender_id;
        setIncomingCall(false);
        setShowCallScreen(false)
        endCall();
      }
    };

    setSocket(ws);

    return () => {
      ws.onclose = () => {
        console.log("🔴 WebSocket disconnected. Reconnecting...");
        setTimeout(() => {
          setSocket(new WebSocket(`ws://127.0.0.1:8000/ws/webrtc/${agentId}`));
        }, 3000); // Reconnect after 3 seconds
      };
      
    };
  }, []);

  // **Accept Call (Only When Incoming Call Exists)**
  const acceptCall = async () => {
    setIncomingCall(false);

    try {
      if (!offerRef.current) {
        console.error("Error: No offer available to accept.");
        return;
      }

      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      remoteStream.current = new MediaStream();

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(JSON.stringify({
            type: "candidate",
            target_id: callerIdRef.current,
            candidate: event.candidate,
          }));
        }
      };

      // **Handle Incoming Audio Track**
      peer.ontrack = (event) => {
        console.log("🔊 Received remote track:", event.track.kind);
        if (event.track.kind === "audio") {
          remoteStream.current.addTrack(event.track);
          remoteAudioRef.current.srcObject = remoteStream.current;
          remoteAudioRef.current.play().catch((err) =>
            console.error("🔇 Audio playback error:", err)
          );
        }
      };

      localStream.current.getTracks().forEach((track) =>
        peer.addTrack(track, localStream.current)
      );
      setPeerConnection(peer);

      await peer.setRemoteDescription(new RTCSessionDescription(offerRef.current));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.send(JSON.stringify({
        type: "answer",
        target_id: callerIdRef.current,
        answer
      }));

    } catch (error) {
      console.error("❌ Error accepting call:", error);
    }
  };

  // **Handle ICE Candidate**
  const handleCandidate = async ({ candidate }) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  // **End Call - Cleanup**
  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (remoteStream.current) {
      remoteStream.current = null;
    }

    if (socket && callerIdRef.current) {
      socket.send(JSON.stringify({ type: "call-ended", target_id: callerIdRef.current }));
    }
  };

  return { acceptCall, endCall, incomingCall, localStream, remoteStream ,callerId};
};

export default useWebRTCAgent;
