"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.15s ease, transform 0.15s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, [pathname]);

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
        <main
          ref={mainRef}
          style={{ flex: 1, padding: "24px", overflowY: "auto" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}