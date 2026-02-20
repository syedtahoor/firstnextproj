"use client";

import { TrendingUp, TrendingDown, Users, Banknote, FolderOpen, Ticket, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  Banknote,
  FolderOpen,
  Ticket,
};

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  color: string;
  bgColor: string;
}

export default function StatsCard({ title, value, change, positive, icon, color, bgColor }: StatsCardProps) {
  const Icon = iconMap[icon];

  return (
    <div
      style={{
        background: "white", borderRadius: "16px",
        padding: "20px", border: "1.5px solid #c8e6ea",
        boxShadow: "0 2px 12px rgba(10,61,71,0.07)",
        position: "relative", overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 28px rgba(10,61,71,0.13)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(10,61,71,0.07)";
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: "absolute", right: "-16px", top: "-16px",
        width: "80px", height: "80px", borderRadius: "50%",
        background: bgColor, opacity: 0.12,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        {/* Icon box */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: color, display: "flex",
          alignItems: "center", justifyContent: "center",
        }}>
          {Icon && <Icon size={20} color="white" strokeWidth={2} />}
        </div>

        {/* Change badge */}
        <span style={{
          background: positive ? "#dcfce7" : "#fee2e2",
          color: positive ? "#16a34a" : "#dc2626",
          fontSize: "11.5px", fontWeight: 600,
          padding: "3px 9px", borderRadius: "99px",
          display: "flex", alignItems: "center", gap: "3px",
        }}>
          {positive
            ? <TrendingUp size={11} strokeWidth={2.5} />
            : <TrendingDown size={11} strokeWidth={2.5} />
          }
          {change}
        </span>
      </div>

      <p style={{ fontSize: "27px", fontWeight: 800, color: "#0a3d47", letterSpacing: "-0.8px", margin: "0 0 3px" }}>
        {value}
      </p>
      <p style={{ fontSize: "12.5px", color: "#4a8a96", fontWeight: 500, margin: 0 }}>
        {title}
      </p>
    </div>
  );
}