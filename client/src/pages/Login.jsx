import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const location=useLocation()
  const [state, setState] = useState(location.state||"Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, getUserData } = useContext(Context);

  function handleLogoClick() {
    navigate("/");
  }

  function handleResetClick() {
    navigate("/reset-password");
  }

  function handleLogin() {
    setState("Login");
  }

  function handleSignUp() {
    setState("Sign Up");
  }

  function handleName(e) {
    setName(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/auth/register",
          { name, email, password },
          { withCredentials: true }
        );
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
          toast.success("Account created successfully! 🎉");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/auth/login",
          { email, password },
          { withCredentials: true }
        );
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate("/");
          toast.success("Welcome back! 👋");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  }




  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-orb"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-orb animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 border border-blue-500/10 rounded-lg rotate-12 animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-purple-500/10 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-40 right-20 w-12 h-12 border border-indigo-500/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 border border-pink-500/10 rounded-lg -rotate-12 animate-float animation-delay-2000"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex justify-between items-center p-4 sm:p-6 sm:px-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img
              onClick={handleLogoClick}
              src={assets.logo}
              alt="logo"
              className="w-28 sm:w-32 relative z-10 transform transition-all duration-300 group-hover:scale-105 cursor-pointer"
            />
          </div>
          
          <button
            onClick={() => navigate("/")}
            className="relative group overflow-hidden rounded-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white group-hover:bg-transparent px-6 py-2.5 rounded-full border border-white/20 hover:border-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
              <span className="text-sm font-medium">Back</span>
              <img 
                src={assets.arrow_icon} 
                alt="" 
                className="size-4 filter brightness-0 invert transform group-hover:translate-x-1 transition-transform" 
              />
            </div>
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md my-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
        
        <div className="relative bg-slate-800/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                {state === "Sign Up" ? (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                )}
              </div>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {state === "Sign Up" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-400 text-sm">
              {state === "Sign Up"
                ? "Sign up to get started with Auth"
                : "Login to access your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {state === "Sign Up" && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <img src={assets.person_icon} alt="" className="w-5 h-5 opacity-50" />
                  <input
                    onChange={handleName}
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    required
                    className="bg-transparent outline-none w-full text-white placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                <img src={assets.mail_icon} alt="" className="w-5 h-5 opacity-50" />
                <input
                  onChange={handleEmail}
                  type="email"
                  value={email}
                  placeholder="Email address"
                  required
                  className="bg-transparent outline-none w-full text-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-50" />
                <input
                  onChange={handlePassword}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Password"
                  required
                  className="bg-transparent outline-none w-full text-white placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {state === "Login" && (
              <p
                onClick={handleResetClick}
                className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer transition-colors text-right"
              >
                Forgot password?
              </p>
            )}

            <button
              type="submit"
              className="relative w-full py-3 px-4 cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <span className="relative flex items-center justify-center gap-2">
                {state === "Sign Up" ? "Sign Up" : "Login"}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="flex-shrink mx-4 text-sm text-slate-400">or continue with</span>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          <div className="space-y-3">
            {/* <div className="flex justify-center">
              <GoogleLogin
                shape="pill"
                size="large"
                text="continue_with"
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                theme="filled_blue"
              />
            </div> */}
            
            {/* <FacebookLogin
              appId={appid}
              onSuccess={handlefbSuccess}
              onFail={() => {
                toast.error("Login Failed");
              }}
              className="cursor-pointer flex items-center justify-center gap-2 w-full bg-[#1877f2] hover:bg-[#166fe5] text-white rounded-full py-3 px-4 font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            >
              <img src={assets.facebook} alt="" className="w-5 h-5" />
              Continue with Facebook
            </FacebookLogin> */}
          </div>

          {/* Toggle between login and signup */}
          <div className="mt-8 text-center">
            {state === "Sign Up" ? (
              <p className="text-slate-400">
                Already have an account?{" "}
                <button
                  onClick={handleLogin}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p className="text-slate-400">
                Don't have an account?{" "}
                <button
                  onClick={handleSignUp}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-700/50 text-xs text-slate-400">
            🔒 Secured with 256-bit encryption
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float-random"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Login;