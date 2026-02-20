"use client";
import { useState } from "react";
import {
  Search, Plus, Edit2, Trash2,
  X, ChevronDown, ChevronUp,
  SlidersHorizontal, Check,
  MoreHorizontal, ArrowUpDown,
  Package, Truck, BadgePercent,
  Flame, ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { ProductModal, Product, EMPTY_FORM } from "../../../components/products/productaddmodal";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status    = "Active" | "Draft" | "Inactive";
type SortKey   = "name" | "price" | "status" | "inventory";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop", name: "Premium Smartwatch Pro", price: 299, discount: 15, condition: "New", sku: "SW-001", inventory: 42, shippingType: "Free", status: "Active", deal: true, recommended: true, description: "Next-gen smartwatch with health tracking, AMOLED display and 7-day battery." },
  { id: 2, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop", name: "Wireless Earbuds Elite", price: 149, discount: 0, condition: "New", sku: "WE-002", inventory: 87, shippingType: "Free", status: "Active", deal: false, recommended: true, description: "Active noise cancellation, 30h battery, premium audio quality." },
  { id: 3, image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop", name: "Running Shoes X500", price: 120, discount: 20, condition: "New", sku: "RS-003", inventory: 0, shippingType: "Paid", status: "Draft", deal: true, recommended: false, description: "Lightweight performance shoes for serious runners." },
  { id: 4, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop", name: "Instant Camera Mini", price: 89, discount: 10, condition: "New", sku: "CM-004", inventory: 23, shippingType: "Express", status: "Active", deal: false, recommended: true, description: "Retro-style instant camera with colour filters." },
  { id: 5, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=80&h=80&fit=crop", name: "Gaming Laptop 16\" RTX", price: 1499, discount: 5, condition: "New", sku: "GL-005", inventory: 11, shippingType: "Free", status: "Active", deal: true, recommended: true, description: "RTX 4070 GPU, 16GB RAM, 144Hz display." },
  { id: 6, image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80&h=80&fit=crop", name: "Leather Crossbody Bag", price: 75, discount: 0, condition: "Used", sku: "LB-006", inventory: 5, shippingType: "Local", status: "Active", deal: false, recommended: false, description: "Genuine leather, barely used, excellent condition." },
  { id: 7, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop", name: "UV Protection Sunglasses", price: 45, discount: 0, condition: "New", sku: "SG-007", inventory: 134, shippingType: "Paid", status: "Inactive", deal: false, recommended: false, description: "Polarised UV400 lenses with lightweight titanium frame." },
  { id: 8, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=80&h=80&fit=crop", name: "Refurb iPhone 13", price: 549, discount: 12, condition: "Refurbished", sku: "IP-008", inventory: 8, shippingType: "Express", status: "Active", deal: true, recommended: false, description: "Certified refurbished, 12-month warranty included." },
];

// ─── Style Maps ───────────────────────────────────────────────────────────────

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
  Free:    "bg-emerald-50 text-emerald-600",
  Paid:    "bg-gray-100 text-gray-600",
  Express: "bg-cyan-50 text-cyan-700",
  Local:   "bg-yellow-50 text-yellow-700",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [products, setProducts]         = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [sortKey, setSortKey]           = useState<SortKey>("name");
  const [sortAsc, setSortAsc]           = useState(true);
  const [selected, setSelected]         = useState<Set<number>>(new Set());
  const [modalOpen, setModalOpen]       = useState(false);
  const [editId, setEditId]             = useState<number | null>(null);
  const [form, setForm]                 = useState<Omit<Product, "id">>(EMPTY_FORM);

  // Filtering + sorting
  const visible = products
    .filter(p => {
      const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const mf = statusFilter === "All" || p.status === statusFilter;
      return ms && mf;
    })
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortAsc ? cmp : -cmp;
    });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(a => !a); else { setSortKey(k); setSortAsc(true); }
  };
  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortAsc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
      : <ArrowUpDown className="h-3 w-3 opacity-30" />;

  // Selection
  const allSelected = visible.length > 0 && visible.every(p => selected.has(p.id));
  const toggleAll   = () => allSelected ? setSelected(new Set()) : setSelected(new Set(visible.map(p => p.id)));
  const toggleOne   = (id: number) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // CRUD
  const openAdd  = () => { setEditId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p: Product) => { const { id, ...rest } = p; setEditId(id); setForm(rest); setModalOpen(true); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId !== null) setProducts(prev => prev.map(p => p.id === editId ? { id: editId, ...form } : p));
    else setProducts(prev => [...prev, { id: Date.now(), ...form }]);
    setModalOpen(false);
  };
  const deleteOne         = (id: number) => setProducts(p => p.filter(x => x.id !== id));
  const bulkDelete        = () => { setProducts(p => p.filter(x => !selected.has(x.id))); setSelected(new Set()); };
  const toggleDeal        = (id: number) => setProducts(p => p.map(x => x.id === id ? { ...x, deal: !x.deal } : x));
  const toggleRecommended = (id: number) => setProducts(p => p.map(x => x.id === id ? { ...x, recommended: !x.recommended } : x));

  // Stats
  const stats = {
    total:    products.length,
    active:   products.filter(p => p.status === "Active").length,
    draft:    products.filter(p => p.status === "Draft").length,
    inactive: products.filter(p => p.status === "Inactive").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700 overflow-x-hidden">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-0">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {/* Brand accent label — now uses inline style for #0a3d47 */}
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#0a3d47" }}>Catalogue</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all products listed on your website</p>
          </div>
          {/* Primary CTA button */}
          <Button
            onClick={openAdd}
            className="mt-1 text-white hover:opacity-90"
            style={{ backgroundColor: "#0a3d47" }}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1">
          {([
            { key: "All",      label: "All",      n: stats.total,    dot: "bg-gray-400"    },
            { key: "Active",   label: "Active",   n: stats.active,   dot: "bg-emerald-500" },
            { key: "Draft",    label: "Draft",    n: stats.draft,    dot: "bg-amber-400"   },
            { key: "Inactive", label: "Inactive", n: stats.inactive, dot: "bg-gray-300"    },
          ] as const).map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 relative bottom-[-1px] transition-colors
                ${statusFilter === s.key
                  ? "bg-gray-50 border-gray-200 text-gray-900"
                  : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />{s.label}
              <span className="font-bold text-gray-700">{s.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            className="pl-9 w-64 h-9 text-sm focus-visible:ring-0"
            style={{ outlineColor: "#0a3d47" }}
            placeholder="Search by name or SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex-1" />
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" onClick={bulkDelete}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete {selected.size}
          </Button>
        )}
      </div>

      {/* Selection banner */}
      {selected.size > 0 && (
        <div
          className="border-b px-6 py-2 flex items-center gap-2 text-xs font-semibold"
          style={{ backgroundColor: "#0a3d4712", borderColor: "#0a3d4730", color: "#0a3d47" }}
        >
          <Check className="h-3.5 w-3.5" />
          {selected.size} product{selected.size > 1 ? "s" : ""} selected
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto hover:underline"
            style={{ color: "#0a3d47" }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="px-6 py-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-10 pl-4">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide">Name <SortIcon k="name" /></span>
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("price")}>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide">Price <SortIcon k="price" /></span>
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide">Discount %</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide">Condition</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide">SKU</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("inventory")}>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide">Inventory <SortIcon k="inventory" /></span>
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide">Shipping</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide">Status <SortIcon k="status" /></span>
                </TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide">Deals / Rec.</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wide w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(product => (
                <TableRow key={product.id} style={selected.has(product.id) ? { backgroundColor: "#0a3d4708" } : {}}>
                  <TableCell className="pl-4">
                    <Checkbox checked={selected.has(product.id)} onCheckedChange={() => toggleOne(product.id)} />
                  </TableCell>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                      {product.image
                        ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="h-5 w-5" /></div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{product.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-gray-900">${product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                      <span className="ml-1.5 text-xs text-gray-400 line-through">
                        ${Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.discount > 0
                      ? <Badge className="bg-rose-100 text-rose-600 border-rose-200 text-xs font-bold">
                          <BadgePercent className="h-3 w-3 mr-0.5" />{product.discount}%
                        </Badge>
                      : <span className="text-gray-300 text-xs">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs border font-medium ${CONDITION_CLASS[product.condition]}`}>{product.condition}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{product.sku}</code>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-semibold ${product.inventory === 0 ? "text-rose-500" : product.inventory < 10 ? "text-amber-500" : "text-gray-700"}`}>
                      {product.inventory === 0 ? "Out of stock" : product.inventory}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${SHIPPING_CLASS[product.shippingType]}`}>
                      <Truck className="h-3 w-3" />{product.shippingType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs border ${STATUS_CLASS[product.status as Status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 inline-block ${STATUS_DOT[product.status as Status]}`} />
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleDeal(product.id)}
                        className={`p-1 rounded transition-colors ${product.deal ? "text-orange-500 bg-orange-50" : "text-gray-300 hover:text-orange-400"}`}
                      >
                        <Flame className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleRecommended(product.id)}
                        className="p-1 rounded transition-colors"
                        style={product.recommended
                          ? { color: "#0a3d47", backgroundColor: "#0a3d4712" }
                          : { color: "#d1d5db" }}
                      >
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
                        <DropdownMenuItem onClick={() => openEdit(product)}><Edit2 className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleDeal(product.id)}><Flame className="h-3.5 w-3.5 mr-2" /> {product.deal ? "Remove Deal" : "Mark Deal"}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleRecommended(product.id)}><ThumbsUp className="h-3.5 w-3.5 mr-2" /> {product.recommended ? "Un-recommend" : "Recommend"}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => deleteOne(product.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className="text-center py-16">
                      <div
                        className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 border"
                        style={{ backgroundColor: "#0a3d4710", borderColor: "#0a3d4720" }}
                      >
                        <SlidersHorizontal className="h-5 w-5" style={{ color: "#0a3d47" }} />
                      </div>
                      <p className="font-semibold text-gray-700 mb-1">No products found</p>
                      <p className="text-xs text-gray-400 mb-5">Try adjusting your search or filters</p>
                      <Button
                        onClick={openAdd}
                        size="sm"
                        className="text-white hover:opacity-90"
                        style={{ backgroundColor: "#0a3d47" }}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {visible.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-gray-400">
                {visible.length} of {products.length} product{products.length !== 1 ? "s" : ""}
                {selected.size > 0 && ` · ${selected.size} selected`}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    className="w-7 h-7 rounded-md text-xs font-semibold border transition-colors"
                    style={n === 1
                      ? { backgroundColor: "#0a3d47", borderColor: "#0a3d47", color: "white" }
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

      {/* Modal */}
      <ProductModal
        open={modalOpen}
        editId={editId}
        form={form}
        setForm={setForm}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}