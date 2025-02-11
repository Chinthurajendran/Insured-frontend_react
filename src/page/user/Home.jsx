import React, { useState, useEffect } from "react"
import User_header from "../../components/user_compnents/User_header"
import User_body from "../../components/user_compnents/User_body"
import User_footer from "../../components/user_compnents/User_footer"
import AnimatedInsuredText from "./AnimatedInsuredText"

function Home() {
  return (
    <div className="bg-green-900 text-white">
      <User_header />
      <User_body />
      <User_footer />
    </div>
  )
}

export default Home
