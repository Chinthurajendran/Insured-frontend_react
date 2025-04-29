import { useEffect, useRef, useState } from "react";
import.meta.env
const socketURL = import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL

const useWebRTC = (userId, targetUserId, setShowCallScreen) => {
  const [socket, setSocket] = useState(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${socketURL}/ws/webrtc/${userId}`);

    ws.onopen = () => console.log("WebSocket connected (user)");
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);

      try {
        switch (message.type) {
          case "offer":
            await handleOffer(message);
            break;
          case "answer":
            if (peerConnection.current) {
              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(message.answer)
              );
            }
            break;
          case "candidate":
            if (peerConnection.current) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(message.candidate)
              );
            }
            break;
          case "call-ended":
            endCall();
            setShowCallScreen(false);
            break;
          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    ws.onerror = (event) => console.error("WebSocket error:", event);
    ws.onclose = (event) =>
      console.log("WebSocket connection closed:", event);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId]);

  const startCall = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      remoteStream.current = new MediaStream();

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(
            JSON.stringify({
              type: "candidate",
              target_id: targetUserId,
              sender_id: userId,
              candidate: event.candidate,
            })
          );
        }
      };

      peer.ontrack = (event) => {
        remoteStream.current.addTrack(event.track);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream.current;
        }
      };

      localStream.current.getTracks().forEach((track) =>
        peer.addTrack(track, localStream.current)
      );

      peerConnection.current = peer;

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.send(
        JSON.stringify({ type: "offer", target_id: targetUserId, offer })
      );
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleOffer = async ({ offer }) => {
    try {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      remoteStream.current = new MediaStream();

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(
            JSON.stringify({
              type: "candidate",
              target_id: targetUserId,
              sender_id: userId,
              candidate: event.candidate,
            })
          );
        }
      };

      peer.ontrack = (event) => {
        remoteStream.current.addTrack(event.track);
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream.current;
        }
      };

      if (!localStream.current) {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      localStream.current
        .getTracks()
        .forEach((track) => peer.addTrack(track, localStream.current));

      peerConnection.current = peer;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.send(
        JSON.stringify({ type: "answer", target_id: targetUserId, answer })
      );
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    if (remoteStream.current) {
      remoteStream.current = null;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "call-ended", target_id: targetUserId }));
    }
  };

  return { startCall, endCall, localStream, remoteStream, remoteAudioRef };
};

export default useWebRTC;
