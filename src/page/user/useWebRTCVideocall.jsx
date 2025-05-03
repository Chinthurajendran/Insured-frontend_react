import { useEffect, useRef, useState } from "react";

const useWebRTCVideocall = (userId, targetUserId, setShowCallScreen) => {
  const [socket, setSocket] = useState(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(
      `${protocol}://${import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL}/ws/webrtc/${userId}`
    );

    ws.onopen = () => console.log("✅ WebSocket connected (user)");
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 WebSocket message received:", message);

      try {
        switch (message.type) {
          case "offer":
            await handleOffer(message.offer);
            break;
          case "answer":
            if (peerConnection.current) {
              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(message.answer)
              );
            }
            break;
          case "candidate":
            if (peerConnection.current && message.candidate) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(message.candidate)
              );
              console.log("📡 Added ICE candidate");
            }
            break;
          case "call-ended":
            endVideoCall();
            setShowCallScreen(false);
            break;
          default:
            console.warn("⚠️ Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("❌ Error handling message:", error);
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket error:", error);
    ws.onclose = () => console.log("🔌 WebSocket closed");

    setSocket(ws);

    return () => ws.close();
  }, [userId]);

  const checkIfVideoIsBeingSent = () => {
    const videoSender = peerConnection.current?.getSenders()?.find((sender) => sender.track?.kind === "video");
    if (videoSender && videoSender.track.readyState === "live") {
      console.log("✅ Video track is being sent");
    } else {
      console.warn("⚠️ Video is NOT being sent");
    }
  };

  const startVideoCall = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("🎥 Local stream:", localStream.current);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current.play().catch(console.error);
        };
      }

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnection.current = peer;

      remoteStream.current = new MediaStream();
      console.log("🔧 Initial remote stream:", remoteStream.current);

      peer.onicecandidate = (event) => {
        if (event.candidate && socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: "candidate",
            target_id: targetUserId,
            sender_id: userId,
            candidate: event.candidate,
          }));
        }
      };

      peer.ontrack = (event) => {
        console.log("📹 Received remote track:", event.track);
        remoteStream.current.addTrack(event.track);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch(console.error);
          };
        }

        console.log("✅ Remote stream active?", remoteStream.current.active);
      };

      localStream.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStream.current);
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.send(
        JSON.stringify({
          type: "offer",
          target_id: targetUserId,
          offer,
        })
      );

      setTimeout(checkIfVideoIsBeingSent, 2000);
    } catch (error) {
      console.error("❌ Error starting video call:", error);
    }
  };

  const handleOffer = async (offer) => {
    try {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnection.current = peer;

      remoteStream.current = new MediaStream();

      peer.onicecandidate = (event) => {
        if (event.candidate && socket?.readyState === WebSocket.OPEN) {
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
        console.log("📦 Received remote track:", event.track);
        remoteStream.current.addTrack(event.track);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch(console.error);
          };
        }
      };

      if (!localStream.current) {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
          localVideoRef.current.onloadedmetadata = () => {
            localVideoRef.current.play().catch(console.error);
          };
        }
      }

      localStream.current.getTracks().forEach((track) =>
        peer.addTrack(track, localStream.current)
      );

      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.send(
        JSON.stringify({
          type: "answer",
          target_id: targetUserId,
          answer,
        })
      );

      setTimeout(checkIfVideoIsBeingSent, 2000);
    } catch (error) {
      console.error("❌ Error handling offer:", error);
    }
  };

  const endVideoCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;

    localStream.current?.getTracks().forEach((track) => track.stop());
    remoteStream.current?.getTracks().forEach((track) => track.stop());

    localStream.current = null;
    remoteStream.current = null;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "call-ended",
          target_id: targetUserId,
        })
      );
    }
  };

  return {
    startVideoCall,
    endVideoCall,
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
  };
};

export default useWebRTCVideocall;
