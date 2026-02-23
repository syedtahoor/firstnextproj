"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f0fafc",
      overflowX: "hidden",
      maxWidth: "100vw",
    }}>
      <Sidebar />
      <div
        id="main-wrap"
        style={{
          flex: 1,
          marginLeft: "var(--sidebar-width, 260px)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: "margin-left 0.2s cubic-bezier(0.4,0,0.2,1)",
          willChange: "margin-left",
          minWidth: 0,
        }}
      >
        <Header />
        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}