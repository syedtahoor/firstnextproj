"use client";
import { useState } from "react";
import { Search, Bell, Moon, User, AlertTriangle, FileText } from "lucide-react";

const notifications = [
  { text: "New user registered", time: "2 min ago", icon: <User size={15} />, unread: true },
  { text: "Server usage at 85%", time: "15 min ago", icon: <AlertTriangle size={15} />, unread: false },
  { text: "Monthly report ready", time: "1 hour ago", icon: <FileText size={15} />, unread: false },
];

export default function Header() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #c8e6ea",
        padding: "0 16px 0 64px",  // ← 64px left padding — hamburger ke liye space
        height: "64px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "12px",
      }}
    >

      {/* Search */}
      <div className="search-box">
        <Search
          size={15}
          color="#0a3d47"
          strokeWidth={2}
          style={{ flexShrink: 0 }}
        />
        <input
          type="text"
          placeholder="Search anything..."
          className="search-input"
        />

        <style jsx>{`
    .search-box {
      display: flex;
      align-items: center;
      background: #f2f9fa;
      border: 1.5px solid #b2dde3;
      border-radius: 5px;
      padding: 10px 14px;
      gap: 8px;
      flex: 1;
      max-width: 380px;
    }

    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 13.5px;
      color: #0a3d47;
      width: 100%;
    }

    /* Desktop Only */
    @media (min-width: 1024px) {
      .search-box {
        margin-left: -50px;
      }
    }
  `}</style>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              background: notifOpen ? "#e4f3f6" : "#f2f9fa",
              border: "1.5px solid #b2dde3", borderRadius: "30px",
              width: "40px", height: "40px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", color: "#0a3d47",
            }}
          >
            <Bell size={17} strokeWidth={2} />
            <span style={{
              position: "absolute", top: "7px", right: "7px",
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#f43f5e", border: "2px solid white",
            }} />
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", right: 0, top: "50px",
              width: "290px", background: "white",
              borderRadius: "14px", border: "1.5px solid #c8e6ea",
              boxShadow: "0 16px 40px rgba(10,61,71,0.13)",
              padding: "12px", zIndex: 200,
            }}>
              <p style={{ fontWeight: 700, fontSize: "13px", color: "#0a3d47", margin: "0 4px 10px" }}>
                Notifications
              </p>
              {notifications.map((n, i) => (
                <div key={i} style={{
                  display: "flex", gap: "10px", padding: "9px",
                  borderRadius: "9px", cursor: "pointer",
                  background: n.unread ? "#f2f9fa" : "transparent",
                  alignItems: "flex-start",
                }}>
                  <span style={{
                    width: "30px", height: "30px", borderRadius: "8px",
                    background: "#e4f3f6", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: "#0a3d47", flexShrink: 0,
                  }}>
                    {n.icon}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: "12.5px", color: "#0a3d47", fontWeight: 500 }}>{n.text}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#4a8a96", marginTop: "2px" }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{
          width: "40px", height: "40px", borderRadius: "30px",
          background: "linear-gradient(135deg, #0a3d47, #082f38)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 700, color: "white", cursor: "pointer",
          boxShadow: "0 3px 10px rgba(10,61,71,0.30)",
        }}>
          AK
        </div>
      </div>
    </header>
  );
}