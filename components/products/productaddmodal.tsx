"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Package, X, CloudUpload, Link, Flame, ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Status       = "Active" | "Draft" | "Inactive";
type Condition    = "New" | "Used" | "Refurbished";
type ShippingType = "Free" | "Paid" | "Express" | "Local";

export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  discount: number;
  condition: Condition;
  sku: string;
  inventory: number;
  shippingType: ShippingType;
  status: Status;
  deal: boolean;
  recommended: boolean;
  description: string;
}

export const EMPTY_FORM: Omit<Product, "id"> = {
  image: "", name: "", price: 0, discount: 0, condition: "New",
  sku: "", inventory: 0, shippingType: "Free", status: "Active",
  deal: false, recommended: false, description: "",
};

const BRAND = "#0a3d47";

function ImageZone({ value, onChange }: { value: string; onChange: (src: string) => void }) {
  const [tab, setTab]       = useState<"upload" | "url">("upload");
  const [drag, setDrag]     = useState(false);
  const [urlVal, setUrlVal] = useState(value.startsWith("http") ? value : "");
  const fileRef             = useRef<HTMLInputElement>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => onChange(e.target?.result as string);
    r.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) readFile(f);
  };

  const hasPreview = !!value;
  const isUrl      = value.startsWith("http");

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(["upload", "url"] as const).map(t => (
          <button
            key={t} type="button" onClick={() => setTab(t)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150"
            style={tab === t
              ? { backgroundColor: BRAND, color: "white", borderColor: BRAND }
              : { backgroundColor: "white", color: "#6b7280", borderColor: "#e5e7eb" }}
          >
            {t === "upload" ? <CloudUpload className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
            {t === "upload" ? "Upload File" : "Image URL"}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className="relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200"
          style={{
            borderColor: drag ? BRAND : hasPreview ? "#7aabb3" : "#e5e7eb",
            backgroundColor: drag ? "#0a3d4710" : hasPreview ? "#0a3d4708" : "#f9fafb",
          }}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }} />
          {hasPreview ? (
            <div className="flex items-center gap-4 p-4">
              <img src={value} alt="preview"
                className="h-20 w-20 object-cover rounded-xl border-2 border-white shadow-md flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Image ready</p>
                <p className="text-xs text-gray-400 mt-0.5">Click or drag to replace</p>
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ color: BRAND, backgroundColor: "#0a3d4715" }}>
                  ✓ Uploaded
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all"
                style={{ backgroundColor: drag ? BRAND : "#0a3d4715" }}>
                <CloudUpload className="h-7 w-7 transition-colors" style={{ color: drag ? "white" : BRAND }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">{drag ? "Drop it here!" : "Click to upload or drag & drop"}</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 MB</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input className="pl-9" placeholder="https://example.com/product.jpg" value={urlVal}
                onChange={e => setUrlVal(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && urlVal.trim()) onChange(urlVal.trim()); }} />
            </div>
            <Button type="button" variant="outline"
              className="font-semibold"
              style={{ borderColor: "#0a3d4740", color: BRAND }}
              onClick={() => { if (urlVal.trim()) onChange(urlVal.trim()); }}>
              Apply
            </Button>
          </div>
          {isUrl && (
            <div className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: "#0a3d4708", borderColor: "#0a3d4720" }}>
              <img src={value} alt="preview"
                className="h-16 w-16 object-cover rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                onError={e => (e.currentTarget.style.display = "none")} />
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1"
                  style={{ color: BRAND, backgroundColor: "#0a3d4715" }}>✓ Preview</span>
                <p className="text-xs text-gray-400 break-all line-clamp-2">{value}</p>
              </div>
            </div>
          )}
          {!isUrl && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 py-8">
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-400">Paste an image URL above and click Apply</p>
            </div>
          )}
        </div>
      )}

      {hasPreview && (
        <button type="button" onClick={() => { onChange(""); setUrlVal(""); }}
          className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-600 transition-colors">
          <X className="h-3 w-3" /> Remove image
        </button>
      )}
    </div>
  );
}

