import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import.meta.env
const socketURL = import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL

const useWebRTCAgent = (agentId,setShowCallScreen) => {
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const remoteAudioRef = useRef(new Audio());
  const callerIdRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const offerRef = useRef(null);
  const callerId = useSelector((state) => state.agentAuth.agent_username)


  useEffect(() => {
    const ws = new WebSocket(`ws://${socketURL}/ws/webrtc/${agentId}`);

    ws.onopen = () =>{ console.log("WebSocket connected (Agent)")};

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
 
      if (message.type === "offer") {
        callerIdRef.current = message.sender_id;
        offerRef.current = message.offer;
        setIncomingCall(true);
      } else if (message.type === "candidate") {
        callerIdRef.current = message.sender_id;
        await handleCandidate(message);
      } else if (message.type === "call-ended") {
        callerIdRef.current = message.sender_id;
        setIncomingCall(false);
        setShowCallScreen(false)
        endCall();
      }
    };

    setSocket(ws);

    return () => {
      ws.onclose = () => {
        setTimeout(() => {
          setSocket(new WebSocket(`ws://${socketURL}/ws/webrtc/${agentId}`));
        }, 3000);
      };
      
    };
  }, []);

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

      peer.ontrack = (event) => {
        if (event.track.kind === "audio") {
          remoteStream.current.addTrack(event.track);
          remoteAudioRef.current.srcObject = remoteStream.current;
          remoteAudioRef.current.play().catch((err) =>
            console.error("Audio playback error:", err)
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
      console.error("Error accepting call:", error);
    }
  };

  const handleCandidate = async ({ candidate }) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

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
