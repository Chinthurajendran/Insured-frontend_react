// import React from 'react'

// function CustomerSearch() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default CustomerSearch



// "use client"

import { useState } from "react"
import { Search } from "lucide-react"

function CustomerSearch() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", query)
    // Implement your search functionality here
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-lg px-4">
        <form
          onSubmit={handleSearch}
          className={`relative transition-all duration-300 ${isFocused ? "scale-105" : "scale-100"}`}
        >
          <div className="flex overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white placeholder-gray-300 focus:outline-none transition-colors duration-300"
              placeholder="Search for anything..."
            />
            <button
              type="submit"
              className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors duration-300 flex items-center gap-2 group"
            >
              <span>Search</span>
              <Search className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-[98%] h-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-b-lg opacity-70"></div>
        </form>

        {/* Optional helper text */}
        <p className="text-center text-gray-500 text-sm mt-4 opacity-80">
          Try searching for products, articles, or categories
        </p>
      </div>
    </div>
  )
}


export default CustomerSearch