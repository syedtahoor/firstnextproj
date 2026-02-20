"use client";

import { useState, useRef } from "react";
import {
  Search, Plus, Edit2, Trash2, Link2,
  ImageOff, X, ChevronDown, ChevronUp,
  SlidersHorizontal, Check, Package, Wrench,
  MoreHorizontal, ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
type TypeFilter = "All" | "Product" | "Service";

interface FormState {
  name: string;
  sort: string;
  desc: string;
  type: "Product" | "Service";
  parent: string;
}

const INITIAL: Category[] = [
  { id: 1, name: "Others", sortNumber: null, type: "Product" },
  { id: 2, name: "Electronics", sortNumber: null, type: "Product", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=70", description: "Gadgets & devices" },
  { id: 3, name: "Bluetooth", sortNumber: 2, type: "Product", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=120&q=70" },
  { id: 4, name: "Bluetooth Speaker", sortNumber: null, type: "Product", parent: "Bluetooth" },
  { id: 5, name: "Cell Phones", sortNumber: null, type: "Product", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=70", description: "Smartphones & accessories" },
  { id: 6, name: "Laptops", sortNumber: 1, type: "Product", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&q=70", description: "Portable computers" },
  { id: 7, name: "Jewelry", sortNumber: 3, type: "Product", description: "Gold & Silver pieces" },
  { id: 8, name: "Home Appliances", sortNumber: null, type: "Service", description: "Kitchen & home tools" },
];

function SortIcon({ active, asc }: { active: boolean; asc: boolean }) {
  if (!active) return <ArrowUpDown size={11} className="opacity-30" />;
  return asc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
}

const BRAND = "#0a3d47";
const brandBg = { backgroundColor: BRAND } as React.CSSProperties;
const brandText = { color: BRAND } as React.CSSProperties;
const brandSelectedRow = { backgroundColor: "#0a3d4710" } as React.CSSProperties;
const brandSelectedHover: React.CSSProperties = { backgroundColor: "#0a3d4718" };

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>(INITIAL);
  const [search, setSearch] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "", sort: "", desc: "", type: "Product", parent: "",
  });

  const visible: Category[] = cats
    .filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "All" || c.type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      const rawA = a[sortKey];
      const rawB = b[sortKey];
      const va: string = rawA === null || rawA === undefined ? (sortAsc ? "zzz" : "") : String(rawA);
      const vb: string = rawB === null || rawB === undefined ? (sortAsc ? "zzz" : "") : String(rawB);
      return sortAsc
        ? va.localeCompare(vb, undefined, { numeric: true })
        : vb.localeCompare(va, undefined, { numeric: true });
    });

  const toggleSort = (k: SortKey): void => {
    if (sortKey === k) setSortAsc((a) => !a);
    else { setSortKey(k); setSortAsc(true); }
  };

  const toggleSelect = (id: number): void => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected: boolean = visible.length > 0 && visible.every((c) => selected.has(c.id));
  const someSelected: boolean = selected.size > 0 && !allSelected;

  const toggleAll = (): void => {
    if (allSelected) setSelected(new Set<number>());
    else setSelected(new Set<number>(visible.map((c) => c.id)));
  };

  const openAdd = (): void => {
    setEditId(null);
    setForm({ name: "", sort: "", desc: "", type: "Product", parent: "" });
    setShowForm(true);
  };

  const openEdit = (c: Category): void => {
    setEditId(c.id);
    setForm({
      name: c.name,
      sort: c.sortNumber?.toString() ?? "",
      desc: c.description ?? "",
      type: c.type,
      parent: c.parent ?? "",
    });
    setShowForm(true);
  };

  const handleSave = (): void => {
    if (!form.name.trim()) return;
    const updated: Partial<Category> = {
      name: form.name,
      sortNumber: form.sort ? Number(form.sort) : null,
      description: form.desc,
      type: form.type,
      parent: form.parent || undefined,
    };
    if (editId !== null) {
      setCats((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...updated } : c))
      );
    } else {
      const newCat: Category = { id: Date.now(), ...updated } as Category;
      setCats((prev) => [...prev, newCat]);
    }
    setShowForm(false);
  };

  const del = (id: number): void => {
    setCats((prev) => prev.filter((c) => c.id !== id));
  };

  const bulkDelete = (): void => {
    setCats((prev) => prev.filter((c) => !selected.has(c.id)));
    setSelected(new Set<number>());
  };

  return (
    <div className="min-h-screen bg-gray-50 text-sm text-gray-700">

      <div className="p-7">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all categories listed on your website</p>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-2 flex-wrap rounded-b-md">
        <div className="relative w-60">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <Input
            className="pl-8 pr-8 h-8 text-[13px]"
            placeholder="Search categories…"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          {(["All", "Product", "Service"] as TypeFilter[]).map((v) => (
            <button
              key={v}
              onClick={() => setTypeFilter(v)}
              className="px-3 py-1.5 text-xs font-medium border-r border-gray-300 last:border-r-0 transition-colors"
              style={typeFilter === v
                ? { ...brandBg, color: "white" }
                : { backgroundColor: "white", color: "#6b7280" }}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {selected.size > 0 && (
          <Button size="sm" variant="destructive" onClick={bulkDelete} className="h-8 text-xs gap-1.5">
            <Trash2 size={13} /> Delete {selected.size}
          </Button>
        )}

        <Button
          size="sm"
          onClick={openAdd}
          className="h-8 text-xs gap-1.5 text-white hover:opacity-90"
          style={brandBg}
        >
          <Plus size={13} /> Add Category
        </Button>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2.5 px-6 py-2 bg-amber-50 border-b border-amber-200 text-xs font-medium text-amber-800">
          <Check size={13} />
          <span>{selected.size} row{selected.size > 1 ? "s" : ""} selected</span>
          <button
            onClick={() => setSelected(new Set<number>())}
            className="ml-auto text-xs font-medium hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="pt-4">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allSelected}
                    data-indeterminate={someSelected}
                    onCheckedChange={toggleAll}
                    className="border-gray-300"
                  />
                </TableHead>
                <TableHead className="w-11" />
                <TableHead
                  className="cursor-pointer select-none text-xs font-semibold text-gray-500 tracking-wide hover:text-gray-800"
                  onClick={() => toggleSort("name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Name <SortIcon active={sortKey === "name"} asc={sortAsc} />
                  </span>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-xs font-semibold text-gray-500 tracking-wide hover:text-gray-800 hidden sm:table-cell"
                  onClick={() => toggleSort("sortNumber")}
                >
                  <span className="inline-flex items-center gap-1">
                    Sort <SortIcon active={sortKey === "sortNumber"} asc={sortAsc} />
                  </span>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-xs font-semibold text-gray-500 tracking-wide hover:text-gray-800"
                  onClick={() => toggleSort("type")}
                >
                  <span className="inline-flex items-center gap-1">
                    Type <SortIcon active={sortKey === "type"} asc={sortAsc} />
                  </span>
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 tracking-wide hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="w-28 text-xs font-semibold text-gray-500 tracking-wide">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visible.map((cat) => (
                <TableRow
                  key={cat.id}
                  className="transition-colors group hover:bg-gray-50"
                  style={selected.has(cat.id) ? brandSelectedRow : {}}
                >
                  <TableCell className="pl-4 w-10">
                    <Checkbox
                      checked={selected.has(cat.id)}
                      onCheckedChange={() => toggleSelect(cat.id)}
                      className="border-gray-300"
                    />
                  </TableCell>

                  <TableCell className="px-2 w-11">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-9 h-9 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <ImageOff size={13} />
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-gray-900 text-[13px]">{cat.name}</div>
                    {cat.parent && (
                      <div className="text-[11px] text-gray-400 mt-0.5">↳ {cat.parent}</div>
                    )}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {cat.sortNumber !== null ? (
                      <span className="inline-flex items-center bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-500 tabular-nums">
                        {cat.sortNumber}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {cat.type === "Product" ? (
                      <Badge className="gap-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 text-[11px] font-semibold px-2 py-0.5">
                        <Package size={10} /> Product
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 text-[11px] font-semibold px-2 py-0.5">
                        <Wrench size={10} /> Service
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="hidden md:table-cell text-gray-500 max-w-[220px]">
                    <span className="line-clamp-1 text-[13px]">
                      {cat.description ?? (
                        <span className="text-gray-300 italic">No description</span>
                      )}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                        onClick={() => openEdit(cat)}
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => del(cat.id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                      >
                        <Link2 size={13} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-gray-800 hover:bg-gray-100"
                          >
                            <MoreHorizontal size={13} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[150px]">
                          <DropdownMenuItem onClick={() => openEdit(cat)} className="gap-2 text-[12.5px]">
                            <Edit2 size={13} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-[12.5px]">
                            <Link2 size={13} /> Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => del(cat.id)}
                            className="gap-2 text-[12.5px] text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
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
                      <Button
                        size="sm"
                        onClick={openAdd}
                        className="mt-4 gap-1.5 text-xs text-white hover:opacity-90"
                        style={brandBg}
                      >
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
                {visible.length} of {cats.length} categor{cats.length !== 1 ? "ies" : "y"}
                {selected.size > 0 && ` · ${selected.size} selected`}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className="w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-colors border"
                    style={n === 1
                      ? { ...brandBg, borderColor: BRAND, color: "white" }
                      : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#6b7280" }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent className="w-[420px] sm:w-[420px] flex flex-col p-0 gap-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
            <SheetTitle className="text-[15px] font-bold text-gray-900">
              {editId !== null ? "Edit Category" : "New Category"}
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-400">
              {editId !== null
                ? "Update the details below"
                : "Fill in details to create a new category"}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">Title *</Label>
                <Input
                  className="h-9 text-[13px]"
                  placeholder="e.g. Electronics"
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">Sort Number</Label>
                <Input
                  className="h-9 text-[13px]"
                  type="number"
                  placeholder="0"
                  value={form.sort}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, sort: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">Category For</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: "Product" | "Service") =>
                    setForm((f) => ({ ...f, type: v }))
                  }
                >
                  <SelectTrigger className="h-9 text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-gray-700">Parent Category</Label>
                <Select
                  value={form.parent || "none"}
                  onValueChange={(v: string) =>
                    setForm((f) => ({ ...f, parent: v === "none" ? "" : v }))
                  }
                >
                  <SelectTrigger className="h-9 text-[13px]">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {cats.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-gray-700">Description</Label>
              <Textarea
                className="text-[13px] min-h-[72px] resize-y"
                placeholder="Optional details about this category…"
                value={form.desc}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm((f) => ({ ...f, desc: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-gray-700">Category Image</Label>
              <label className="flex items-center gap-2.5 border border-dashed border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors">
                <span className="bg-white border border-gray-200 rounded-md px-2.5 py-1 text-[11.5px] font-semibold text-gray-600 hover:bg-gray-50">
                  Choose file
                </span>
                <span className="text-xs text-gray-400">No file chosen</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-2 justify-end">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs text-white hover:opacity-90"
              style={brandBg}
              onClick={handleSave}
            >
              {editId !== null ? "Update Category" : "Save Category"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}