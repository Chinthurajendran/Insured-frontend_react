import React from "react";

function Demo() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-gray-900 text-2xl font-semibold">Loading...</h1>
        <div className="flex justify-center mt-3 space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    </div>
  );
}

export default Demo;