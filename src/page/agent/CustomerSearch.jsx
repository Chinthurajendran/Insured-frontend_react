import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import axiosInstance from "../../Interceptors/agent"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

function CustomerSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null);
  const agentId = useSelector((state) => state.agentAuth.agent_uuid)

  // useEffect(() => {
  //   if (!query) {
  //     setSuggestions([])
  //     return
  //   }

  //   const fetchSuggestions = async () => {
  //     setIsLoading(true)
  //     try {
  //       const res = await axiosInstance.get(
  //         `/search-suggestions?query=${query}`
  //       )
  //       if (res.status === 200) {
  //         const uniqueSuggestions = [...new Set(res.data)]
  //         setSuggestions(uniqueSuggestions)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching suggestions:", error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   const debounce = setTimeout(() => fetchSuggestions(), 300)
  //   return () => clearTimeout(debounce)
  // }, [query])

  
  useEffect(() => {

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/search/${agentId}`);

    // is an event handler that runs when the WebSocket connection is successfully opened.
    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
    
      if (query.trim()) {
        const payload = { content: query };
        console.log("📩 Sending payload:", payload);
        ws.send(JSON.stringify(payload));  // ✅ Use `ws`, not `socket`
      } else {
        console.log("⚠️ No query to send.");
      }
    };
    
;

ws.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    console.log("📩 Received:", message);

    if (message.suggestions) {
      setSuggestions((prev) => {
        // 🔥 Merge old & new suggestions, remove duplicates
        const mergedSuggestions = [...new Set([...prev, ...message.suggestions])];
        return mergedSuggestions;
      });
    }
  } catch (error) {
    console.error("❌ Error parsing WebSocket message:", error);
  }
};


    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed. Attempting to reconnect...");
      setTimeout(() => {
        const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/search/${agentId}`);
        setSocket(newSocket);
      }, 3000);
    };

    setSocket(ws);

    return () => {
      console.log("🛑 Closing WebSocket connection");
      ws.close();
    };

  }, [query]);;


  // const sendMessage = (query) => {
  //   if (!socket || socket.readyState !== WebSocket.OPEN) {
  //     console.warn("⚠️ WebSocket is not ready yet. Retrying...");
  //     return;
  //   }
  //   // socket.send(message);
  //   const payload = {
  //     content: query,
  //   };
  //   console.log("111111111",query)
  //   socket.send(JSON.stringify(payload));
  // };


  // const sendMessage = (query) => {
  //   if (!socket || socket.readyState !== WebSocket.OPEN) {
  //     console.warn("⚠️ WebSocket is not ready yet.");
  //     return;
  //   }
  //   const payload = { content: query };
  //   console.log("11111111111111111111",payload)
  //   socket.send(JSON.stringify(payload));
  // };
  // console.log("7777777777777",query)
  
  


  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const res = await axiosInstance.post("/customerdata", { email: query })

      if (res.status === 200) {
        navigate("/CustomerPolicyList", {
          state: { policies: res.data.policies },
        })
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Customer not found. Please check the email.")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b p-8">
      <div className="relative w-full max-w-lg pb-50">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Customer Search
        </h1>
        <form onSubmit={handleSearch} className="relative">
          <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-gray-50 focus-within:shadow-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search by email..."
              className="w-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white font-medium hover:bg-green-500 transition-colors flex items-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul
            className="absolute top-full left-0 right-0 -mt-49 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto text-sm"
            onMouseDown={(e) => e.preventDefault()} 
          >
            {suggestions.map((item, index) => (
              <li
                key={index}
                onMouseDown={() => {
                  setQuery(item) 
                  setShowSuggestions(false) 
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
              >
                <span>
                  <strong className="text-green-600">
                    {item.substring(0, query.length)}
                  </strong>
                  {item.substring(query.length)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Loading State */}
        {isLoading && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Loading suggestions...
          </p>
        )}
      </div>
    </div>
  )
}

export default CustomerSearch
