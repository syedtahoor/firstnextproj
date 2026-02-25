"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, X, Tag, Pencil, Trash2, Check, RotateCcw, ListPlus,
} from "lucide-react";

import AssignValuesModal, { Attribute } from "./Assignvaluesmodal";

const BRAND = "#0a3d47";

/* ─── Types ─────────────────────────────────────────── */
interface Props {
  open: boolean;
  categoryName: string | null;
  attributes: Attribute[];
  onClose: () => void;
  onSave: (attr: Attribute) => void;
  onUpdate?: (attr: Attribute) => void;
  onDelete?: (id: number) => void;
}

/* ─── Seed data ──────────────────────────────────────── */
const SEED_ATTRIBUTES: Record<string, Attribute[]> = {
  Electronics: [
    { id: 9001, name: "Brand", placeholder: "e.g. Samsung, Sony", sortOrder: 1, isVariant: false, valueType: "text", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "Samsung" }, { id: 2, value: "Sony" }, { id: 3, value: "LG" }] },
    { id: 9002, name: "Warranty (Years)", placeholder: "e.g. 2", sortOrder: 2, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
    { id: 9003, name: "Power (W)", placeholder: "e.g. 60", sortOrder: 3, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
  ],
  Bluetooth: [
    { id: 9010, name: "Connectivity Range (m)", placeholder: "e.g. 10", sortOrder: 1, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
    { id: 9011, name: "Battery Life (hrs)", placeholder: "e.g. 8", sortOrder: 2, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
    { id: 9012, name: "Color", placeholder: "Pick color", sortOrder: 3, isVariant: true, valueType: "text", selectType: "checkbox", isDefault: true, values: [{ id: 1, value: "Black" }, { id: 2, value: "White" }, { id: 3, value: "Blue" }] },
  ],
  "Bluetooth Speaker": [
    { id: 9020, name: "Output Power (W)", placeholder: "e.g. 20", sortOrder: 1, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
    { id: 9021, name: "Waterproof", placeholder: "Yes / No", sortOrder: 2, isVariant: false, valueType: "text", selectType: "radio", isDefault: true, values: [{ id: 1, value: "Yes" }, { id: 2, value: "No" }] },
    { id: 9022, name: "Color", placeholder: "Pick color", sortOrder: 3, isVariant: true, valueType: "text", selectType: "dropdown", isDefault: true },
  ],
  "Cell Phones": [
    { id: 9030, name: "Storage (GB)", placeholder: "e.g. 128", sortOrder: 1, isVariant: true, valueType: "number", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "64" }, { id: 2, value: "128" }, { id: 3, value: "256" }, { id: 4, value: "512" }] },
    { id: 9031, name: "RAM (GB)", placeholder: "e.g. 8", sortOrder: 2, isVariant: true, valueType: "number", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "4" }, { id: 2, value: "6" }, { id: 3, value: "8" }, { id: 4, value: "12" }] },
    { id: 9032, name: "Network", placeholder: "4G / 5G", sortOrder: 3, isVariant: false, valueType: "text", selectType: "radio", isDefault: true, values: [{ id: 1, value: "4G" }, { id: 2, value: "5G" }, { id: 3, value: "Wi-Fi" }, { id: 4, value: "Bluetooth" }, { id: 5, value: "NFC" }, { id: 6, value: "others" }] },
    { id: 9033, name: "Color", placeholder: "Pick color", sortOrder: 4, isVariant: true, valueType: "text", selectType: "checkbox", isDefault: true, values: [{ id: 1, value: "Black" }, { id: 2, value: "White" }, { id: 3, value: "Blue" }, { id: 4, value: "Red" }] },
  ],
  Laptops: [
    { id: 9040, name: "Processor", placeholder: "e.g. i7, Ryzen 5", sortOrder: 1, isVariant: false, valueType: "text", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "Intel i5" }, { id: 2, value: "Intel i7" }, { id: 3, value: "Ryzen 5" }, { id: 4, value: "Ryzen 7" }] },
    { id: 9041, name: "RAM (GB)", placeholder: "e.g. 16", sortOrder: 2, isVariant: true, valueType: "number", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "8" }, { id: 2, value: "16" }, { id: 3, value: "32" }] },
    { id: 9042, name: "Storage (GB)", placeholder: "e.g. 512", sortOrder: 3, isVariant: true, valueType: "number", selectType: "dropdown", isDefault: true },
    { id: 9043, name: "Display Size (inch)", placeholder: "e.g. 15.6", sortOrder: 4, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
  ],
  Jewelry: [
    { id: 9050, name: "Material", placeholder: "Gold / Silver / Platinum", sortOrder: 1, isVariant: false, valueType: "text", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "Gold" }, { id: 2, value: "Silver" }, { id: 3, value: "Platinum" }] },
    { id: 9051, name: "Karat", placeholder: "e.g. 22K", sortOrder: 2, isVariant: false, valueType: "text", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "18K" }, { id: 2, value: "22K" }, { id: 3, value: "24K" }] },
    { id: 9052, name: "Weight (g)", placeholder: "e.g. 5.5", sortOrder: 3, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
    { id: 9053, name: "Size", placeholder: "Ring size etc.", sortOrder: 4, isVariant: true, valueType: "text", selectType: "dropdown", isDefault: true },
  ],
  "Home Appliances": [
    { id: 9060, name: "Energy Rating", placeholder: "A+ / A++ etc.", sortOrder: 1, isVariant: false, valueType: "text", selectType: "dropdown", isDefault: true, values: [{ id: 1, value: "A" }, { id: 2, value: "A+" }, { id: 3, value: "A++" }] },
    { id: 9061, name: "Voltage (V)", placeholder: "e.g. 220", sortOrder: 2, isVariant: false, valueType: "number", selectType: "textbox", isDefault: true },
    { id: 9062, name: "Color", placeholder: "Pick color", sortOrder: 3, isVariant: true, valueType: "text", selectType: "checkbox", isDefault: true },
  ],
};

