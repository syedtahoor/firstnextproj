"use client";
import { Search, X, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TypeFilter = "All" | "Product" | "Service";
const BRAND = "#0a3d47";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  typeFilter: TypeFilter;
  onTypeFilter: (v: TypeFilter) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onAdd: () => void;
}

export default function CategoriesHeader({
  search, onSearch, typeFilter, onTypeFilter,
  selectedCount, onBulkDelete, onClearSelection, onAdd,
}: Props) {
  return (
    <>
      {/* Page Title */}
      <div className="px-4 pt-5 pb-4 sm:px-7 sm:pt-7 sm:pb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Categories</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Manage all categories listed on your website</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 flex items-center gap-2 flex-wrap rounded-b-md">
        {/* Search — full width on mobile, fixed on desktop */}
        <div className="relative w-full sm:w-60 order-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            className="pl-8 pr-8 h-8 text-[13px] w-full"
            placeholder="Search categories…"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => onSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden order-2">
          {(["All", "Product", "Service"] as TypeFilter[]).map(v => (
            <button
              key={v}
              onClick={() => onTypeFilter(v)}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium border-r border-gray-300 last:border-r-0 transition-colors"
              style={typeFilter === v
                ? { backgroundColor: BRAND, color: "white" }
                : { backgroundColor: "white", color: "#6b7280" }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Spacer — only on desktop */}
        <div className="hidden sm:flex flex-1 order-3" />

        {/* Bulk delete */}
        {selectedCount > 0 && (
          <Button size="sm" variant="destructive" onClick={onBulkDelete} className="h-8 text-xs gap-1.5 order-4">
            <Trash2 size={13} />
            <span className="hidden xs:inline">Delete</span> {selectedCount}
          </Button>
        )}

        {/* Add button */}
        <Button
          size="sm"
          onClick={onAdd}
          className="h-8 text-xs gap-1.5 text-white hover:opacity-90 order-5 ml-auto sm:ml-0"
          style={{ backgroundColor: BRAND }}
        >
          <Plus size={13} />
          <span className="hidden xs:inline sm:inline">Add Category</span>
          <span className="xs:hidden sm:hidden">Add</span>
        </Button>
      </div>

      {/* Selection banner */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2.5 px-4 sm:px-6 py-2 bg-amber-50 border-b border-amber-200 text-xs font-medium text-amber-800">
          <Check size={13} />
          <span>{selectedCount} row{selectedCount > 1 ? "s" : ""} selected</span>
          <button onClick={onClearSelection} className="ml-auto text-xs font-medium hover:underline">Clear</button>
        </div>
      )}
    </>
  );
}