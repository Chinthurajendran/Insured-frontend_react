import React, { useState, useEffect } from "react"
import User_header from "../../components/user_compnents/User_header"
import User_body from "../../components/user_compnents/User_body"
import User_footer from "../../components/user_compnents/User_footer"
import AnimatedInsuredText from "./AnimatedInsuredText"
import axios from "axios"
import { baseURL } from "../../baseUrls/Urls"
import { useSelector } from "react-redux"
import axiosInstance from "../../Interceptors/user"

function Home() {
  const token = useSelector((state) => state.userToken.user_access_token)
  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const res = await axiosInstance.post(`PaymentUpdation`);
        if (res.status === 200) {
          console.log("Payment status updated successfully!");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    };

    updatePaymentStatus();
  }, [token]);

  return (
    <div className="bg-green-900 text-white">
      <User_header />
      <User_body />
      <User_footer />
    </div>
  )
}

export default Home
