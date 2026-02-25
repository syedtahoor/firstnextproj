"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Check, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const BRAND = "#0a3d47";
const ITEMS_PER_PAGE = 10;

export interface AttributeValue {
    id: number;
    value: string;
}

export interface Attribute {
    id: number;
    name: string;
    placeholder: string;
    sortOrder: number;
    isVariant: boolean;
    valueType: "text" | "number";
    selectType: "dropdown" | "checkbox" | "radio" | "textbox";
    isDefault?: boolean;
    values?: AttributeValue[];
}

interface Props {
    open: boolean;
    attr: Attribute | null;
    onClose: () => void;
    onUpdate: (attr: Attribute) => void;
}

export default function AssignValuesModal({ open, attr, onClose, onUpdate }: Props) {
    const [inputValue, setInputValue] = useState("");
    const [editingValueId, setEditingValueId] = useState<number | null>(null);
    const [editingValueText, setEditingValueText] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [page, setPage] = useState(1);

    if (!attr) return null;

    const values = attr.values ?? [];
    const totalPages = Math.max(1, Math.ceil(values.length / ITEMS_PER_PAGE));
    const pageValues = values.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleAssign = () => {
        if (!inputValue.trim()) return;
        const newValues = [...values, { id: Date.now(), value: inputValue.trim() }];
        onUpdate({ ...attr, values: newValues });
        setInputValue("");
        setPage(Math.ceil(newValues.length / ITEMS_PER_PAGE));
    };

    const handleEditSave = (id: number) => {
        if (!editingValueText.trim()) return;
        onUpdate({ ...attr, values: values.map((v) => (v.id === id ? { ...v, value: editingValueText.trim() } : v)) });
        setEditingValueId(null);
    };

    const handleDelete = (id: number) => {
        const newValues = values.filter((v) => v.id !== id);
        onUpdate({ ...attr, values: newValues });
        setDeleteConfirmId(null);
        const newTotal = Math.max(1, Math.ceil(newValues.length / ITEMS_PER_PAGE));
        if (page > newTotal) setPage(newTotal);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="p-0 gap-0 overflow-hidden border border-gray-200 [&>button]:hidden"
                style={{
                    maxWidth: 520,
                    width: "calc(100vw - 24px)",
                    borderRadius: 16,
                    boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                    <DialogTitle className="text-[15px] font-bold text-gray-900">
                        Add Values of Attribute
                    </DialogTitle>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Attribute tag */}
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-500">Attribute:</span>
                        <span
                            className="text-[12px] font-bold px-2 py-0.5 rounded-lg text-white"
                            style={{ backgroundColor: BRAND }}
                        >
                            {attr.name}
                        </span>
                    </div>

                    {/* Input */}
                    <div>
                        <Label className="text-[12px] font-semibold text-gray-600">Attribute Value</Label>
                        <div className="flex gap-2 mt-1.5">
                            <Input
                                className="flex-1 h-10 text-[13px] rounded-lg"
                                placeholder="e.g. Red, Blue, 128GB..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAssign()}
                            />
                            <Button
                                className="h-10 px-4 text-[13px] text-white font-semibold rounded-lg shrink-0"
                                style={{ backgroundColor: BRAND }}
                                onClick={handleAssign}
                                disabled={!inputValue.trim()}
                            >
                                Assign Value
                            </Button>
                        </div>
                    </div>

                    {/* Values table */}
                    {values.length > 0 ? (
                        <div className="border rounded-xl overflow-hidden">
                            <div className="grid grid-cols-[1fr_auto] bg-gray-50 border-b px-4 py-2.5">
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Values</span>
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Actions</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {pageValues.map((v) => (
                                    <div
                                        key={v.id}
                                        className="grid grid-cols-[1fr_auto] items-center px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                    >
                                        {editingValueId === v.id ? (
                                            <div className="flex items-center gap-2 pr-3">
                                                <Input
                                                    className="h-7 text-[13px] rounded-lg flex-1"
                                                    value={editingValueText}
                                                    onChange={(e) => setEditingValueText(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleEditSave(v.id)}
                                                    autoFocus
                                                />
                                                <button onClick={() => handleEditSave(v.id)} className="flex items-center justify-center h-7 w-7 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shrink-0"><Check size={12} /></button>
                                                <button onClick={() => setEditingValueId(null)} className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors shrink-0"><X size={12} /></button>
                                            </div>
                                        ) : (
                                            <span className="text-[13px] text-gray-800">{v.value}</span>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            {deleteConfirmId === v.id ? (
                                                <>
                                                    <button onClick={() => handleDelete(v.id)} className="flex items-center gap-1 h-7 px-2 rounded-lg bg-red-500 text-white text-[11px] font-semibold hover:bg-red-600 transition-colors"><Check size={10} /> Yes</button>
                                                    <button onClick={() => setDeleteConfirmId(null)} className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors"><X size={11} /></button>
                                                </>
                                            ) : editingValueId !== v.id ? (
                                                <>
                                                    <button onClick={() => { setEditingValueId(v.id); setEditingValueText(v.value); setDeleteConfirmId(null); }} className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"><Pencil size={12} /></button>
                                                    <button onClick={() => setDeleteConfirmId(v.id)} className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"><Trash2 size={12} /></button>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between px-4 py-2.5 border-t bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={13} /></button>
                                    <span className="text-[12px] text-gray-500">Page {page} of {totalPages}</span>
                                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight size={13} /></button>
                                </div>
                                <span className="text-[12px] text-gray-400">
                                    Show <span className="font-semibold text-gray-600">{ITEMS_PER_PAGE}</span>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400">
                            <p className="text-[13px]">No values added yet. Type above and click "Assign Value".</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}