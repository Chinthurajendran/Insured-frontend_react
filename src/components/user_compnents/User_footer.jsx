import React from "react"
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <a href="/" className="text-2xl font-bold text-[#0B4B2C]">
              Insured+
            </a>
            <p className="mt-4 text-gray-600 max-w-md">
              Insurance Plus offers comprehensive insurance solutions to
              individuals, families, and businesses.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <nav className="space-y-4">
                <a
                  href="/personal"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Personal
                </a>
                <a
                  href="/business"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Business
                </a>
                <a
                  href="/employee"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Employee
                </a>
                <a
                  href="/bounds"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Bounds
                </a>
              </nav>
            </div>
            <div>
              <nav className="space-y-4">
                <a
                  href="/privacy"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Terms & Condition
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            Bendsgner 2023 All rights reserved
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaFacebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
