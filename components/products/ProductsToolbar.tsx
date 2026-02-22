"use client";
import { Search, X, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export default function ProductsToolbar({ search, onSearch, selectedCount, onBulkDelete, onClearSelection }: Props) {
  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            className="pl-9 w-64 h-9 text-sm focus-visible:ring-0"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => onSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex-1" />
        {selectedCount > 0 && (
          <Button variant="destructive" size="sm" onClick={onBulkDelete}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete {selectedCount}
          </Button>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="border-b px-6 py-2 flex items-center gap-2 text-xs font-semibold"
          style={{ backgroundColor: "#0a3d4712", borderColor: "#0a3d4730", color: "#0a3d47" }}>
          <Check className="h-3.5 w-3.5" />
          {selectedCount} product{selectedCount > 1 ? "s" : ""} selected
          <button onClick={onClearSelection} className="ml-auto hover:underline" style={{ color: "#0a3d47" }}>Clear</button>
        </div>
      )}
    </>
  );
}