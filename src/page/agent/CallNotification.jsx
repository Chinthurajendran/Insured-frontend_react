import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import useWebRTCAgent from "../agent/useWebRTCAgent";

function CallNotification() {
  const agentId = useSelector((state) => state.agentAuth.agent_uuid);
  const [showCallScreen, setShowCallScreen] = useState(false);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const { acceptCall, endCall, incomingCall, callerId } = useWebRTCAgent(
    agentId,
    setShowCallScreen,
    localAudioRef,
    remoteAudioRef
  )

  const AnswerCall = useCallback(() => {
    if (!acceptCall) return;
    setShowCallScreen(true);
    acceptCall();
  }, [acceptCall]);

  const RejectCall = useCallback(() => {
    if (!endCall) return;
    setShowCallScreen(false);
    endCall();
  }, [endCall]);

  // Handle closing call screen with "Escape" key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        RejectCall();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [RejectCall]);

  return (
    <>
      {/* Incoming Call Notification */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-96 bg-white shadow-lg border border-gray-300 rounded-lg p-4 z-50"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-900 text-md font-semibold">
                📞 Incoming Call from {callerId || "Unknown"}
              </p>
            </div>
            <div className="mt-4 flex justify-around">
              <CallButton label="Answer" color="bg-green-600 hover:bg-green-700" onClick={AnswerCall} />
              <CallButton label="Reject" color="bg-red-600 hover:bg-red-700" onClick={RejectCall} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Call Screen */}
      <AnimatePresence>
        {showCallScreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 bg-opacity-95 flex flex-col items-center justify-center z-50"
          >
            {/* User Icon */}
            <div className="mb-6 animate-pulse">
              <div className="flex items-center justify-center w-32 h-32 bg-gray-800 rounded-full border-2 border-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-16 h-16"
                  aria-label="User Icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zM12 14c-4 0-6 1.5-6 3v3h12v-3c0-1.5-2-3-6-3z"
                  />
                </svg>
              </div>
              <audio ref={localAudioRef} autoPlay muted />
              <audio ref={remoteAudioRef} autoPlay />
            </div>

            {/* End Call Button */}
            <CallButton label="End Call" color="bg-red-600 hover:bg-red-700" onClick={RejectCall} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Reusable Button Component
const CallButton = ({ label, color, onClick }) => (
  <button
    className={`px-6 py-3 text-white text-lg font-semibold rounded-md transition shadow-md ${color}`}
    onClick={onClick}
    aria-label={label}
  >
    {label}
  </button>
);

export default CallNotification;
