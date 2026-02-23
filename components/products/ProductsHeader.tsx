"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "Active" | "Draft" | "Inactive";

interface Props {
  stats: { total: number; active: number; draft: number; inactive: number };
  statusFilter: "All" | Status;
  onStatusFilter: (s: "All" | Status) => void;
  onAdd: () => void;
}

export default function ProductsHeader({ stats, statusFilter, onStatusFilter, onAdd }: Props) {
  const tabs = [
    { key: "All",      n: stats.total,    dot: "bg-gray-400"    },
    { key: "Active",   n: stats.active,   dot: "bg-emerald-500" },
    { key: "Draft",    n: stats.draft,    dot: "bg-amber-400"   },
    { key: "Inactive", n: stats.inactive, dot: "bg-gray-300"    },
  ] as const;

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 pt-4 md:pt-6 pb-0">
      <div className="flex items-start justify-between gap-3 mb-4 md:mb-5">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#0a3d47" }}>Catalogue</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Manage all products listed on your website</p>
        </div>
        <Button
          onClick={onAdd}
          size="sm"
          className="mt-1 text-white hover:opacity-90 flex-shrink-0"
          style={{ backgroundColor: "#0a3d47" }}
        >
          <Plus className="h-4 w-4 md:mr-1" />
          <span className="hidden sm:inline">Add Product</span>
        </Button>
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-0.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tabs.map(s => (
          <button
            key={s.key}
            onClick={() => onStatusFilter(s.key)}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 relative bottom-[-1px] transition-colors whitespace-nowrap flex-shrink-0
              ${statusFilter === s.key
                ? "bg-gray-50 border-gray-200 text-gray-900"
                : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
            {s.key}
            <span className="font-bold text-gray-700">{s.n}</span>
          </button>
        ))}
      </div>
    </div>
  );
}