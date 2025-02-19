import React from "react"
import loginpage from "../../assets/login_page_image.jpg"
import { Link } from "react-router-dom"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { baseURL } from "../../baseUrls/Urls"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../../store/slices/userAuthentication"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const Login_with_google = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await axios.post(`${baseURL}/auth/google-login`, {
        token: credential, // Ensure that the token is being sent in the request body
      });
  
      if (res.status === 200) {
        localStorage.setItem("user_access_token", res.data.user_access_token);
        localStorage.setItem("user_refresh_token", res.data.user_refresh_token);
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("user_name", res.data.user_name);
        localStorage.setItem("user_role", res.data.user_role);
  
        const decodedToken = jwtDecode(res.data.user_access_token);
        dispatch(
          login({
            userid: decodedToken.user.user_id,
            username: res.data.user_name,
            user_role: res.data.user_role,
            isAuthenticated: true,
          })
        );
  
        navigate("/", { state: { message: "Login successful!" } });
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse items-center justify-center bg-white p-4">
      <div className="w-full lg:w-1/2 max-w-md px-5 ml-30">
        <div className="mb-8 w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold text-[#0B4B2C] mb-10">Insured+</h1>
          <h2 className="text-xl font-medium text-gray-900">Log in</h2>
        </div>

        <div className="space-y-4">

        <GoogleOAuthProvider clientId="270374642053-gvj2j07247e2h96gbd929oh12li1rs2l.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => {
                console.log('Login Failed');
                toast.error("Login failed. Please try again.");
              }}
            />
          </GoogleOAuthProvider>

          {/* <GoogleOAuthProvider clientId="270374642053-gvj2j07247e2h96gbd929oh12li1rs2l.apps.googleusercontent.com">
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg"
              onClick={handleSuccess}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </GoogleOAuthProvider> */}
          <Link to="/Login_page">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
              </svg>
              Continue with Email
            </button>
          </Link>
        </div>

        <div className="mt-8 w-full flex justify-center ">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/Sign_up_pag">
              <a
                href="/signup"
                className="text-emerald-700 hover:text-emerald-600 font-semibold"
              >
                Sign up
              </a>
            </Link>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center ml-2">
        <img
          src={loginpage}
          alt="Happy couple with insurance coverage"
          className="object-cover w-full max-w-[120%] h-auto"
        />
      </div>
    </div>
  )
}

export default Login_with_google
