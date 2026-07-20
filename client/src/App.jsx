import "./App.css";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Home from "./pages/Home";
import { assets } from "./assets/assets";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";

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

        if (error.response && error.response.status === 401) {
          // User is just not logged in. Stop loading immediately without retrying.
          setProgress(100);
          setTimeout(() => setLoading(false), 500);
          return;
        }

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
      <div className="relative min-h-screen overflow-hidden bg-[#060A12] text-[#E7EDF7]">
        {" "}
        {/* Grid background */}{" "}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(61,139,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,139,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        ></div>{" "}
        {/* Blue glow */}{" "}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[#3D8BFF]/10 blur-[120px] pointer-events-none"></div>{" "}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {" "}
          {/* Logo */}{" "}
          <div className="mb-8 group">
            {" "}
            <div className="relative">
              {" "}
              <div className="absolute inset-0 bg-[#3D8BFF]/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>{" "}
              <div className="relative w-28 h-28 bg-transparent p-4 rounded-2xl shadow-2xl flex items-center justify-center border border-white/[0.06] backdrop-blur-sm transform transition-all duration-500 group-hover:scale-110">
                {" "}
                <img src={assets.logo} alt="Logo" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Loading Card */}{" "}
          <div className="bg-[#0B1220]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/[0.06]">
            {" "}
            <div className="text-center mb-6">
              {" "}
              <h1 className="text-4xl font-bold mb-2">
                {" "}
                <span className="bg-gradient-to-r from-[#3D8BFF] to-[#22D3EE] bg-clip-text text-transparent">
                  {" "}
                  Auth 2.0{" "}
                </span>{" "}
              </h1>{" "}
              <div className="h-1 w-20 bg-gradient-to-r from-[#2563EB] to-[#22D3EE] mx-auto rounded-full"></div>{" "}
            </div>{" "}
            <h2 className="text-xl font-semibold text-[#E7EDF7] text-center mb-4">
              {" "}
              {progress < 100
                ? "Secure Authentication System"
                : "Welcome Back!"}{" "}
            </h2>{" "}
            <p className="text-[#7C8AA3] text-center mb-8 text-sm">
              {" "}
              {progress < 30 && "Initializing security protocols..."}{" "}
              {progress >= 30 &&
                progress < 60 &&
                "Establishing secure connection..."}{" "}
              {progress >= 60 && progress < 90 && "Verifying credentials..."}{" "}
              {progress >= 90 && "Almost ready..."}{" "}
            </p>{" "}
            {/* Progress Bar */}{" "}
            <div className="w-full bg-[#111827] rounded-full h-2 mb-8 overflow-hidden">
              {" "}
              <div
                className="bg-gradient-to-r from-[#2563EB] to-[#22D3EE] h-2 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {" "}
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>{" "}
              </div>{" "}
            </div>{" "}
            {/* Status Cards */}{" "}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {" "}
              <div className="bg-white/[0.03] rounded-lg p-3 text-center border border-white/[0.05]">
                {" "}
                <div className="flex justify-center mb-1">
                  {" "}
                  <div
                    className={`w-2 h-2 rounded-full ${progress > 30 ? "bg-[#22D3EE] animate-pulse" : "bg-[#475569]"}`}
                  ></div>{" "}
                </div>{" "}
                <span className="text-xs text-[#7C8AA3]">
                  {" "}
                  Encryption{" "}
                </span>{" "}
              </div>{" "}
              <div className="bg-white/[0.03] rounded-lg p-3 text-center border border-white/[0.05]">
                {" "}
                <div className="flex justify-center mb-1">
                  {" "}
                  <div
                    className={`w-2 h-2 rounded-full ${progress > 60 ? "bg-[#22D3EE] animate-pulse" : "bg-[#475569]"}`}
                  ></div>{" "}
                </div>{" "}
                <span className="text-xs text-[#7C8AA3]"> Firewall </span>{" "}
              </div>{" "}
              <div className="bg-white/[0.03] rounded-lg p-3 text-center border border-white/[0.05]">
                {" "}
                <div className="flex justify-center mb-1">
                  {" "}
                  <div
                    className={`w-2 h-2 rounded-full ${progress > 90 ? "bg-[#22D3EE] animate-pulse" : "bg-[#475569]"}`}
                  ></div>{" "}
                </div>{" "}
                <span className="text-xs text-[#7C8AA3]"> 2FA </span>{" "}
              </div>{" "}
            </div>{" "}
            {/* Loading Dots */}{" "}
            <div className="flex justify-center items-center space-x-3 mb-4">
              {" "}
              <div className="w-2 h-2 bg-[#3D8BFF] rounded-full animate-pulse [animation-delay:-0.3s]"></div>{" "}
              <div className="w-2 h-2 bg-[#4F8FFF] rounded-full animate-pulse [animation-delay:-0.15s]"></div>{" "}
              <div className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse"></div>{" "}
            </div>{" "}
            {attempts > 0 && (
              <div className="mt-4 p-3 bg-[#3D8BFF]/10 border border-[#3D8BFF]/20 rounded-lg">
                {" "}
                <p className="text-[#5EA8FF] text-xs text-center">
                  {" "}
                  Connection attempt {attempts + 1}/5{" "}
                </p>{" "}
              </div>
            )}{" "}
          </div>{" "}
          {/* Security Badge */}{" "}
          <div className="mt-8 flex items-center space-x-2 text-[#7C8AA3] text-sm">
            {" "}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              {" "}
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />{" "}
            </svg>{" "}
            <span>Secured with 256-bit encryption</span>{" "}
          </div>{" "}
        </div>{" "}
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
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName={() =>
          "bg-[#0B1220]/95 backdrop-blur-xl flex !px-4 !py-2 border border-white/[0.08] rounded-2xl text-[#E7EDF7] shadow-2xl shadow-black/40"
        }
        bodyClassName={() => "!m-0 !p-4 text-sm font-medium text-[#E7EDF7]"}
        progressClassName="bg-gradient-to-r from-[#2563EB] via-[#3D8BFF] to-[#22D3EE]"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />{" "}
      </Routes>
    </div>
  );
}

export default App;
