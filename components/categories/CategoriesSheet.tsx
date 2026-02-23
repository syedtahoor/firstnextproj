"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";

const BRAND = "#0a3d47";

interface Category { id: number; name: string; }

interface FormState {
  name: string; sort: string; desc: string;
  type: "Product" | "Service"; parent: string;
}

interface Props {
  open: boolean;
  editId: number | null;
  form: FormState;
  allCategories: Category[];
  onFormChange: (f: FormState) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function CategoriesSheet({ open, editId, form, allCategories, onFormChange, onClose, onSave }: Props) {
  const set = (patch: Partial<FormState>) => onFormChange({ ...form, ...patch });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      {/*
        On mobile  → full width sheet from the bottom (side="bottom")
        On desktop → 420px sheet from the right (side="right")
        We achieve this by using a responsive wrapper trick:
        The SheetContent uses side="right" but on small screens we override
        positioning via className so it behaves like a bottom sheet.
      */}
      <SheetContent
        side="right"
        className="
          /* Mobile: slide up from bottom, full width, rounded top corners */
          fixed bottom-0 left-0 right-0 top-auto w-full max-h-[92dvh] rounded-t-2xl
          /* Desktop: slide in from right, fixed width */
          sm:top-0 sm:bottom-0 sm:left-auto sm:right-0 sm:w-[420px] sm:max-w-[420px] sm:max-h-full sm:rounded-none
          flex flex-col p-0 gap-0 overflow-hidden
        "
      >
        <SheetHeader className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 border-b border-gray-200 flex-shrink-0">
          {/* Mobile drag handle */}
          <div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <SheetTitle className="text-[15px] font-bold text-gray-900">
            {editId !== null ? "Edit Category" : "New Category"}
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-400">
            {editId !== null ? "Update the details below" : "Fill in details to create a new category"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-4">
          {/* Name + Sort */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-gray-700">Title *</Label>
              <Input
                className="h-9 text-[13px]"
                placeholder="e.g. Electronics"
                value={form.name}
                onChange={e => set({ name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-gray-700">Sort Number</Label>
              <Input
                className="h-9 text-[13px]"
                type="number"
                placeholder="0"
                value={form.sort}
                onChange={e => set({ sort: e.target.value })}
              />
            </div>
          </div>

          {/* Type + Parent — stack on very small screens */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-gray-700">Category For</Label>
              <Select value={form.type} onValueChange={(v: "Product" | "Service") => set({ type: v })}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-gray-700">Parent Category</Label>
              <Select value={form.parent || "none"} onValueChange={v => set({ parent: v === "none" ? "" : v })}>
                <SelectTrigger className="h-9 text-[13px]"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {allCategories.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">Description</Label>
            <Textarea
              className="text-[13px] min-h-[72px] resize-y"
              placeholder="Optional details…"
              value={form.desc}
              onChange={e => set({ desc: e.target.value })}
            />
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">Category Image</Label>
            <label className="flex items-center gap-2.5 border border-dashed border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors">
              <span className="bg-white border border-gray-200 rounded-md px-2.5 py-1 text-[11.5px] font-semibold text-gray-600 whitespace-nowrap">Choose file</span>
              <span className="text-xs text-gray-400 truncate">No file chosen</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <SheetFooter className="px-5 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 flex flex-row gap-2 justify-end flex-shrink-0">
          <Button variant="outline" size="sm" className="text-xs flex-1 sm:flex-none" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs text-white hover:opacity-90 flex-1 sm:flex-none"
            style={{ backgroundColor: BRAND }}
            onClick={onSave}
          >
            {editId !== null ? "Update Category" : "Save Category"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}