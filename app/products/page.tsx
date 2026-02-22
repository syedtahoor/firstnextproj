"use client";
import { useState } from "react";
import { ProductModal, Product, EMPTY_FORM } from "@/components/products/productaddmodal";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsToolbar from "@/components/products/ProductsToolbar";
import ProductsTable from "@/components/products/ProductsTable";

type Status  = "Active" | "Draft" | "Inactive";
type SortKey = "name" | "price" | "status" | "inventory";

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

  const stats = {
    total:    products.length,
    active:   products.filter(p => p.status === "Active").length,
    draft:    products.filter(p => p.status === "Draft").length,
    inactive: products.filter(p => p.status === "Inactive").length,
  };

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(a => !a); else { setSortKey(k); setSortAsc(true); }
  };

  const allSelected = visible.length > 0 && visible.every(p => selected.has(p.id));
  const toggleAll   = () => allSelected ? setSelected(new Set()) : setSelected(new Set(visible.map(p => p.id)));
  const toggleOne   = (id: number) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700 overflow-x-hidden">
      <ProductsHeader stats={stats} statusFilter={statusFilter} onStatusFilter={setStatusFilter} onAdd={openAdd} />
      <ProductsToolbar search={search} onSearch={setSearch} selectedCount={selected.size} onBulkDelete={bulkDelete} onClearSelection={() => setSelected(new Set())} />
      <ProductsTable
        visible={visible} totalCount={products.length} selected={selected} allSelected={allSelected}
        sortKey={sortKey} sortAsc={sortAsc} onToggleAll={toggleAll} onToggleOne={toggleOne}
        onSort={toggleSort} onEdit={openEdit} onDelete={deleteOne}
        onToggleDeal={toggleDeal} onToggleRecommended={toggleRecommended} onAdd={openAdd}
      />
      <ProductModal open={modalOpen} editId={editId} form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}