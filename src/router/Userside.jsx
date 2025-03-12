import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../page/user/Home"
import Login_page_with_google from "../page/user/Login_with_google.jsx"
import Login_page from "../page/user/Login_page.jsx"
import Sign_up from "../page/user/Sign_up.jsx"
import Userprofile from "../page/user/Userprofile.jsx"
import Userpage from "../page/user/userpage.jsx"
import Userpolicy from "../page/user/Userpolicy.jsx"
import Policypage from "../page/user/Policypage.jsx"
import Passwordrecovery from "../page/user/passwordrecovery.jsx"
import Resetpassword from "../page/user/Resetpassword.jsx"
import PolicyDocumentUpload from "../page/user/PolicyDocumentUpload.jsx"

function Userside() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Loginpage_with_google"
            element={<Login_page_with_google />}
          />
          <Route path="/Login_page" element={<Login_page />} />
          <Route path="/Sign_up_pag" element={<Sign_up />} />
          <Route path="/Userpage" element={<Userpage />}>
            <Route path="Userprofile" element={<Userprofile />} />
            <Route path="Userpolicy" element={<Userpolicy />} />
          </Route>
          <Route path="/Policypage" element={<Policypage />} />
          <Route path="/Passwordrecovery" element={<Passwordrecovery />} />
          <Route path="/Resetpassword" element={<Resetpassword />} />
          <Route path="/PolicyDocumentUpload" element={<PolicyDocumentUpload />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Userside
