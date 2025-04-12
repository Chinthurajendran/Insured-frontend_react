import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useWebRTCAgentVideoCall from "./useWebRTCAgentVideoCall";

const VideoCallNotification = () => {
  const agentId = useSelector((state) => state.agentAuth.agent_uuid);

  const [VideoCallScreen, showVideoCallScreen] = useState(false);

  const {
    acceptCall,
    endCall,
    incomingCalls,
    localVideoRef,
    remoteVideoRef,
  } = useWebRTCAgentVideoCall(agentId, showVideoCallScreen);

  const AnswerCall = useCallback(() => {
    if (!acceptCall) return;
    showVideoCallScreen(true);
    acceptCall();
  }, [acceptCall]);

  const RejectCall = useCallback(() => {
    if (!endCall) return;
    showVideoCallScreen(false);
    endCall();
  }, [endCall]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        RejectCall();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [RejectCall]);

  useEffect(() => {
    if (localVideoRef.current) {
      console.log("✅ Local Video Ref is ready");
      console.log("🎥 Local Stream:", localVideoRef.current.srcObject);
    }
    if (remoteVideoRef.current) {
      console.log("✅ Remote Video Ref is ready");
      console.log("🎥 Remote Stream:", remoteVideoRef.current.srcObject);
    }
  }, [VideoCallScreen]);

  // ✅ Ensure remote video plays
  useEffect(() => {
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current
        .play()
        .then(() => console.log("▶️ Remote video playing"))
        .catch((err) => console.error("❌ Remote video play failed:", err));
    }
  }, [VideoCallScreen, remoteVideoRef.current?.srcObject]);

  // ✅ Ensure local video plays
  useEffect(() => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current
        .play()
        .then(() => console.log("▶Local video playing"))
        .catch((err) => console.error("❌ Local video play failed:", err));
    }
  }, [VideoCallScreen, localVideoRef.current?.srcObject]);

  return (
    <>
      <AnimatePresence>
        {incomingCalls && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-96 bg-white shadow-lg border border-gray-300 rounded-lg p-4 z-50"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-900 text-md font-semibold">
                📞 Incoming Video Call
              </p>
            </div>
            <div className="mt-4 flex justify-around">
              <CallButton
                label="Answer"
                color="bg-green-600 hover:bg-green-700"
                onClick={AnswerCall}
              />
              <CallButton
                label="Reject"
                color="bg-red-600 hover:bg-red-700"
                onClick={RejectCall}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {VideoCallScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 bg-opacity-95 flex flex-col items-center justify-center z-50"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full h-full">
              <div className="relative w-40 h-40 lg:w-64 lg:h-64 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                ></video>
                <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                  You
                </p>
              </div>

              <div className="relative w-64 h-64 lg:w-[75%] lg:h-[75%] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                ></video>
                <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                  Caller
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <button
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-transform transform hover:scale-110 focus:outline-none"
                onClick={RejectCall}
              >
                End Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CallButton = ({ label, color, onClick }) => (
  <button
    className={`px-6 py-3 text-white text-lg font-semibold rounded-md transition shadow-md ${color}`}
    onClick={onClick}
    aria-label={label}
  >
    {label}
  </button>
);

export default VideoCallNotification;
