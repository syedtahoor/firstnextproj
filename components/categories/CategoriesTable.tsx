"use client";
import {
  ChevronDown, ChevronUp, ArrowUpDown, Plus,
  ImageOff, Package, Wrench, Edit2, Trash2, SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";

const BRAND = "#0a3d47";

interface Category {
  id: number; image?: string; name: string;
  sortNumber: number | null; type: "Product" | "Service";
  description?: string; parent?: string;
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
  onOpenAttributes: (c: Category) => void;
}

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) return <ArrowUpDown size={11} className="opacity-30" />;
  return asc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
}

function SortHead({ label, k, sortKey, sortAsc, onSort }: {
  label: string; k: SortKey; sortKey: SortKey; sortAsc: boolean; onSort: (k: SortKey) => void;
}) {
  return (
    <TableHead
      className="cursor-pointer select-none text-xs font-semibold text-gray-500 tracking-wide hover:text-gray-800"
      onClick={() => onSort(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <SortIcon active={sortKey === k} asc={sortAsc} />
      </span>
    </TableHead>
  );
}

export default function CategoriesTable({
  visible, totalCount, selected, allSelected, someSelected,
  sortKey, sortAsc, onToggleAll, onToggleOne, onSort,
  onEdit, onDelete, onAdd, onOpenAttributes,
}: Props) {

  const getParentName = (cat: Category) => {
    if (!cat.parent) return null;
    return visible.find(c => c.name === cat.parent)?.name ?? cat.parent;
  };

  return (
    <div className="pt-3 sm:pt-4 px-0 pb-6">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* ══ DESKTOP TABLE ══ */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allSelected}
                    data-indeterminate={someSelected}
                    onCheckedChange={onToggleAll}
                  />
                </TableHead>
                <TableHead className="w-11" />
                <SortHead label="Name" k="name" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                <TableHead className="text-xs font-semibold text-gray-500">Sort</TableHead>
                <SortHead label="Type" k="type" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
                <TableHead className="text-xs font-semibold text-gray-500">Description</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 text-center w-24">Attributes</TableHead>
                <TableHead className="w-24 text-xs font-semibold text-gray-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400 text-[13px]">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : visible.map(cat => (
                <TableRow
                  key={cat.id}
                  className="transition-colors group hover:bg-gray-50"
                  style={selected.has(cat.id) ? { backgroundColor: "#0a3d4710" } : {}}
                >
                  <TableCell className="pl-4 w-10">
                    <Checkbox checked={selected.has(cat.id)} onCheckedChange={() => onToggleOne(cat.id)} />
                  </TableCell>

                  <TableCell className="px-2 w-11">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-9 h-9 rounded-lg object-cover border border-gray-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400">
                        <ImageOff size={13} />
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-gray-900 text-[13px]">{cat.name}</div>
                    {getParentName(cat) && (
                      <div className="text-[11px] text-gray-400 mt-0.5">↳ {getParentName(cat)}</div>
                    )}
                  </TableCell>

                  <TableCell>
                    {cat.sortNumber !== null ? (
                      <span className="inline-flex bg-gray-100 border rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-500">
                        {cat.sortNumber}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </TableCell>

                  <TableCell>
                    {cat.type === "Product" ? (
                      <Badge className="gap-1 bg-green-50 text-green-700 border text-[11px] px-2 py-0.5">
                        <Package size={10} /> Product
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-blue-50 text-blue-700 border text-[11px] px-2 py-0.5">
                        <Wrench size={10} /> Service
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-gray-500 max-w-[200px]">
                    <span className="line-clamp-1 text-[13px]">
                      {cat.description ?? <span className="text-gray-300 italic">No description</span>}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-white hover:bg-[#0a3d47]"
                      onClick={() => onOpenAttributes(cat)}
                    >
                      <Plus size={14} />
                    </Button>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                        onClick={() => onEdit(cat)}>
                        <Edit2 size={13} />
                      </Button>
                      <Button variant="ghost" size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(cat.id)}>
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ══ MOBILE CARDS ══ */}
        <div className="md:hidden">
          {/* Mobile select-all bar */}
          {visible.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-gray-50">
              <Checkbox
                checked={allSelected}
                data-indeterminate={someSelected}
                onCheckedChange={onToggleAll}
              />
              <span className="text-[12px] text-gray-500 font-medium">
                {selected.size > 0 ? `${selected.size} selected` : `Select all (${visible.length})`}
              </span>
            </div>
          )}

          {visible.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <ImageOff size={32} className="mb-2 opacity-40" />
              <p className="text-[13px]">No categories found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visible.map(cat => (
                <li
                  key={cat.id}
                  className="px-4 py-3.5 transition-colors"
                  style={selected.has(cat.id) ? { backgroundColor: "#0a3d4708" } : {}}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <Checkbox
                        checked={selected.has(cat.id)}
                        onCheckedChange={() => onToggleOne(cat.id)}
                      />
                    </div>

                    {/* Image */}
                    {cat.image ? (
                      <img
                        src={cat.image} alt={cat.name}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400 shrink-0">
                        <ImageOff size={14} />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[14px] text-gray-900">{cat.name}</span>
                        {cat.type === "Product" ? (
                          <Badge className="gap-1 bg-green-50 text-green-700 border text-[10px] px-1.5 py-0">
                            <Package size={9} /> Product
                          </Badge>
                        ) : (
                          <Badge className="gap-1 bg-blue-50 text-blue-700 border text-[10px] px-1.5 py-0">
                            <Wrench size={9} /> Service
                          </Badge>
                        )}
                      </div>

                      {getParentName(cat) && (
                        <div className="text-[11px] text-gray-400 mt-0.5">↳ {getParentName(cat)}</div>
                      )}

                      {cat.description && (
                        <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-1">{cat.description}</p>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center gap-2 mt-2">
                        {cat.sortNumber !== null && (
                          <span className="inline-flex bg-gray-100 border rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                            Sort: {cat.sortNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons — always visible on mobile */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {/* Attributes */}
                      <button
                        onClick={() => onOpenAttributes(cat)}
                        className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-[11px] font-semibold text-white transition-colors"
                        style={{ backgroundColor: BRAND }}
                      >
                        <SlidersHorizontal size={12} />
                        <span>Attrs</span>
                      </button>

                      <div className="flex gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => onEdit(cat)}
                          className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => onDelete(cat.id)}
                          className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 active:bg-red-100 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
}