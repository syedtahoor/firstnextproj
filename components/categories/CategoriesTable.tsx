"use client";
import {
  ChevronDown, ChevronUp, ArrowUpDown, SlidersHorizontal, Plus,
  ImageOff, Package, Wrench, Edit2, Trash2, Link2, MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BRAND = "#0a3d47";

interface Category {
  id: number;
  image?: string;
  name: string;
  sortNumber: number | null;
  type: "Product" | "Service";
  description?: string;
  parent?: string;
}

type SortKey = "name" | "sortNumber" | "type";

interface Props {
  visible: Category[];
  totalCount: number;
  selected: Set<number>;
  allSelected: boolean;
  someSelected: boolean;
  sortKey: SortKey;
  sortAsc: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: number) => void;
  onSort: (k: SortKey) => void;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) return <ArrowUpDown size={11} className="opacity-30" />;
  return asc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
}

function SortHead({ label, k, sortKey, sortAsc, onSort }: { label: string; k: SortKey; sortKey: SortKey; sortAsc: boolean; onSort: (k: SortKey) => void }) {
  return (
    <TableHead className="cursor-pointer select-none text-xs font-semibold text-gray-500 tracking-wide hover:text-gray-800" onClick={() => onSort(k)}>
      <span className="inline-flex items-center gap-1">{label} <SortIcon active={sortKey === k} asc={sortAsc} /></span>
    </TableHead>
  );
}

export default function CategoriesTable({
  visible, totalCount, selected, allSelected, someSelected,
  sortKey, sortAsc, onToggleAll, onToggleOne, onSort, onEdit, onDelete, onAdd,
}: Props) {
  return (
    <div className="pt-4">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-10 pl-4">
                <Checkbox checked={allSelected} data-indeterminate={someSelected} onCheckedChange={onToggleAll} className="border-gray-300" />
              </TableHead>
              <TableHead className="w-11" />
              <SortHead label="Name"      k="name"       sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
              <TableHead className="cursor-pointer select-none text-xs font-semibold text-gray-500 tracking-wide hover:text-gray-800 hidden sm:table-cell" onClick={() => onSort("sortNumber")}>
                <span className="inline-flex items-center gap-1">Sort <SortIcon active={sortKey === "sortNumber"} asc={sortAsc} /></span>
              </TableHead>
              <SortHead label="Type"      k="type"       sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
              <TableHead className="text-xs font-semibold text-gray-500 tracking-wide hidden md:table-cell">Description</TableHead>
              <TableHead className="w-28 text-xs font-semibold text-gray-500 tracking-wide">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visible.map(cat => (
              <TableRow
                key={cat.id}
                className="transition-colors group hover:bg-gray-50"
                style={selected.has(cat.id) ? { backgroundColor: "#0a3d4710" } : {}}
              >
                <TableCell className="pl-4 w-10">
                  <Checkbox checked={selected.has(cat.id)} onCheckedChange={() => onToggleOne(cat.id)} className="border-gray-300" />
                </TableCell>

                <TableCell className="px-2 w-11">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-9 h-9 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <ImageOff size={13} />
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="font-semibold text-gray-900 text-[13px]">{cat.name}</div>
                  {cat.parent && <div className="text-[11px] text-gray-400 mt-0.5">↳ {cat.parent}</div>}
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  {cat.sortNumber !== null
                    ? <span className="inline-flex items-center bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-500 tabular-nums">{cat.sortNumber}</span>
                    : <span className="text-gray-300">—</span>}
                </TableCell>

                <TableCell>
                  {cat.type === "Product"
                    ? <Badge className="gap-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 text-[11px] font-semibold px-2 py-0.5"><Package size={10} /> Product</Badge>
                    : <Badge className="gap-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 text-[11px] font-semibold px-2 py-0.5"><Wrench size={10} /> Service</Badge>}
                </TableCell>

                <TableCell className="hidden md:table-cell text-gray-500 max-w-[220px]">
                  <span className="line-clamp-1 text-[13px]">
                    {cat.description ?? <span className="text-gray-300 italic">No description</span>}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100" onClick={() => onEdit(cat)}>
                      <Edit2 size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(cat.id)}>
                      <Trash2 size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100">
                      <Link2 size={13} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100">
                          <MoreHorizontal size={13} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[150px]">
                        <DropdownMenuItem onClick={() => onEdit(cat)} className="gap-2 text-[12.5px]"><Edit2 size={13} /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-[12.5px]"><Link2 size={13} /> Copy Link</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDelete(cat.id)} className="gap-2 text-[12.5px] text-red-600 focus:text-red-600 focus:bg-red-50">
                          <Trash2 size={13} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="text-center py-16 text-gray-400">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                      <SlidersHorizontal size={20} />
                    </div>
                    <div className="font-semibold text-gray-600 text-sm">No categories found</div>
                    <div className="text-xs mt-1">Try adjusting your search or filters</div>
                    <Button size="sm" onClick={onAdd} className="mt-4 gap-1.5 text-xs text-white hover:opacity-90" style={{ backgroundColor: BRAND }}>
                      <Plus size={13} /> Add your first category
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {visible.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex-wrap gap-3">
            <span className="text-xs text-gray-400">
              {visible.length} of {totalCount} categor{totalCount !== 1 ? "ies" : "y"}
              {selected.size > 0 && ` · ${selected.size} selected`}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map(n => (
                <button key={n} className="w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-colors border"
                  style={n === 1
                    ? { backgroundColor: BRAND, borderColor: BRAND, color: "white" }
                    : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#6b7280" }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}