export function ProductModal({
  open, editId, form, setForm, onClose, onSave,
}: {
  open: boolean;
  editId: number | null;
  form: Omit<Product, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Product, "id">>>;
  onClose: () => void;
  onSave: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const modalContent = (
    <>
      <style>{`
        @keyframes backdropIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalSlideIn {
          from { opacity:0; transform: scale(0.96) translateY(12px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .modal-body::-webkit-scrollbar { width: 4px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
        .field-label { font-size:11.5px; font-weight:700; color:#6b7280; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:6px; display:block; }
      `}</style>

      <div
        onClick={onClose}
        style={{ animation: "backdropIn 0.18s ease", zIndex: 99998, position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
      />

      <div
        style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{ animation: "modalSlideIn 0.24s cubic-bezier(.34,1.28,.64,1)", width: "100%", maxWidth: "700px", display: "flex", flexDirection: "column" }}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100"
            style={{ maxHeight: "min(90vh, 820px)", display: "flex", flexDirection: "column", boxShadow: "0 24px 60px -8px rgba(0,0,0,0.28)" }}
          >
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: BRAND }}>
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-gray-900">{editId ? form.name || "Edit Product" : "Add a Product"}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ color: BRAND, backgroundColor: "#0a3d4715" }}>
                      {editId ? "Edit" : "New"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{editId ? "Update and save your changes." : "Fill in the details to publish on your store."}</p>
                </div>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all flex-shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="modal-body flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
              <div>
                <span className="field-label">Product Image</span>
                <ImageZone value={form.image} onChange={src => setForm(f => ({ ...f, image: src }))} />
              </div>
              <div className="h-px bg-gray-100" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="field-label">Product Name <span className="text-red-400 normal-case">*</span></span>
                  <Input placeholder="e.g. Smartwatch Pro" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <span className="field-label">SKU</span>
                  <Input placeholder="e.g. SW-001" value={form.sku}
                    className="font-mono"
                    onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="field-label">Price ($)</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                    <Input type="number" placeholder="0.00" value={form.price || ""}
                      className="pl-7"
                      onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} />
                  </div>
                </div>
                <div>
                  <span className="field-label">Discount (%)</span>
                  <div className="relative">
                    <Input type="number" placeholder="0" min={0} max={100} value={form.discount || ""}
                      className="pr-8"
                      onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="field-label">Inventory</span>
                  <Input type="number" placeholder="0" value={form.inventory || ""}
                    onChange={e => setForm(f => ({ ...f, inventory: +e.target.value }))} />
                </div>
                <div>
                  <span className="field-label">Shipping Type</span>
                  <Select value={form.shippingType} onValueChange={v => setForm(f => ({ ...f, shippingType: v as ShippingType }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["Free","Paid","Express","Local"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="field-label">Condition</span>
                  <Select value={form.condition} onValueChange={v => setForm(f => ({ ...f, condition: v as Condition }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["New","Used","Refurbished"] as const).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span className="field-label">Status</span>
                  <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Status }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["Active","Draft","Inactive"] as const).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer select-none transition-all"
                  style={form.deal
                    ? { borderColor: "#f97316", backgroundColor: "#fff7ed" }
                    : { borderColor: "#f3f4f6", backgroundColor: "#f9fafb" }}>
                  <Checkbox id="deal" checked={form.deal}
                    onCheckedChange={v => setForm(f => ({ ...f, deal: !!v }))}
                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                      <Flame className="h-4 w-4 text-orange-500" /> Deal
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Show in deals section</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer select-none transition-all"
                  style={form.recommended
                    ? { borderColor: "#7aabb3", backgroundColor: "#0a3d4710" }
                    : { borderColor: "#f3f4f6", backgroundColor: "#f9fafb" }}>
                  <Checkbox id="rec" checked={form.recommended}
                    onCheckedChange={v => setForm(f => ({ ...f, recommended: !!v }))}
                    className="data-[state=checked]:border-0"
                    style={{ backgroundColor: form.recommended ? BRAND : undefined }} />
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                      <ThumbsUp className="h-4 w-4" style={{ color: BRAND }} /> Recommended
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Feature on homepage</p>
                  </div>
                </label>
              </div>
              <div>
                <span className="field-label">Description</span>
                <Textarea placeholder="Brief product description that appears in the catalogue…"
                  className="min-h-[88px] resize-none"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>

            <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/60 flex-shrink-0">
              <p className="text-xs text-gray-400"><span className="text-red-400">*</span> Required fields</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-600 hover:bg-gray-100">
                  Cancel
                </Button>
                <Button
                  disabled={!form.name.trim()}
                  onClick={onSave}
                  className="text-white min-w-[140px] hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: BRAND }}
                >
                  {editId ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}