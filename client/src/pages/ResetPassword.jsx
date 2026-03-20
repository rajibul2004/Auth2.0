import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/AppContext";
import { toast } from "react-toastify";

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
      const { data } = await axios.post(backendUrl + "/auth/send-reset-otp", {
        email,
      });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
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
        navigate("/login",{
          state:{
            state:"Login"
          }
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
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-orb"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-orb animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

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
            onClick={() => navigate("/login")}
            className="relative group overflow-hidden rounded-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white group-hover:bg-transparent px-6 py-2.5 rounded-full border border-white/20 hover:border-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
              <span className="text-sm font-medium">Back to Login</span>
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <img
                    src={assets.mail_icon}
                    alt=""
                    className="w-5 h-5 opacity-50"
                  />
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
                className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
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
                className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Verify OTP
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              </button>
            </form>
          )}

          {isOtpSubmited && isEmailSent && (
            <form onSubmit={onSubmitNewPassword} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <img
                    src={assets.lock_icon}
                    alt=""
                    className="w-5 h-5 opacity-50"
                  />
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 w-full px-5 py-3 rounded-full bg-slate-700/50 border border-slate-600 focus-within:border-blue-500 transition-all duration-300">
                  <img
                    src={assets.lock_icon}
                    alt=""
                    className="w-5 h-5 opacity-50"
                  />
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
                className="relative w-full py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg overflow-hidden group hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm px-4 py-1 rounded-full border border-slate-700/50 text-xs text-slate-400">
            🔒 Secured password reset
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
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ResetPassword;
