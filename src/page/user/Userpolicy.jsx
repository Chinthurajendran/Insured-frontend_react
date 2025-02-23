import React from "react"
import { PlusSquare } from "lucide-react"
import { Link } from "react-router-dom"


function Userpolicy() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 flex items-center space-x-6 -mt-150">
        <div className="flex-shrink-0">
          <PlusSquare className="w-16 h-16 text-gray-400" />
        </div>

        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-gray-900">
            You don&apos;t have any policies yet!
          </h2>
          <p className="text-gray-600 max-w-lg mt-2">
            Buy an insurance policy to protect your family & assets now.
          </p>
        </div>

        <div>
          <Link to={"/Policypage"}>
            <button className="bg-emerald-700 hover:bg-emerald-800 px-6 py-2 text-white rounded-md">
              Explore
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Userpolicy
