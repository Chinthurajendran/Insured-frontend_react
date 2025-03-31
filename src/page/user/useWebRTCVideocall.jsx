import { useEffect, useRef, useState } from "react";

const useWebRTCVideocall = (userId, targetUserId, setShowCallScreen) => {
  const [socket, setSocket] = useState(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // **WebSocket Setup**
  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/webrtc/${userId}`);
    ws.onopen = () => console.log("✅ WebSocket connected (user)");
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("📬 Received message:", message);

      try {
        switch (message.type) {
          case "offer":
            console.log("🤝 Handling offer:", message);
            await handleOffer(message);
            break;
          case "answer":
            console.log("✅ Handling answer:", message);
            if (peerConnection.current) {
              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(message.answer)
              );
            }
            break;
          case "candidate":
            console.log("📡 Handling candidate:", message);
            try {
              if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(
                  new RTCIceCandidate(message.candidate)
                );
                console.log("✅ ICE candidate added successfully.");
              } else {
                console.warn("⚠️ PeerConnection is not initialized.");
              }
            } catch (error) {
              console.error("❌ Failed to add ICE candidate:", error);
            }
            break;
          case "call-ended":
            console.log("📴 Call ended:", message);
            endVideoCall();
            setShowCallScreen(false);
            break;
          default:
            console.warn("⚠️ Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    };

    ws.onerror = (event) => console.error("❌ WebSocket error:", event);
    ws.onclose = (event) =>
      console.log("🔌 WebSocket connection closed:", event);

    setSocket(ws);

    return () => {
      console.log("🚪 Cleaning up WebSocket connection");
      ws.close();
    };
  }, [userId]);

  // **Start Video Call**
  const startVideoCall = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
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
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
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

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

  // **Handle Incoming WebRTC Offer**
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
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
      };

      if (!localStream.current) {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
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

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream.current;
      }
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  // **End Video Call**
  const endVideoCall = () => {
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

  return { startVideoCall, endVideoCall, localStream, remoteStream, localVideoRef, remoteVideoRef };
};

export default useWebRTCVideocall;
