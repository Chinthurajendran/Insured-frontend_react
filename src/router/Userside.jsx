import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../page/user/Home"
import Login_page_with_google from "../page/user/Login_with_google.jsx"
import Login_page from "../page/user/Login_page.jsx"
import Sign_up from "../page/user/Sign_up.jsx"
import Userprofile from "../page/user/Userprofile.jsx"
import Userpage from "../page/user/Userpage.jsx"
import Userpolicy from "../page/user/Userpolicy.jsx"
import Policypage from "../page/user/Policypage.jsx"
import Passwordrecovery from "../page/user/passwordrecovery.jsx"
import Resetpassword from "../page/user/Resetpassword.jsx"
import PolicyDocumentUpload from "../page/user/PolicyDocumentUpload.jsx"
import Browsepolicies from "../page/user/Browsepolicies.jsx"
import Policyinformation from "../page/user/Policyinformation.jsx"
import UserRouter from "../PrivateRoute/UserRouter.jsx"
import Plandetails from "../page/user/Plandetails.jsx"
import RazorpayPayment from "../page/user/RazorpayPayment.jsx"
import Walletpage from "../page/user/Walletpage.jsx"
import RazorpayPaymentWallet from "../page/user/RazorpayPaymentWallet.jsx"

function Userside() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/Loginpage_with_google"
            element={<Login_page_with_google />}
          />
          <Route path="/Login_page" element={<Login_page />} />
          <Route path="/Sign_up_pag" element={<Sign_up />} />
          <Route path="/" element={<Home />} />
          
          <Route element={<UserRouter />}>
              <Route path="/Userpage" element={<Userpage />}>
                <Route path="Userprofile" element={<Userprofile />} />
                <Route path="Userpolicy" element={<Userpolicy />} />
                <Route path="Walletpage" element={<Walletpage />} />
              </Route>
            <Route path="/Policypage" element={<Policypage />} />
            <Route path="/PolicyDocumentUpload" element={<PolicyDocumentUpload />}/>
            <Route path="/Plandetails" element={<Plandetails />} />
            <Route path="/RazorpayPayment" element={<RazorpayPayment />} />
            <Route path="/RazorpayPaymentWallet" element={<RazorpayPaymentWallet />} />
          </Route>
          <Route path="/Policyinformation" element={<Policyinformation />} />
          <Route path="/Browsepolicies" element={<Browsepolicies />} />
          <Route path="/Passwordrecovery" element={<Passwordrecovery />} />
          <Route path="/Resetpassword" element={<Resetpassword />} />
          <Route path="/useWebSocket" element={<useWebSocket />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Userside
