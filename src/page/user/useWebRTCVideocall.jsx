import { useEffect, useRef, useState } from "react";
import.meta.env
const baseURL = import.meta.env.VITE_API_LOCAL_URL
const socketURL = import.meta.env.VITE_API_LOCAL_WEBSOCKET_URL

const useWebRTCVideocall = (userId, targetUserId, setShowCallScreen) => {
  const [socket, setSocket] = useState(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${socketURL}/ws/webrtc/${userId}`);
    ws.onopen = () => console.log("✅ WebSocket connected (user)");
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
            console.log("📡 Handling candidate:", message);
            try {
              if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(
                  new RTCIceCandidate(message.candidate)
                );
              } else {
                console.warn("⚠️ PeerConnection is not initialized.");
              }
            } catch (error) {
              console.error("❌ Failed to add ICE candidate:", error);
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
        console.error("❌ Error handling WebSocket message:", error);
      }
    };

    ws.onerror = (event) => console.error("❌ WebSocket error:", event);
    ws.onclose = (event) => console.log("🔌 WebSocket closed:", event);

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId]);

  const startVideoCall = async () => {
    try {
      // Check camera permission
      if (navigator.permissions) {
        const cameraPerm = await navigator.permissions.query({ name: "camera" });
        console.log("📷 Camera permission:", cameraPerm.state);
      }

      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Debug video tracks
      localStream.current.getVideoTracks().forEach((track) => {
        console.log("🎥 Local video track:", {
          id: track.id,
          kind: track.kind,
          muted: track.muted,
          enabled: track.enabled,
          readyState: track.readyState,
        });
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
        console.log("📹 Received remote track:", event.track);
        remoteStream.current.addTrack(event.track);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream.current;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch(console.error);
          };
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
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current.play().catch(console.error);
        };
      }
    } catch (error) {
      console.error("❌ Error starting video call:", error);
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
        console.log("📹 Received remote track:", event.track);
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

        // Debug video tracks
        localStream.current.getVideoTracks().forEach((track) => {
          console.log("🎥 Local video track (receiver):", {
            id: track.id,
            kind: track.kind,
            muted: track.muted,
            enabled: track.enabled,
            readyState: track.readyState,
          });
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
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current.play().catch(console.error);
        };
      }
    } catch (error) {
      console.error("❌ Error handling offer:", error);
    }
  };

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
