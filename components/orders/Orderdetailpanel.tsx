"use client";
import { createPortal } from "react-dom";
import {
  X, CheckCircle2, Truck, Clock, XCircle, RotateCcw,
  User, MapPin, ShoppingBag, CreditCard, Calendar, AlertCircle,
} from "lucide-react";

export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled" | "Returned";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: OrderStatus;
  payMethod: string;
  date: string;
  deliveryEta: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  note: string;
}

export const STATUS_CFG: Record<OrderStatus, {
  icon: React.ElementType;
  pill: string;
  dot: string;
  steps: string[];
  doneUpto: number;
}> = {
  Processing: {
    icon: Clock,
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    steps: ["Order Placed", "Processing", "Shipped", "Delivered"],
    doneUpto: 1,
  },
  Shipped: {
    icon: Truck,
    pill: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    steps: ["Order Placed", "Processing", "Shipped", "Delivered"],
    doneUpto: 2,
  },
  Delivered: {
    icon: CheckCircle2,
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    steps: ["Order Placed", "Processing", "Shipped", "Delivered"],
    doneUpto: 3,
  },
  Cancelled: {
    icon: XCircle,
    pill: "bg-red-100 text-red-600 border-red-200",
    dot: "bg-red-500",
    steps: ["Order Placed", "Cancelled"],
    doneUpto: 1,
  },
  Returned: {
    icon: RotateCcw,
    pill: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    steps: ["Order Placed", "Delivered", "Return Requested", "Returned"],
    doneUpto: 3,
  },
};

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  const cfg = STATUS_CFG[order.status];
  const Icon = cfg.icon;

  const modalContent = (
    <>
      <style>{`
        @keyframes backdropIn { from { opacity: 0 }               to { opacity: 1 } }
        @keyframes panelIn    { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes panelInUp  { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        style={{ animation: "backdropIn .2s ease" }}
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, right slide on md+ */}
      <div
        className="fixed z-50 bg-white shadow-2xl flex flex-col
          bottom-0 left-0 right-0 rounded-t-2xl max-h-[92dvh]
          md:bottom-auto md:right-0 md:top-0 md:left-auto md:w-full md:max-w-2xl md:rounded-none md:max-h-full md:h-full"
        style={{
          animation: "panelInUp .3s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Accent bar — desktop only */}
        <div className="hidden md:block h-1 w-full flex-shrink-0" style={{ backgroundColor: "#0a3d47" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-semibold text-gray-400 mb-0.5">Order Details</p>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base md:text-lg font-bold text-gray-900">{order.id}</h2>
              <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${cfg.pill}`}>
                <Icon className="h-3 w-3" />
                {order.status}
              </span>
            </div>
            <p className="text-[11px] md:text-xs text-gray-400 mt-0.5 flex items-center gap-1 flex-wrap">
              <Calendar className="h-3 w-3 flex-shrink-0" /> {order.date}
              {order.deliveryEta !== "—" && <> · ETA: {order.deliveryEta}</>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors flex-shrink-0 ml-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Progress tracker */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Order Progress</p>
            <div className="flex items-center overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {cfg.steps.map((step, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 transition-all"
                      style={
                        i <= cfg.doneUpto
                          ? { backgroundColor: "#0a3d47", borderColor: "#0a3d47" }
                          : { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }
                      }
                    >
                      {i <= cfg.doneUpto
                        ? <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                        : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                    </div>
                    <span
                      className={`text-[9px] md:text-[10px] font-semibold mt-1 text-center leading-tight w-12 md:max-w-[52px] ${i <= cfg.doneUpto ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < cfg.steps.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-1 mb-4 rounded min-w-[8px]"
                      style={{ backgroundColor: i < cfg.doneUpto ? "#0a3d47" : "#e5e7eb" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: "#0a3d4709" }}>
              <User className="h-3.5 w-3.5" style={{ color: "#0a3d47" }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#0a3d47" }}>Customer Info</p>
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <img
                src={order.avatar}
                alt={order.customer}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-gray-100 object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm">{order.customer}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{order.email}</p>
                <p className="text-xs text-gray-500">{order.phone}</p>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: "#0a3d4709" }}>
              <MapPin className="h-3.5 w-3.5" style={{ color: "#0a3d47" }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#0a3d47" }}>Delivery Address</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">{order.address}</p>
              <p className="text-xs text-gray-500 mt-0.5">{order.city}, {order.country}</p>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: "#0a3d4709" }}>
              <ShoppingBag className="h-3.5 w-3.5" style={{ color: "#0a3d47" }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#0a3d47" }}>
                Items ({order.items.length})
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-gray-100 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty} × ${item.price}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    ${item.price * item.qty}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: "#0a3d4709" }}>
              <CreditCard className="h-3.5 w-3.5" style={{ color: "#0a3d47" }} />
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#0a3d47" }}>Payment</p>
            </div>
            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-700">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Shipping</span>
                <span className={`font-semibold ${order.shipping === 0 ? "text-emerald-600" : "text-gray-700"}`}>
                  {order.shipping === 0 ? "Free" : `$${order.shipping}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Discount</span>
                  <span className="font-semibold text-rose-500">−${order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span style={{ color: "#0a3d47" }}>${order.total}</span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 pt-1">
                <CreditCard className="h-3 w-3" /> {order.payMethod}
              </p>
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 flex gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 mb-0.5">Customer Note</p>
                <p className="text-xs text-amber-700 leading-relaxed">{order.note}</p>
              </div>
            </div>
          )}

          {/* Bottom safe area for mobile */}
          <div className="h-4 md:hidden" />
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}