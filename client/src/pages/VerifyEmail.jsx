import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = React.useRef([]);

  useEffect(() => {
    isLoggedin && userData && userData.isVerified && navigate("/");
  }, [isLoggedin, userData]);

  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  function handleLogoClick() {
    navigate("/");
  }

  function handleInput(e, index) {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleKeydown(e, index) {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  function handlePaste(e) {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    // Auto focus on next empty input after paste
    const nextEmptyIndex = pasteArray.length;
    if (nextEmptyIndex < 6 && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex].focus();
    }
  }

  async function onSubmithandler(e) {
    try {
      e.preventDefault();
      setLoading(true);

      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      if (otp.length < 6) {
        toast.error("Please enter complete OTP");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(backendUrl + "/auth/verify-account", {
        otp,
      });
      
      if (data.success) {
        toast.success(data.message);
        await getUserData();
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    try {
      setLoading(true);
      const { data } = await axios.post(backendUrl + "/api/resend-verify-otp");
      
      if (data.success) {
        toast.success("New OTP sent to your email");
        setTimeLeft(60);
        setCanResend(false);
        
        // Clear OTP inputs
        inputRefs.current.forEach(input => {
          if (input) input.value = "";
        });
        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
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
              <span className="text-sm font-medium">Back to Home</span>
              <img 
                src={assets.arrow_icon} 
                alt="" 
                className="size-4 filter brightness-0 invert transform group-hover:translate-x-1 transition-transform" 
              />
            </div>
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
        
        <div className="relative bg-slate-800/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 animate-ping"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Verify Your Email
            </h2>
            <p className="text-slate-400 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-blue-400 font-medium mt-1">
              {userData?.email || "your email address"}
            </p>
          </div>

          <form onSubmit={onSubmithandler} className="space-y-6">
            <div 
              className="flex gap-2 sm:gap-3 justify-center items-center" 
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength="1"
                    key={index}
                    required
                    disabled={loading}
                    className="w-12 h-14 sm:w-14 sm:h-14 bg-slate-700/50 text-white text-center text-2xl font-semibold rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 disabled:opacity-50"
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeydown(e, index)}
                  />
                ))}
            </div>

            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={loading}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-slate-400">
                  Resend code in <span className="text-blue-400 font-medium">{timeLeft}s</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Email</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Didn't receive the email? Check your spam folder or{" "}
              <button 
                onClick={() => window.location.href = "mailto:support@auth.com"}
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                contact support
              </button>
            </p>
          </div>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-700/50 text-xs text-slate-400">
            🔒 2-Step Verification
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

export default VerifyEmail;