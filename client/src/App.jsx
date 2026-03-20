import "./App.css";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Home from "./pages/Home";
import { assets } from "./assets/assets";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from './pages/ResetPassword'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    const fetchData = async () => {
      if (attempts >= 5) {
        console.log("Max retries reached");
        setLoading(false);
        return;
      }

      try {
        interval = setInterval(() => {
          setProgress((prev) => (prev >= 90 ? prev : prev + 10));
        }, 1000);

        await axios.get(`${backendUrl}/health`, { withCredentials: true });

        const response = await axios.get(`${backendUrl}/auth/me`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setData(response.data.userData);
        }

        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        clearInterval(interval);

        console.log("Retrying...", attempts + 1);

        setAttempts((prev) => prev + 1);
        setProgress((prev) => Math.min(prev + 5, 95));

        setTimeout(fetchData, 5000);
      }
    };

    fetchData();

    return () => clearInterval(interval);
  }, [attempts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-orb"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-orb animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        </div>

        {/* Floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 border-2 border-blue-500/20 rounded-lg rotate-45 animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute top-40 right-20 w-16 h-16 border-2 border-indigo-500/20 rounded-full animate-spin-slow"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <div className="mb-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-200 to-purple-200 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative w-28 h-28  bg-transparent p-4 rounded-2xl shadow-2xl flex items-center justify-center border backdrop-blur-sm transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <img src={assets.logo} alt="" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700/50 transform transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Auth
                </span>
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>

            <h2 className="text-xl font-semibold text-white/90 text-center mb-4">
              {progress < 100
                ? "Secure Authentication System"
                : "Welcome Back!"}
            </h2>

            <p className="text-slate-400 text-center mb-8 text-sm">
              {progress < 30 && "Initializing security protocols..."}
              {progress >= 30 &&
                progress < 60 &&
                "Establishing secure connection..."}
              {progress >= 60 && progress < 90 && "Verifying credentials..."}
              {progress >= 90 && "Almost ready..."}
            </p>

            <div className="w-full bg-slate-700/50 rounded-full h-2 mb-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${progress > 30 ? "bg-green-500 animate-pulse" : "bg-slate-500"}`}
                  ></div>
                </div>
                <span className="text-xs text-slate-400">Encryption</span>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${progress > 60 ? "bg-green-500 animate-pulse" : "bg-slate-500"}`}
                  ></div>
                </div>
                <span className="text-xs text-slate-400">Firewall</span>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${progress > 90 ? "bg-green-500 animate-pulse" : "bg-slate-500"}`}
                  ></div>
                </div>
                <span className="text-xs text-slate-400">2FA</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            </div>

            {attempts > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-xs text-center flex items-center justify-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Connection attempt {attempts + 1}/5
                </p>
              </div>
            )}
          </div>

          {/* Security badge */}
          <div className="mt-8 flex items-center space-x-2 text-slate-500 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-slate-800 text-white border border-slate-700"
        progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword/>} />      </Routes>
    </div>
  );
}

export default App;
