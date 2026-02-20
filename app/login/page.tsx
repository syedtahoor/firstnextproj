"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      localStorage.setItem("adminUsername", username);
      localStorage.setItem("adminPass", password);

      setLoading(false);
      setSuccess(`Welcome back, ${username}! Redirecting...`);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }, 1800);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      <div
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden px-32 py-16"
        style={{ background: "#0a3d47" }}
      >
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)", top: "-180px", left: "-180px" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)", bottom: "-120px", right: "-120px" }} />
        <div className="absolute w-[200px] h-[200px] rounded-full opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)", top: "50%", left: "60%" }} />

        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-20px)", transition: "all 0.6s ease 0.1s" }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="3" rx="1.5" fill="white" />
                <rect x="4" y="10.5" width="11" height="3" rx="1.5" fill="white" />
                <rect x="4" y="17" width="7" height="3" rx="1.5" fill="white" />
              </svg>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">
              Flexa<span style={{ color: "rgba(255,255,255,0.55)" }}>marketplace</span>
            </span>
          </div>
        </div>

        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease 0.25s" }}>
          <h1 className="text-5xl font-bold text-white leading-tight mb-5">
            Your smart<br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>marketplace </span>
            awaits.
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", maxWidth: "400px" }}>
            Manage your products, track orders, and grow your business — all from one powerful dashboard.
          </p>

          <div className="flex gap-8 mt-10">
            {[
              { label: "Active Users", value: "1K+" },
              { label: "Products", value: "500" },
              { label: "Revenue", value: "$10K" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-white text-2xl font-bold">{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>
          © 2024 Flexemarketplace. All rights reserved.
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-8">
        <div
          className="w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(30px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s",
          }}
        >
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#0a3d47" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="3" rx="1.5" fill="white" />
                <rect x="4" y="10.5" width="11" height="3" rx="1.5" fill="white" />
                <rect x="4" y="17" width="7" height="3" rx="1.5" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-lg" style={{ color: "#0a3d47" }}>Flexemarketplace</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-1" style={{ color: "#0a3d47" }}>Sign in</h2>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Welcome back Admin! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a" }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: focused === "username" ? "#0a3d47" : "#9ca3af" }}>
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused(null)}
                placeholder="Enter your username"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#f9fafb",
                  border: `1.5px solid ${focused === "username" ? "#0a3d47" : "#e5e7eb"}`,
                  color: "#111827",
                  boxShadow: focused === "username" ? "0 0 0 3px rgba(10,61,71,0.08)" : "none",
                }}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium" style={{ color: "#374151" }}>Password</label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: focused === "password" ? "#0a3d47" : "#9ca3af" }}>
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Enter your password"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#f9fafb",
                  border: `1.5px solid ${focused === "password" ? "#0a3d47" : "#e5e7eb"}`,
                  color: "#111827",
                  boxShadow: focused === "password" ? "0 0 0 3px rgba(10,61,71,0.08)" : "none",
                }}
              />
              <button onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "#9ca3af" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a3d47")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                {showPass ? (
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 mt-3">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: "#0a3d47" }} />
            <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: "#6b7280" }}>
              Remember me for 30 days
            </label>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all relative overflow-hidden"
            style={{
              background: loading ? "#4a8a96" : "#0a3d47",
              boxShadow: loading ? "none" : "0 4px 20px rgba(10,61,71,0.35)",
              transform: loading ? "scale(0.98)" : "scale(1)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0c4a56"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#0a3d47"; }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}