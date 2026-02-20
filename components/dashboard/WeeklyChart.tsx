"use client";

const data = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 72 },
  { day: "Sat", value: 40 },
  { day: "Sun", value: 58 },
];

export default function WeeklyChart() {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1.5px solid #c8e6ea", boxShadow: "0 2px 12px rgba(10,61,71,0.07)", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0a3d47" }}>Weekly Overview</h2>
          <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#4a8a96" }}>This week&apos;s performance</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #0a3d47, #082f38)", borderRadius: "10px", padding: "6px 14px", fontSize: "12.5px", fontWeight: 600, color: "white" }}>
          +12.5% ↑
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "130px" }}>
        {data.map((item) => {
          const height = (item.value / max) * 100;
          const isPeak = item.value === max;
          return (
            <div key={item.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", height: "100%", justifyContent: "flex-end" }}>
              <div
                style={{
                  width: "100%", height: `${height}%`,
                  borderRadius: "6px 6px 3px 3px", minHeight: "16px",
                  background: isPeak
                    ? "linear-gradient(180deg, #0a3d47, #061f27)"
                    : "linear-gradient(180deg, #c8e6ea, #e8f5f7)",
                  border: isPeak ? "none" : "1.5px solid #c8e6ea",
                  cursor: "pointer", transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0.75")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
              />
              <span style={{ fontSize: "11px", fontWeight: isPeak ? 700 : 400, color: isPeak ? "#0a3d47" : "#94a3b8" }}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}