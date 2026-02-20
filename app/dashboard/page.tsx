import StatsCard from "@/components/dashboard/StatsCard";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import { CalendarDays, Plus } from "lucide-react";

const stats = [
  { title: "Total Users",     value: "24,521", change: "12.5%", positive: true,  icon: "Users",      color: "#1565c0", bgColor: "#38bdf8" },
  { title: "Revenue",         value: "₨4.2M",  change: "8.2%",  positive: true,  icon: "Banknote",   color: "#0a3d47", bgColor: "#0a3d47" },
  { title: "Active Projects", value: "142",    change: "3.1%",  positive: false, icon: "FolderOpen", color: "#b45309", bgColor: "#fbbf24" },
  { title: "Support Tickets", value: "38",     change: "5.4%",  positive: true,  icon: "Ticket",     color: "#6d28d9", bgColor: "#a78bfa" },
];

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#0a3d47", fontWeight: 500 }}>
            Welcome back 👋
          </p>
          <h1 style={{ margin: "3px 0 0", fontSize: "26px", fontWeight: 800, color: "#0a3d47", letterSpacing: "-0.5px" }}>
            Ali Khan&apos;s Dashboard
          </h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {stats.map((stat, i) => <StatsCard key={i} {...stat} />)}
      </div>

      {/* Middle Row */}
      <div className="mid-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <WeeklyChart />

        {/* Monthly Target */}
        <div style={{
          background: "linear-gradient(135deg, #0a3d47 0%, #061f27 100%)",
          borderRadius: "18px", padding: "24px", color: "white",
          position: "relative", overflow: "hidden",
          boxShadow: "0 6px 24px rgba(10,61,71,0.35)",
        }}>
          <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", left: "-20px", bottom: "-40px", width: "140px", height: "140px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <h2 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 18px", position: "relative" }}>Monthly Target</h2>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", opacity: 0.85 }}>
            <span>Sales Progress</span>
            <strong>78%</strong>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "99px", height: "8px", marginBottom: "20px" }}>
            <div style={{ width: "78%", height: "100%", borderRadius: "99px", background: "white" }} />
          </div>

          {[
            { label: "Revenue",   val: "₨3.3M / ₨4.2M" },
            { label: "New Users", val: "1,820 / 2,000"  },
            { label: "Projects",  val: "110 / 142"      },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: "12px", marginTop: "2px", fontSize: "13px",
            }}>
              <span style={{ opacity: 0.72 }}>{item.label}</span>
              <strong>{item.val}</strong>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}