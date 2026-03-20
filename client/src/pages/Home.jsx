import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Context } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedin, userData, logout,backendUrl } = useContext(Context);

  const handleVerifyClick = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    await axios.post(backendUrl + "/auth/send-verify-otp", {
      withCredentials: true,
    });
    toast.success("Verification OTP sent to email! 🎉");
    navigate("/email-verify");
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
        <div className="absolute top-1/3 right-1/4 w-32 h-32 border border-yellow-500/10 rounded-full animate-pulse-slow"></div>
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex justify-between items-center p-4 sm:p-6 sm:px-24">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img
              onClick={() => navigate("/")}
              src={assets.logo}
              alt="logo"
              className="w-28 sm:w-32 relative z-10 transform transition-all duration-300 group-hover:scale-105 cursor-pointer"
            />
          </div>

          {isLoggedin ? (
            <div className="relative group/profile">
              <div className="relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-0 group-hover/profile:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white flex items-center justify-center font-semibold text-xl shadow-lg transform transition-all duration-300 group-hover/profile:scale-110 group-hover/profile:shadow-xl border-2 border-white/50">
                  {userData ? userData.name[0].toUpperCase() : "U"}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
              </div>

              {/* Dropdown menu */}
              <div className="absolute hidden group-hover/profile:block top-full right-0 z-50 pt-3 opacity-0 group-hover/profile:opacity-100 transition-all duration-300 transform origin-top-right scale-95 group-hover/profile:scale-100">
                <div className="bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden min-w-[240px]">
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50">
                    <p className="text-sm font-semibold text-white">
                      {userData?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>

                  <ul className="py-2">
                    {userData && !userData.isVerified && (
                      <li>
                        <button
                          onClick={handleVerifyClick}
                          className="w-full cursor-pointer px-4 py-2.5 text-sm text-left text-slate-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
                        >
                          <div className="relative">
                            <svg
                              className="w-4 h-4 text-yellow-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
                          </div>
                          <span className="flex-1">Verify Email</span>
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">
                            Required
                          </span>
                        </button>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full px-4 py-2.5 text-sm text-left text-slate-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
                      >
                        <svg
                          className="w-4 h-4 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="flex-1">My Profile</span>
                        <svg
                          className="w-4 h-4 text-slate-500 transform group-hover/item:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full px-4 py-2.5 text-sm text-left text-slate-200 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
                      >
                        <svg
                          className="w-4 h-4 text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="flex-1">Settings</span>
                      </button>
                    </li>

                    <li className="my-2 border-t border-slate-700/50"></li>

                    <li>
                      <button
                        onClick={()=>{
                          logout()
                          navigate("/login",{
                            state:{
                              state:"Login"
                            }
                          })
                        }}
                        className="w-full px-4 py-2.5 text-sm text-left text-red-400 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-orange-600/20 hover:text-red-300 transition-all duration-200 flex items-center gap-3 group/item"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="flex-1">Logout</span>
                        <svg
                          className="w-4 h-4 transform group-hover/item:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>

                  <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secured by Auth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <button
                  onClick={() => navigate("/login")}
                  className="relative group overflow-hidden rounded-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white group-hover:bg-transparent px-6 py-2.5 rounded-full border border-white/20 hover:border-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
                    <span className="text-sm font-medium">Login</span>

                    <img
                      src={assets.arrow_icon}
                      alt=""
                      className="size-4 filter brightness-0 invert transform group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
              <img
                src={assets.aibot}
                alt="AI Assistant"
                className="w-32 sm:w-40 mx-auto drop-shadow-2xl relative z-10 animate-float"
              />
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping animation-delay-500"></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hey{" "}
              {userData ? userData.name.trim().split(/\s+/)[0] : "Developer"}
              !{" "}
            </h1>
            <div className="relative">
              <img
                src={assets.hand_wave}
                alt="hand_wave"
                className="w-8 sm:w-10 aspect-square animate-wave origin-bottom"
              />
              <div className="absolute inset-0 animate-ping opacity-20">
                <img
                  src={assets.hand_wave}
                  alt=""
                  className="w-8 sm:w-10 aspect-square opacity-0"
                />
              </div>
            </div>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome To
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Auth
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let's start with quick product tour and we will have you up and
            running in no time!
          </p>

          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

            <button
              onClick={() => navigate("/login")}
              className="relative px-10 py-4 bg-white rounded-full text-lg font-semibold text-slate-800 shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 border border-slate-200 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                Get Started!
                <img src={assets.arrow_icon} alt="" />
              </span>

              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-16 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
          </div>

          <div className="mt-16 inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50">
            <img src={assets.lock_icon} alt="" />
            <span className="text-xs text-slate-400">
              Secured with 256-bit encryption
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden sm:block">
          <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-linear-to-b from-blue-500 to-purple-500 rounded-full mt-2 animate-scroll"></div>
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

      <div className="absolute top-0 left-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-500/10 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default Home;
