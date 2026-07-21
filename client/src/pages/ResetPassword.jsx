import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/AppContext";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
 
const ResetPassword = () => {
  const { backendUrl } = useContext(Context);
 
  axios.defaults.withCredentials = true;
 
  const inputRefs = React.useRef([]);
 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  function handleLogoClick() {
    navigate("/");
  }
 
  function handleEmail(e) {
    setEmail(e.target.value);
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
  }
 
  function handleNewPassword(e) {
    setNewPassword(e.target.value);
  }
 
  function handleConfirmPassword(e) {
    setConfirmPassword(e.target.value);
  }
 
  async function onSubmitEmail(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/auth/send-reset-otp",
        { email },
        { timeout: 10000 } // 10 second timeout
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        toast.error("Email not sent: Connection timed out. Please try again later.");
      } else {
        toast.error(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  }
 
  async function onSubmitOtp(e) {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    const otpValue = otpArray.join("");
 
    if (otpValue.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }
 
    setOtp(otpValue);
    setIsOtpSubmited(true);
  }
 
  async function onSubmitNewPassword(e) {
    e.preventDefault();
 
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
 
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
 
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/login", {
          state: {
            state: "Login",
          },
        });
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
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-[#060A12] text-[#E7EDF7]">
      {/* faint structural grid — matches Home / Login */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,139,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,139,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      ></div>
 
      {/* single cool glow, one place, one accent — matches Home / Login */}
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
            onClick={() => navigate("/login")}
            className="relative group overflow-hidden rounded-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white group-hover:bg-transparent px-6 py-2.5 rounded-full border border-white/20 hover:border-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
              <span className="text-sm font-medium">Back to Login</span>
            </div>
          </button>
        </div>
      </div>
 
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
 
        <div className="relative bg-slate-800/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                <KeyRound className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>
 
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {!isEmailSent && "Reset Password"}
              {isEmailSent && !isOtpSubmited && "Verify OTP"}
              {isOtpSubmited && "New Password"}
            </h2>
            <p className="text-slate-400 text-sm">
              {!isEmailSent && "Enter your registered email to receive OTP"}
              {isEmailSent &&
                !isOtpSubmited &&
                "Enter the 6-digit code sent to your email"}
              {isOtpSubmited && "Create a strong new password for your account"}
            </p>
          </div>
 
          {!isEmailSent && (
            <form onSubmit={onSubmitEmail} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <Mail className="w-5 h-5 text-slate-400" strokeWidth={2} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmail}
                    required
                    className="bg-transparent outline-none w-full text-white placeholder-slate-400"
                  />
                </div>
              </div>
 
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 text-white" strokeWidth={2} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
 
          {isEmailSent && !isOtpSubmited && (
            <form onSubmit={onSubmitOtp} className="space-y-6">
              <div
                className="flex gap-2 justify-center items-center"
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
                      className="w-12 h-14 bg-slate-700/50 text-white text-center text-xl rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300"
                      ref={(e) => (inputRefs.current[index] = e)}
                      onInput={(e) => handleInput(e, index)}
                      onKeyDown={(e) => handleKeydown(e, index)}
                    />
                  ))}
              </div>
 
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={onSubmitEmail}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
 
              <button
                type="submit"
                className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Verify OTP
                  <ShieldCheck className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                </span>
              </button>
            </form>
          )}
 
          {isOtpSubmited && isEmailSent && (
            <form onSubmit={onSubmitNewPassword} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={handleNewPassword}
                    required
                    minLength="6"
                    className="bg-transparent outline-none w-full text-white placeholder-slate-400"
                  />
                </div>
              </div>
 
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <Lock className="w-5 h-5 text-slate-400" strokeWidth={2} />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={handleConfirmPassword}
                    required
                    minLength="6"
                    className="bg-transparent outline-none w-full text-white placeholder-slate-400"
                  />
                </div>
              </div>
 
              {newPassword && (
                <div className="px-2">
                  <div className="flex gap-1 h-1 mb-2">
                    <div
                      className={`flex-1 h-full rounded-full transition-all duration-300 ${
                        newPassword.length < 6
                          ? "bg-red-500"
                          : newPassword.length < 8
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                    <div
                      className={`flex-1 h-full rounded-full transition-all duration-300 ${
                        newPassword.length < 8 ? "bg-slate-600" : "bg-green-500"
                      }`}
                    ></div>
                    <div
                      className={`flex-1 h-full rounded-full transition-all duration-300 ${
                        /[!@#$%^&*]/.test(newPassword)
                          ? "bg-green-500"
                          : "bg-slate-600"
                      }`}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {newPassword.length < 6 && "Password is too weak"}
                    {newPassword.length >= 6 &&
                      newPassword.length < 8 &&
                      "Password is okay"}
                    {newPassword.length >= 8 &&
                      !/[!@#$%^&*]/.test(newPassword) &&
                      "Password is good"}
                    {newPassword.length >= 8 &&
                      /[!@#$%^&*]/.test(newPassword) &&
                      "Password is strong"}
                  </p>
                </div>
              )}
 
              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword}
                className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 text-white" strokeWidth={2} />
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}
 
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-700/50 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2} />
            Secured password reset
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ResetPassword;