const EMPTY_FORM: Omit<Attribute, "id"> = {
  name: "", placeholder: "", sortOrder: 0,
  isVariant: false, valueType: "text", selectType: "dropdown",
};

/* ─── Add / Edit Attribute Modal ─────────────────────── */
function AttrFormModal({
  open,
  isEdit,
  form,
  onChange,
  onSubmit,
  onClose,
}: {
  open: boolean;
  isEdit: boolean;
  form: Omit<Attribute, "id">;
  onChange: (f: Omit<Attribute, "id">) => void;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden border border-gray-200"
        style={{
          maxWidth: 900,
          width: "calc(100vw - 24px)",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ backgroundColor: isEdit ? "#fffbf0" : BRAND }}
        >
          <DialogTitle
            className="text-[14px] font-bold"
            style={{ color: isEdit ? "#b45309" : "#fff" }}
          >
            {isEdit ? "✎  Edit Attribute" : "+ Add New Attribute"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: isEdit ? "#b45309" : "#5eead4" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Name <span className="text-red-400">*</span>
            </Label>
            <Input
              className="mt-1.5 h-10 text-[13px] rounded-lg"
              placeholder="e.g. Color, Size, Brand"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Placeholder
            </Label>
            <Input
              className="mt-1.5 h-10 text-[13px] rounded-lg"
              placeholder="e.g. Select a color..."
              value={form.placeholder}
              onChange={(e) => onChange({ ...form, placeholder: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                Sort Order
              </Label>
              <Input
                type="number"
                className="mt-1.5 h-10 text-[13px] rounded-lg"
                value={form.sortOrder}
                onChange={(e) => onChange({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                Value Type
              </Label>
              <Select
                value={form.valueType}
                onValueChange={(v: "text" | "number") => onChange({ ...form, valueType: v })}
              >
                <SelectTrigger className="mt-1.5 h-10 text-[13px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Select Type
            </Label>
            <Select
              value={form.selectType}
              onValueChange={(v: any) => onChange({ ...form, selectType: v })}
            >
              <SelectTrigger className="mt-1.5 h-10 text-[13px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="radio">Radio Button</SelectItem>
                <SelectItem value="textbox">Textbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
            <Checkbox
              checked={form.isVariant}
              onCheckedChange={(v) => onChange({ ...form, isVariant: !!v })}
            />
            <div>
              <p className="text-[13px] font-medium text-gray-700">Mark as Variant</p>
              <p className="text-[11px] text-gray-400">Shows as a product variant option</p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-2">
          <Button variant="outline" className="flex-1 h-10 text-[13px] rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 h-10 text-[13px] text-white rounded-xl font-semibold"
            style={{ backgroundColor: BRAND }}
            onClick={onSubmit}
            disabled={!form.name.trim()}
          >
            {isEdit ? "Update Attribute" : "Add Attribute"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Modal ─────────────────────────────────────── */
export default function CategoryAttributesSheet({
  open, categoryName, attributes, onClose, onSave, onUpdate, onDelete,
}: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<Attribute, "id">>(EMPTY_FORM);
  const [editingAttr, setEditingAttr] = useState<Attribute | null>(null);
  const [editForm, setEditForm] = useState<Omit<Attribute, "id">>(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [localSeed, setLocalSeed] = useState<Attribute[]>([]);
  const [removedSeedIds, setRemovedSeedIds] = useState<Set<number>>(new Set());
  const [assignValuesAttr, setAssignValuesAttr] = useState<Attribute | null>(null);

  const baseSeed = categoryName ? (SEED_ATTRIBUTES[categoryName] ?? []) : [];
  const activeSeed = baseSeed
    .filter((a) => !removedSeedIds.has(a.id))
    .map((a) => localSeed.find((ls) => ls.id === a.id) ?? a);
  const allAttrs = [...activeSeed, ...attributes];

  const handleClose = () => {
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setEditingAttr(null);
    setDeleteConfirmId(null);
    onClose();
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onSave({ id: Date.now(), ...form });
    setForm(EMPTY_FORM);
    setFormOpen(false);
  };

  const startEdit = (attr: Attribute) => {
    setEditingAttr(attr);
    setEditForm({
      name: attr.name, placeholder: attr.placeholder, sortOrder: attr.sortOrder,
      isVariant: attr.isVariant, valueType: attr.valueType, selectType: attr.selectType,
    });
    setDeleteConfirmId(null);
  };

  const handleUpdate = () => {
    if (!editingAttr || !editForm.name.trim()) return;
    const updated = { ...editingAttr, ...editForm };
    if (editingAttr.isDefault) {
      setLocalSeed((prev) => {
        const exists = prev.find((a) => a.id === editingAttr.id);
        return exists ? prev.map((a) => (a.id === editingAttr.id ? updated : a)) : [...prev, updated];
      });
    } else {
      onUpdate?.(updated);
    }
    setEditingAttr(null);
    setEditForm(EMPTY_FORM);
  };

  const handleDelete = (attr: Attribute) => {
    if (attr.isDefault) setRemovedSeedIds((prev) => new Set([...prev, attr.id]));
    else onDelete?.(attr.id);
    setDeleteConfirmId(null);
    if (editingAttr?.id === attr.id) setEditingAttr(null);
  };

  const handleAttrValuesUpdate = (updated: Attribute) => {
    if (updated.isDefault) {
      setLocalSeed((prev) => {
        const exists = prev.find((a) => a.id === updated.id);
        return exists ? prev.map((a) => (a.id === updated.id ? updated : a)) : [...prev, updated];
      });
    } else {
      onUpdate?.(updated);
    }
    setAssignValuesAttr(updated);
  };

  const TABLE_HEADERS = ["Name", "Variant", "Order", "Type", "Value Type", "Placeholder", "Actions", "Assign"];

  return (
    <>
      {/* ── Main list modal ── */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="p-0 gap-0 overflow-hidden border border-gray-200"
          style={{
            width: "calc(100vw - 16px)",
            maxWidth: 900,
            /* Fixed height — no outer scrollbar ever */
            height: "calc(100dvh - 48px)",
            maxHeight: 680,
            borderRadius: 18,
            boxShadow: "0 24px 80px rgba(0,0,0,0.14)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3.5 shrink-0"
            style={{ backgroundColor: BRAND }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Tag size={14} className="text-teal-300 shrink-0" />
              <DialogTitle className="text-[14px] font-bold text-white truncate">
                {categoryName} — Attributes
              </DialogTitle>
              <span className="text-[11px] text-teal-300 shrink-0 ml-1">
                {allAttrs.length} total
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Add Attribute button */}
              <button
                onClick={() => { setForm(EMPTY_FORM); setFormOpen(true); }}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/15 text-white text-[12px] font-semibold hover:bg-white/25 transition-colors"
              >
                <Plus size={13} />
                Add Attribute
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-teal-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Table header — sticky, never scrolls */}
          <div className="shrink-0 overflow-x-auto bg-gray-50 border-b">
            <table className="w-full text-left" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>

          {/* Table body — ONLY this area scrolls */}
          <div className="flex-1 overflow-y-auto overflow-x-auto" style={{ minHeight: 0 }}>
            {allAttrs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
                  <Tag size={22} />
                </div>
                <p className="text-[13px] font-semibold text-gray-400">No attributes yet</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Click "Add Attribute" in the top-right to get started
                </p>
                <button
                  onClick={() => { setForm(EMPTY_FORM); setFormOpen(true); }}
                  className="mt-4 flex items-center gap-1.5 h-9 px-4 rounded-xl text-white text-[13px] font-semibold transition-colors"
                  style={{ backgroundColor: BRAND }}
                >
                  <Plus size={14} /> Add First Attribute
                </button>
              </div>
            ) : (
              <table className="w-full text-left" style={{ minWidth: 640 }}>
                <tbody className="divide-y divide-gray-100">
                  {allAttrs.map((attr) => {
                    const isEditingThis = editingAttr?.id === attr.id;
                    const isDelConfirm = deleteConfirmId === attr.id;

                    return (
                      <tr
                        key={attr.id}
                        className={`transition-colors ${
                          isDelConfirm ? "bg-red-50" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Name */}
                        <td className="px-3 py-2.5 min-w-[110px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold text-gray-800 whitespace-nowrap">
                              {attr.name}
                            </span>
                            {attr.isDefault && (
                              <Badge className="h-4 px-1 text-[8px] bg-gray-50 text-gray-400 border border-gray-200">
                                DEF
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Variant */}
                        <td className="px-3 py-2.5 min-w-[100px]">
                          {attr.isVariant ? (
                            <span className="text-[12px] font-semibold text-green-600">Available</span>
                          ) : (
                            <span className="text-[12px] font-semibold text-red-400">Not Available</span>
                          )}
                        </td>

                        {/* Sort Order */}
                        <td className="px-3 py-2.5 text-[13px] text-gray-500 min-w-[55px]">
                          {attr.sortOrder || "—"}
                        </td>

                        {/* Select Type */}
                        <td className="px-3 py-2.5 min-w-[80px]">
                          <span className="text-[12px] text-gray-700 capitalize">{attr.selectType}</span>
                        </td>

                        {/* Value Type */}
                        <td className="px-3 py-2.5 min-w-[75px]">
                          <span className="text-[12px] text-gray-700 capitalize">{attr.valueType}</span>
                        </td>

                        {/* Placeholder */}
                        <td className="px-3 py-2.5 min-w-[110px]">
                          <span className="text-[12px] text-gray-500 line-clamp-1 max-w-[130px]">
                            {attr.placeholder || <span className="text-gray-300 italic">—</span>}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-2.5 min-w-[90px]">
                          {isDelConfirm ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(attr)}
                                className="flex items-center gap-0.5 h-7 px-2 rounded-lg bg-red-500 text-white text-[11px] font-semibold hover:bg-red-600 transition-colors"
                              >
                                <Check size={10} /> Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(attr)}
                                title="Edit"
                                className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => { setDeleteConfirmId(attr.id); setEditingAttr(null); }}
                                title="Delete"
                                className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Assign Value */}
                        <td className="px-3 py-2.5 min-w-[65px]">
                          <button
                            onClick={() => setAssignValuesAttr(attr)}
                            title="Assign Values"
                            className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 hover:border-teal-400 hover:bg-teal-50 group transition-colors"
                          >
                            <ListPlus size={14} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Attribute modal ── */}
      <AttrFormModal
        open={formOpen}
        isEdit={false}
        form={form}
        onChange={setForm}
        onSubmit={handleAdd}
        onClose={() => { setFormOpen(false); setForm(EMPTY_FORM); }}
      />

      {/* ── Edit Attribute modal ── */}
      <AttrFormModal
        open={!!editingAttr}
        isEdit={true}
        form={editForm}
        onChange={setEditForm}
        onSubmit={handleUpdate}
        onClose={() => { setEditingAttr(null); setEditForm(EMPTY_FORM); }}
      />

      {/* ── Assign Values modal ── */}
      <AssignValuesModal
        open={!!assignValuesAttr}
        attr={assignValuesAttr}
        onClose={() => setAssignValuesAttr(null)}
        onUpdate={handleAttrValuesUpdate}
      />
    </>
  );
}