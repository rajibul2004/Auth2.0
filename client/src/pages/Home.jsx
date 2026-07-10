import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Context } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Hand,
  MailCheck,
  User,
  Settings,
  LogOut,
} from "lucide-react";
 
const Home = () => {
  const navigate = useNavigate();
  const { isLoggedin, userData, logout, backendUrl } = useContext(Context);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
 
  const handleVerifyClick = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    const data=await axios.post(backendUrl + "/auth/send-verify-otp", {
      withCredentials: true,
    });
    console.log(data)
    if(!data.data.success){
      toast.error("Failed to send verification OTP");
      setLoading(false);
    } else {
      toast.success("Verification OTP sent to email! 🎉");
      setLoading(false);
      navigate("/email-verify");
    }
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const firstName = userData?.name?.trim()?.split(/\s+/)?.[0] || "Developer";
  const initial = userData?.name?.[0]?.toUpperCase() || "?";
  const avatarGlow =
    "absolute -inset-1 rounded-full bg-[#3D8BFF]/40 blur-md opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300";
 
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060A12] text-[#E7EDF7] font-[Inter,ui-sans-serif,system-ui]">
      {/* ---- scoped design system (palette / motion) ---- */}
      <style>{`
        @keyframes dial-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dial-rotate-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes orbit-a { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit-b { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes scanline { 0% { transform: translateY(-100%); opacity: 0; } 10% { opacity: .7; } 90% { opacity: .7; } 100% { transform: translateY(100%); opacity: 0; } }
        @keyframes wave-hand { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(14deg); } 75% { transform: rotate(-8deg); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes draw-lock { to { stroke-dashoffset: 0; } }
        @keyframes pop-check { 0% { opacity: 0; transform: scale(0.5); } 60% { opacity: 1; transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes core-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(61,139,255,0.35); } 50% { box-shadow: 0 0 0 14px rgba(61,139,255,0); } }
 
        .vault-dial-slow { animation: dial-rotate 60s linear infinite; }
        .vault-dial-slow-rev { animation: dial-rotate-rev 90s linear infinite; }
        .orbit-a { animation: orbit-a 9s linear infinite; }
        .orbit-b { animation: orbit-b 13s linear infinite; }
        .wave-hand { animation: wave-hand 2.2s ease-in-out infinite; transform-origin: 70% 70%; display: inline-block; }
        .fade-in-up { animation: fade-in-up .7s ease-out both; }
        .core-pulse { animation: core-pulse 2.8s ease-in-out infinite; }
        .lock-path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw-lock 1.1s ease-out .3s forwards; }
        .lock-check { opacity: 0; animation: pop-check .5s ease-out 1.3s forwards; }
 
        @media (prefers-reduced-motion: reduce) {
          .vault-dial-slow, .vault-dial-slow-rev, .orbit-a, .orbit-b, .wave-hand, .fade-in-up, .core-pulse, .lock-path, .lock-check { animation: none; }
          .lock-path { stroke-dashoffset: 0; }
          .lock-check { opacity: 1; }
        }
      `}</style>
 
      {/* faint structural grid — restrained, no blobs */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,139,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(61,139,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      ></div>
 
      {/* single cool glow, one place, one accent */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-[#3D8BFF]/10 blur-[120px] pointer-events-none"></div>
 
      {/* ============ NAV ============ */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-16 py-5 border-b border-white/[0.06]">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={assets.logo}
            alt="logo"
            className="w-28 sm:w-32 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
 
        {isLoggedin ? (
          <div className="relative group/profile" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="relative flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className={avatarGlow}></div>
                <div className="relative w-11 h-11 rounded-full bg-[#0E1626] border border-[#3D8BFF]/50 text-[#5EA8FF] flex items-center justify-center font-semibold text-lg overflow-hidden">
                  {userData?.profilePic ? (
                    <img
                      src={userData.profilePic}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    initial
                  )}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#060A12] ${
                    userData?.isVerified ? "bg-[#22D3EE]" : "bg-[#F5A65B]"
                  }`}
                ></span>
              </div>
            </button>
 
            {/* access-card style dropdown */}
            <div
              className={`absolute top-full right-0 z-50 pt-3 origin-top-right transition-all duration-200 ${
                showMenu
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="w-[260px] rounded-lg bg-[#0B1220] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#2563EB] via-[#3D8BFF] to-[#22D3EE]"></div>
 
                <div className="px-4 py-4 border-b border-white/[0.06]">
                  <p className="text-[10px] tracking-[0.2em] text-[#7C8AA3] uppercase mb-1">
                    Access Card
                  </p>
                  <p className="text-sm font-semibold text-[#E7EDF7]">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-[#7C8AA3] font-mono truncate mt-0.5">
                    {userData?.email || "user@example.com"}
                  </p>
                  <span
                    className={`inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      userData?.isVerified
                        ? "text-[#22D3EE] border-[#22D3EE]/40 bg-[#22D3EE]/10"
                        : "text-[#F5A65B] border-[#F5A65B]/40 bg-[#F5A65B]/10"
                    }`}
                  >
                    {userData?.isVerified ? "VERIFIED" : "UNVERIFIED"}
                  </span>
                </div>
 
                <ul className="py-1.5">
                  {userData && !userData.isVerified && (
                    <li>
                      <button
                        onClick={handleVerifyClick}
                        disabled={loading}
                        className={`${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white/[0.04] cursor-pointer"} w-full px-4 py-2.5 text-sm text-left text-[#E7EDF7] transition-colors flex items-center gap-3`}
                      >
                        <MailCheck className="w-4 h-4 text-[#3D8BFF]" strokeWidth={2} />
                        <span className="flex-1">Verify Email</span>
                        <span className="text-[10px] font-mono text-[#3D8BFF]">REQUIRED</span>
                      </button>
                    </li>
                  )}
 
                  <li>
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full px-4 py-2.5 text-sm text-left text-[#E7EDF7] hover:bg-white/[0.04] transition-colors flex items-center gap-3"
                    >
                      <User className="w-4 h-4 text-[#7C8AA3]" strokeWidth={2} />
                      <span className="flex-1">My Profile</span>
                    </button>
                  </li>
 
                  <li>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full px-4 py-2.5 text-sm text-left text-[#E7EDF7] hover:bg-white/[0.04] transition-colors flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4 text-[#7C8AA3]" strokeWidth={2} />
                      <span className="flex-1">Settings</span>
                    </button>
                  </li>
 
                  <li className="my-1.5 border-t border-white/[0.06]"></li>
 
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login", { state: { state: "Login" } });
                      }}
                      className="w-full px-4 py-2.5 text-sm text-left text-[#E3897A] hover:bg-[#E3897A]/[0.08] transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2} />
                      <span className="flex-1">Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#3D8BFF]/40 text-[#E7EDF7] text-sm font-medium hover:bg-[#3D8BFF]/10 hover:border-[#3D8BFF] transition-all duration-300"
          >
            Login
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </button>
        )}
      </header>
 
      {/* ============ HERO ============ */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-16 min-h-[calc(100vh-90px)]">
        <div className="max-w-3xl mx-auto text-center fade-in-up">
          {/* signature element: authentication core — dial + self-drawing lock + orbiting tokens */}
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full border border-[#3D8BFF]/20 vault-dial-slow">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="absolute left-1/2 top-0 w-px h-3 bg-[#3D8BFF]/40"
                  style={{ transform: `rotate(${i * 30}deg) translateX(-0.5px)`, transformOrigin: "0 104px" }}
                ></span>
              ))}
            </div>
            <div className="absolute inset-4 rounded-full border border-[#22D3EE]/15 vault-dial-slow-rev"></div>
 
            {/* orbiting session tokens */}
            <div className="absolute inset-6 orbit-a pointer-events-none">
              <span className="absolute left-1/2 top-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3D8BFF] shadow-[0_0_8px_2px_rgba(61,139,255,0.6)]"></span>
            </div>
            <div className="absolute inset-10 orbit-b pointer-events-none">
              <span className="absolute left-1/2 bottom-0 w-1.5 h-1.5 translate-x-1/2 translate-y-1/2 rounded-full bg-[#22D3EE] shadow-[0_0_6px_2px_rgba(34,211,238,0.6)]"></span>
            </div>
 
            <div className="absolute inset-8 rounded-full bg-[#0B1220] border border-white/[0.06] flex items-center justify-center overflow-hidden core-pulse">
              <svg
                viewBox="0 0 24 24"
                className="w-14 sm:w-20"
                fill="none"
              >
                <rect
                  x="5.5" y="10.5" width="13" height="9.5" rx="1.8"
                  stroke="#5EA8FF" strokeWidth="1.4" pathLength="1"
                  className="lock-path"
                />
                <path
                  d="M8 10.5V7.2a4 4 0 0 1 8 0V10.5"
                  stroke="#5EA8FF" strokeWidth="1.4" strokeLinecap="round"
                  pathLength="1" className="lock-path"
                  style={{ animationDelay: ".55s" }}
                />
                <path
                  d="M9.3 15.4 L11.4 17.5 L15 13.4"
                  stroke="#22D3EE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  className="lock-check"
                />
              </svg>
              <span
                className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-[#3D8BFF]/15 to-transparent"
                style={{ animation: "scanline 3.5s ease-in-out infinite" }}
              ></span>
            </div>
          </div>
 
          <p className="text-[11px] sm:text-xs tracking-[0.35em] text-[#7C8AA3] uppercase mb-3 font-mono">
            Session Secure
          </p>
 
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-xl sm:text-2xl font-medium text-[#7C8AA3]">
              Hey {firstName}
            </h1>
            <Hand
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5A65B] wave-hand"
              strokeWidth={2}
              fill="#F5A65B"
              fillOpacity={0.15}
            />
          </div>
 
          <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-6">
            <span className="text-[#E7EDF7]">Welcome to</span>
            <br />
            <span className="bg-gradient-to-r from-[#3D8BFF] to-[#22D3EE] bg-clip-text text-transparent">
              Auth 2.0
            </span>
          </h2>
 
          <p className="text-base sm:text-lg text-[#7C8AA3] max-w-xl mx-auto mb-10 leading-relaxed">
            A quick tour of your account, then you're through the door —
            fully authenticated and ready to go.
          </p>
 
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate("/login")}
              className="group relative px-9 py-3.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3D8BFF] text-[#F7FAFF] text-base font-semibold shadow-lg shadow-[#3D8BFF]/20 hover:shadow-xl hover:shadow-[#3D8BFF]/30 transform transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </span>
            </button>
          </div>
 
          {/* trust chips — specific, not generic */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-mono text-[#7C8AA3]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D8BFF]"></span>
              OAuth 2.0 compliant
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"></span>
              Rotating refresh tokens
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8DEF]"></span>
              Round-the-clock monitoring
            </div>
          </div>
        </div>
 
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-60">
          <div className="w-5 h-8 border border-[#3D8BFF]/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-[#3D8BFF] rounded-full"></div>
          </div>
        </div>
      </main>
 
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#060A12] to-transparent pointer-events-none"></div>
    </div>
  );
};
 
export default Home;