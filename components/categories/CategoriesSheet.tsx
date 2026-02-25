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
  name: string;
  sort: string;
  desc: string;
  type: "Product" | "Service";
  parent: string;
  image: File | null;
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

export default function CategoriesSheet({
  open,
  editId,
  form,
  allCategories,
  onFormChange,
  onClose,
  onSave
}: Props) {

  const set = (patch: Partial<FormState>) =>
    onFormChange({ ...form, ...patch });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="
          fixed bottom-0 left-0 right-0 top-auto w-full max-h-[92dvh] rounded-t-2xl
          sm:top-0 sm:bottom-0 sm:left-auto sm:right-0 sm:w-[420px] sm:max-w-[420px] sm:max-h-full sm:rounded-none
          flex flex-col p-0 gap-0 overflow-hidden
        "
      >
        <SheetHeader className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 border-b border-gray-200 flex-shrink-0">
          <div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <SheetTitle className="text-[15px] font-bold text-gray-900">
            {editId !== null ? "Edit Category" : "Add Category"}
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-400">
            {editId !== null ? "Update category details below" : "Fill details to create category"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-4">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Title
            </Label>
            <Input
              className="h-9 text-[13px]"
              placeholder="Category Name Ex : Mobile, Laptop, Electronics, jewelry"
              value={form.name}
              onChange={e => set({ name: e.target.value })}
            />
          </div>

          {/* Sort Number */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Sort Number
            </Label>
            <Input
              type="number"
              className="h-9 text-[13px]"
              placeholder="0"
              value={form.sort}
              onChange={e => set({ sort: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              className="text-[13px] min-h-[80px] resize-y"
              placeholder="Description Ex : Details about the category"
              value={form.desc}
              onChange={e => set({ desc: e.target.value })}
            />
          </div>

          {/* Category Image */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Category Image
            </Label>
            <label className="flex items-center gap-2.5 border border-dashed border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 cursor-pointer hover:border-gray-400 transition-colors">
              <span className="bg-white border border-gray-200 rounded-md px-2.5 py-1 text-[11.5px] font-semibold text-gray-600 whitespace-nowrap">
                Choose file
              </span>
              <span className="text-xs text-gray-400 truncate">
                {form.image ? form.image.name : "No file chosen"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  set({ image: e.target.files ? e.target.files[0] : null })
                }
              />
            </label>
          </div>

          {/* Category For */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Category For
            </Label>
            <Select
              value={form.type}
              onValueChange={(v: "Product" | "Service") =>
                set({ type: v, parent: "" })  
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

          {/* Parent Category */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-gray-700">
              Select Parent Category
            </Label>
            <Select
              value={form.parent || "none"}
              onValueChange={v => set({ parent: v === "none" ? "" : v })}
            >
              <SelectTrigger className="h-9 text-[13px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select an option</SelectItem>
                {allCategories.map(c => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <SheetFooter className="px-5 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 flex flex-row gap-2 justify-end flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1 sm:flex-none"
            onClick={onClose}
          >
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