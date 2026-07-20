import React, { useContext, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import {
  User,
  UserPlus,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  // Facebook,
  ShieldCheck,
} from "lucide-react";

const appid = import.meta.env.VITE_FB_APP_ID;
const Login = () => {
  const location = useLocation();
  const [state, setState] = useState(location.state || "Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

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
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;
      setLoading(true);

      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/auth/register",
          { name, email, password },
          { withCredentials: true },
        );

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();
          toast.success("Account created successfully! 🎉");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/auth/login",
          { email, password },
          { withCredentials: true },
        );

        if (data.success) {
          setIsLoggedin(true);
          await getUserData();
          toast.success("Welcome back! 👋");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        const appToken = tokenResponse?.access_token;

        if (!appToken) {
          throw new Error("Missing access token");
        }

        const { data } = await axios.post(
          `${backendUrl}/auth/google`,
          { appToken },
          { withCredentials: true },
        );

        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const handlefbSuccess = async (response) => {
    try {
      setLoading(true);

      const accessToken = response.accessToken;

      const { data } = await axios.post(
        `${backendUrl}/auth/facebook`,
        { accessToken },
        { withCredentials: true },
      );

      if (data.success) {
        toast.success(data.message);
        setIsLoggedin(true);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Facebook login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-[#060A12] text-[#E7EDF7]">
      {/* faint structural grid — matches Home */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,139,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,139,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      ></div>

      {/* single cool glow, one place, one accent — matches Home */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[#3D8BFF]/10 blur-[120px] pointer-events-none"></div>

      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex justify-between items-center p-4 sm:p-6 sm:px-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white group-hover:bg-transparent px-6 py-2.5 rounded-full border border-white/20 hover:border-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </div>
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg my-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

        <div className="relative bg-slate-800/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                {state === "Sign Up" ? (
                  <UserPlus className="w-8 h-8 text-white" strokeWidth={2} />
                ) : (
                  <LogIn className="w-8 h-8 text-white" strokeWidth={2} />
                )}
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <User className="w-5 h-5 text-slate-400" strokeWidth={2} />
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                <Mail className="w-5 h-5 text-slate-400" strokeWidth={2} />
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
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
                    <EyeOff className="w-5 h-5" strokeWidth={2} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2} />
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
              disabled={loading}
              className={`${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"} relative w-full py-3 px-4 cursor-pointer rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02]`}
            >
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <span className="relative flex items-center justify-center gap-2">
                {state === "Sign Up" ? "Sign Up" : "Login"}
                <ArrowRight
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  strokeWidth={2}
                />
              </span>
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="flex-shrink mx-4 text-sm text-slate-400">
              or continue with
            </span>
            <div className="grow h-px bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3 justify-center items-center">
            {/* Custom Google Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => googleLogin()}
              className="
      group flex items-center justify-center gap-3
      w-full sm:w-[260px]
      px-6 py-3
      rounded-full
      bg-[#0B1220]
      border border-white/[0.08]
      text-[#E7EDF7]
      hover:border-[#3D8BFF]/50
      hover:bg-[#111827]
      hover:shadow-lg hover:shadow-[#3D8BFF]/10
      transition-all duration-300
      hover:-translate-y-0.5
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-7 h-7"
              />
              <span className="font-medium">
                {loading ? "Please wait..." : "Continue with Google"}
              </span>
            </button>

            {/* Facebook */}
            <FacebookLogin
              appId={appid}
              onSuccess={handlefbSuccess}
              onFail={() => toast.error("Login Failed")}
              render={({ onClick }) => (
                <button
                  type="button"
                  disabled={loading}
                  onClick={onClick}
                  className="
          group flex items-center justify-center gap-3
          w-full sm:w-[260px]
          px-6 py-3
          rounded-full
          bg-[#0B1220]
          border border-white/[0.08]
          text-[#E7EDF7]
          hover:border-[#1877F2]/50
          hover:bg-[#111827]
          hover:shadow-lg hover:shadow-[#1877F2]/10
          transition-all duration-300
          hover:-translate-y-0.5
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
                >
                  <img
                    src="https://www.svgrepo.com/show/452196/facebook-1.svg"
                    alt="Facebook"
                    className="w-7 h-7"
                  />

                  <span className="font-medium">
                    {loading ? "Please wait..." : "Continue with Facebook"}
                  </span>
                </button>
              )}
            />
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

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-700/50 text-xs text-slate-400">
            <ShieldCheck
              className="w-3.5 h-3.5 text-cyan-400"
              strokeWidth={2}
            />
            Secured with 256-bit encryption
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
