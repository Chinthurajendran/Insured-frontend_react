import React from 'react'
import useWebRTCAgent from '../agent/useWebRTCAgent'

function CallNotification() {
    const agentId = useSelector((state) => state.agentAuth.agent_uuid);
    const { startCall, localStream, remoteStream, endCall } = useWebRTCAgent(agentId)
    
  return (
    <div className="absolute right-0 mt-2 w-72 shadow-lg bg-white z-10 rounded-lg p-2 border border-green-900">
      {notifications.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {notifications.map((note) => (
                <motion.li
                  key={note.notification_uid}
                  initial={{ opacity: 1, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }} 
                  transition={{ duration: 0.4 }}
                  className="p-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                >
                  <p className="text-green-900 text-xs font-normal">
                    {note.message}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(note.create_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <button
            className={`w-full mt-2 bg-green-900 text-white py-1 rounded-md transition ${
              removing ? "opacity-50 cursor-not-allowed" : "hover:bg-green-800"
            }`}
            onClick={!removing ? clearNotifications : undefined}
          >
            Clear All
          </button>
        </>
      ) : (
        <p className="p-2 text-gray-500 text-center">No new notifications</p>
      )}
    </div>
  )
}

export default CallNotification
