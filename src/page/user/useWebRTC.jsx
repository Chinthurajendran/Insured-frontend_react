import { useEffect, useRef, useState } from "react"

const useWebRTC = (userId, targetUserId,setShowCallScreen) => {
  const [socket, setSocket] = useState(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const localStream = useRef(null)
  const remoteStream = useRef(null)

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/webrtc/${userId}`)

    ws.onopen = () => {
      console.log("✅ WebSocket connected (user)")
    }

    ws.onmessage = async (event) => {
      console.log("📨 Raw event data:", event.data)

      // Parse the received message
      const message = JSON.parse(event.data)
      console.log("📬 Received message:", message)

      // Handle different message types
      if (message.type === "offer") {
        console.log("🤝 Handling offer:", message)
        await handleOffer(message)
      } else if (message.type === "answer") {
        console.log("✅ Handling answer:", message)
        await handleAnswer(message)
      } else if (message.type === "candidate") {
        console.log("📡 Handling candidate:", message)
        await handleCandidate(message)
      } else if (message.type === "call-ended") {
        console.log("📴 Call ended:", message)
        endCall() // Handle call termination
        setShowCallScreen(false)
      } else {
        console.warn("⚠️ Unknown message type:", message.type)
      }
    }

    ws.onerror = (event) => {
      console.error("❌ WebSocket error:", event) // Log the entire event object
      console.error("❌ WebSocket error code:", event.code) //log the error code if it exists.
      console.error("❌ WebSocket error reason:", event.reason) //log the error reason if it exists.
    }
    ws.onclose = (event) =>
      console.log("🔌 WebSocket connection closed:", event)

    // Save the WebSocket instance to state (if needed elsewhere)
    setSocket(ws)

    // Clean up the WebSocket connection on unmount
    return () => {
      console.log("🚪 Cleaning up WebSocket connection")
      ws.onclose = () => {
        console.log("🔴 WebSocket disconnected. Reconnecting...")
        setTimeout(() => {
          setSocket(new WebSocket(`ws://127.0.0.1:8000/ws/webrtc/${userId}`))
        }, 3000) // Reconnect after 3 seconds
      }
    }
  }, [])

  // **Start Call - Get User Media and Create Peer Connection**
  const startCall = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      remoteStream.current = new MediaStream()

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(
            JSON.stringify({
              type: "candidate",
              target_id: targetUserId,
              sender_id: userId,
              candidate: event.candidate,
            })
          )
        }
      }

      // peer.ontrack = (event) => {
      //   remoteStream.current.addTrack(event.track)
      // }

      peer.ontrack = (event) => {
        console.log("Received track:", event.track);
        console.log("Track kind:", event.track.kind);
        console.log("Track enabled:", event.track.enabled);
    
        remoteStream.current.addTrack(event.track);
        console.log("Remote stream:", remoteStream.current);
      };

      // peer.ontrack = (event) => {
      //   console.log("Received remote track:", event.track);
      //   remoteStream.current.addTrack(event.track);
      //   console.log("Remote stream:", remoteStream.current);
      // };

      localStream.current
        .getTracks()
        .forEach((track) => peer.addTrack(track, localStream.current))
      setPeerConnection(peer)

      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)

      socket.send(
        JSON.stringify({ type: "offer", target_id: targetUserId, offer })
      )
    } catch (error) {
      console.error("Error starting call:", error)
    }
  }

  // **Handle Incoming WebRTC Offer**
  const handleOffer = async ({ offer }) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })

    remoteStream.current = new MediaStream()

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({
            type: "candidate",
            target_id: targetUserId,
            sender_id: userId,

            candidate: event.candidate,
          })
        )
      }
    }

    peer.ontrack = (event) => {
      remoteStream.current.addTrack(event.track)
    }

    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
    }

    localStream.current
      .getTracks()
      .forEach((track) => peer.addTrack(track, localStream.current))
    setPeerConnection(peer)

    await peer.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)

    socket.send(
      JSON.stringify({ type: "answer", target_id: targetUserId, answer })
    )
  }

  // **Handle Answer**
  const handleAnswer = async ({ answer }) => {
    if (peerConnection) {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      )
    }
  }

  // **Handle ICE Candidate**
  const handleCandidate = async ({ candidate }) => {
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }

  // **End Call - Cleanup**
  const endCall = () => {
    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop())
      localStream.current = null
    }

    if (remoteStream.current) {
      remoteStream.current = null
    }

    if (socket) {
      socket.send(
        JSON.stringify({ type: "call-ended", target_id: targetUserId })
      )
    }
  }

  return { startCall, endCall, localStream, remoteStream }
}

export default useWebRTC
