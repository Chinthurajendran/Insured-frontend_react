import "./App.css"
import Indexs from "./router/Indexs"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./NotFound"
import InternalServerError from "./InternalServerError"

function App() {
  return (
    <div>
      <Indexs />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/404" element={<NotFound />} />
          <Route path="/InternalServerError" element={<InternalServerError />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
