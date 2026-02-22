"use client";
import { useState } from "react";
import CategoriesHeader from "@/components/categories/CategoriesHeader";
import CategoriesTable  from "@/components/categories/CategoriesTable";
import CategoriesSheet  from "@/components/categories/CategoriesSheet";

interface Category {
  id: number; image?: string; name: string;
  sortNumber: number | null; type: "Product" | "Service";
  description?: string; parent?: string;
}

type SortKey    = "name" | "sortNumber" | "type";
type TypeFilter = "All" | "Product" | "Service";
interface FormState { name: string; sort: string; desc: string; type: "Product" | "Service"; parent: string; }

const EMPTY_FORM: FormState = { name: "", sort: "", desc: "", type: "Product", parent: "" };

const INITIAL: Category[] = [
  { id: 1, name: "Others",            sortNumber: null, type: "Product" },
  { id: 2, name: "Electronics",       sortNumber: null, type: "Product", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=70", description: "Gadgets & devices" },
  { id: 3, name: "Bluetooth",         sortNumber: 2,    type: "Product", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=120&q=70" },
  { id: 4, name: "Bluetooth Speaker", sortNumber: null, type: "Product", parent: "Bluetooth" },
  { id: 5, name: "Cell Phones",       sortNumber: null, type: "Product", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=70", description: "Smartphones & accessories" },
  { id: 6, name: "Laptops",           sortNumber: 1,    type: "Product", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&q=70", description: "Portable computers" },
  { id: 7, name: "Jewelry",           sortNumber: 3,    type: "Product", description: "Gold & Silver pieces" },
  { id: 8, name: "Home Appliances",   sortNumber: null, type: "Service", description: "Kitchen & home tools" },
];

export default function CategoriesPage() {
  const [cats, setCats]             = useState<Category[]>(INITIAL);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [sortKey, setSortKey]       = useState<SortKey>("name");
  const [sortAsc, setSortAsc]       = useState(true);
  const [selected, setSelected]     = useState<Set<number>>(new Set());
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState<number | null>(null);
  const [form, setForm]             = useState<FormState>(EMPTY_FORM);

  const visible = cats
    .filter(c => {
      const ms = c.name.toLowerCase().includes(search.toLowerCase());
      const mt = typeFilter === "All" || c.type === typeFilter;
      return ms && mt;
    })
    .sort((a, b) => {
      const va = a[sortKey] === null || a[sortKey] === undefined ? (sortAsc ? "zzz" : "") : String(a[sortKey]);
      const vb = b[sortKey] === null || b[sortKey] === undefined ? (sortAsc ? "zzz" : "") : String(b[sortKey]);
      return sortAsc ? va.localeCompare(vb, undefined, { numeric: true }) : vb.localeCompare(va, undefined, { numeric: true });
    });

  const allSelected  = visible.length > 0 && visible.every(c => selected.has(c.id));
  const someSelected = selected.size > 0 && !allSelected;

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortAsc(a => !a); else { setSortKey(k); setSortAsc(true); } };
  const toggleOne  = (id: number) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll  = () => allSelected ? setSelected(new Set()) : setSelected(new Set(visible.map(c => c.id)));

  const openAdd  = () => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (c: Category) => { setEditId(c.id); setForm({ name: c.name, sort: c.sortNumber?.toString() ?? "", desc: c.description ?? "", type: c.type, parent: c.parent ?? "" }); setShowForm(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const updated = { name: form.name, sortNumber: form.sort ? Number(form.sort) : null, description: form.desc, type: form.type, parent: form.parent || undefined };
    if (editId !== null) setCats(prev => prev.map(c => c.id === editId ? { ...c, ...updated } : c));
    else setCats(prev => [...prev, { id: Date.now(), ...updated } as Category]);
    setShowForm(false);
  };

  const del       = (id: number) => setCats(prev => prev.filter(c => c.id !== id));
  const bulkDelete = () => { setCats(prev => prev.filter(c => !selected.has(c.id))); setSelected(new Set()); };

  return (
    <div className="min-h-screen bg-gray-50 text-sm text-gray-700">
      <CategoriesHeader
        search={search} onSearch={setSearch}
        typeFilter={typeFilter} onTypeFilter={setTypeFilter}
        selectedCount={selected.size} onBulkDelete={bulkDelete}
        onClearSelection={() => setSelected(new Set())} onAdd={openAdd}
      />
      <CategoriesTable
        visible={visible} totalCount={cats.length}
        selected={selected} allSelected={allSelected} someSelected={someSelected}
        sortKey={sortKey} sortAsc={sortAsc}
        onToggleAll={toggleAll} onToggleOne={toggleOne} onSort={toggleSort}
        onEdit={openEdit} onDelete={del} onAdd={openAdd}
      />
      <CategoriesSheet
        open={showForm} editId={editId} form={form}
        allCategories={cats} onFormChange={setForm}
        onClose={() => setShowForm(false)} onSave={handleSave}
      />
    </div>
  );
}