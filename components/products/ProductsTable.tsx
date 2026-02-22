"use client";
import {
  ChevronDown, ChevronUp, ArrowUpDown, SlidersHorizontal, Plus,
  Package, Truck, BadgePercent, Flame, ThumbsUp,
  Edit2, Trash2, MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "./productaddmodal";

type Status   = "Active" | "Draft" | "Inactive";
type SortKey  = "name" | "price" | "status" | "inventory";

const STATUS_CLASS: Record<Status, string> = {
  Active:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  Draft:    "bg-amber-100 text-amber-700 border-amber-200",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
};
const STATUS_DOT: Record<Status, string> = {
  Active: "bg-emerald-500", Draft: "bg-amber-400", Inactive: "bg-gray-400",
};
const CONDITION_CLASS: Record<Product["condition"], string> = {
  New:         "bg-blue-50 text-blue-600 border-blue-200",
  Used:        "bg-orange-50 text-orange-600 border-orange-200",
  Refurbished: "bg-purple-50 text-purple-600 border-purple-200",
};
const SHIPPING_CLASS: Record<Product["shippingType"], string> = {
  Free: "bg-emerald-50 text-emerald-600", Paid: "bg-gray-100 text-gray-600",
  Express: "bg-cyan-50 text-cyan-700",    Local: "bg-yellow-50 text-yellow-700",
};

interface Props {
  visible: Product[];
  totalCount: number;
  selected: Set<number>;
  allSelected: boolean;
  sortKey: SortKey;
  sortAsc: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: number) => void;
  onSort: (k: SortKey) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
  onToggleDeal: (id: number) => void;
  onToggleRecommended: (id: number) => void;
  onAdd: () => void;
}

function SortBtn({ label, k, sortKey, sortAsc, onSort }: { label: string; k: SortKey; sortKey: SortKey; sortAsc: boolean; onSort: (k: SortKey) => void }) {
  return (
    <TableHead className="cursor-pointer select-none" onClick={() => onSort(k)}>
      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide">
        {label}
        {sortKey === k ? (sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-30" />}
      </span>
    </TableHead>
  );
}

export default function ProductsTable({
  visible, totalCount, selected, allSelected, sortKey, sortAsc,
  onToggleAll, onToggleOne, onSort, onEdit, onDelete, onToggleDeal, onToggleRecommended, onAdd,
}: Props) {
  return (
    <div className="px-6 py-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-10 pl-4"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></TableHead>
              <TableHead className="w-16">Image</TableHead>
              <SortBtn label="Name"      k="name"      sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
              <SortBtn label="Price"     k="price"     sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
              <TableHead className="text-xs font-bold uppercase tracking-wide">Discount %</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wide">Condition</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wide">SKU</TableHead>
              <SortBtn label="Inventory" k="inventory" sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
              <TableHead className="text-xs font-bold uppercase tracking-wide">Shipping</TableHead>
              <SortBtn label="Status"    k="status"    sortKey={sortKey} sortAsc={sortAsc} onSort={onSort} />
              <TableHead className="text-xs font-bold uppercase tracking-wide">Deals / Rec.</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wide w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map(p => (
              <TableRow key={p.id} style={selected.has(p.id) ? { backgroundColor: "#0a3d4708" } : {}}>
                <TableCell className="pl-4"><Checkbox checked={selected.has(p.id)} onCheckedChange={() => onToggleOne(p.id)} /></TableCell>
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="h-5 w-5" /></div>}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{p.description}</p>}
                </TableCell>
                <TableCell>
                  <span className="font-bold text-gray-900">${p.price.toLocaleString()}</span>
                  {p.discount > 0 && <span className="ml-1.5 text-xs text-gray-400 line-through">${Math.round(p.price / (1 - p.discount / 100)).toLocaleString()}</span>}
                </TableCell>
                <TableCell>
                  {p.discount > 0
                    ? <Badge className="bg-rose-100 text-rose-600 border-rose-200 text-xs font-bold"><BadgePercent className="h-3 w-3 mr-0.5" />{p.discount}%</Badge>
                    : <span className="text-gray-300 text-xs">—</span>}
                </TableCell>
                <TableCell><Badge className={`text-xs border font-medium ${CONDITION_CLASS[p.condition]}`}>{p.condition}</Badge></TableCell>
                <TableCell><code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{p.sku}</code></TableCell>
                <TableCell>
                  <span className={`text-sm font-semibold ${p.inventory === 0 ? "text-rose-500" : p.inventory < 10 ? "text-amber-500" : "text-gray-700"}`}>
                    {p.inventory === 0 ? "Out of stock" : p.inventory}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${SHIPPING_CLASS[p.shippingType]}`}>
                    <Truck className="h-3 w-3" />{p.shippingType}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs border ${STATUS_CLASS[p.status as Status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 inline-block ${STATUS_DOT[p.status as Status]}`} />
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    <button onClick={() => onToggleDeal(p.id)} className={`p-1 rounded transition-colors ${p.deal ? "text-orange-500 bg-orange-50" : "text-gray-300 hover:text-orange-400"}`}>
                      <Flame className="h-4 w-4" />
                    </button>
                    <button onClick={() => onToggleRecommended(p.id)} className="p-1 rounded transition-colors"
                      style={p.recommended ? { color: "#0a3d47", backgroundColor: "#0a3d4712" } : { color: "#d1d5db" }}>
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onEdit(p)}><Edit2 className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleDeal(p.id)}><Flame className="h-3.5 w-3.5 mr-2" /> {p.deal ? "Remove Deal" : "Mark Deal"}</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleRecommended(p.id)}><ThumbsUp className="h-3.5 w-3.5 mr-2" /> {p.recommended ? "Un-recommend" : "Recommend"}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => onDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {visible.length === 0 && (
              <TableRow>
                <td colSpan={12}>
                  <div className="text-center py-16">
                    <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 border"
                      style={{ backgroundColor: "#0a3d4710", borderColor: "#0a3d4720" }}>
                      <SlidersHorizontal className="h-5 w-5" style={{ color: "#0a3d47" }} />
                    </div>
                    <p className="font-semibold text-gray-700 mb-1">No products found</p>
                    <p className="text-xs text-gray-400 mb-5">Try adjusting your search or filters</p>
                    <Button onClick={onAdd} size="sm" className="text-white hover:opacity-90" style={{ backgroundColor: "#0a3d47" }}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
                    </Button>
                  </div>
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {visible.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-gray-400">
              {visible.length} of {totalCount} product{totalCount !== 1 ? "s" : ""}
              {selected.size > 0 && ` · ${selected.size} selected`}
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map(n => (
                <button key={n} className="w-7 h-7 rounded-md text-xs font-semibold border transition-colors"
                  style={n === 1
                    ? { backgroundColor: "#0a3d47", borderColor: "#0a3d47", color: "white" }
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