"use client";
import { useState } from "react";
import {
  Search, X, Package, ChevronRight,
  MapPin, Calendar,
} from "lucide-react";

import OrderDetailPanel, { Order, OrderStatus, STATUS_CFG } from "../../../components/orders/Orderdetailpanel";

const ORDERS: Order[] = [
  {
    id: "ORD-7841", customer: "Ahmed Raza", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    email: "ahmed.raza@gmail.com", phone: "+92 300 1234567",
    address: "House 12, Block B, Gulshan-e-Iqbal", city: "Karachi", country: "Pakistan",
    status: "Delivered", payMethod: "Card", date: "Feb 14, 2025", deliveryEta: "Feb 17, 2025",
    items: [
      { name: "Premium Smartwatch Pro", qty: 1, price: 299, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" },
      { name: "Wireless Earbuds Elite", qty: 2, price: 149, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop" },
    ],
    subtotal: 597, shipping: 0, discount: 30, total: 567, note: "Please leave at door.",
  },
  {
    id: "ORD-7842", customer: "Sara Khan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    email: "sara.k@outlook.com", phone: "+92 321 9876543",
    address: "Flat 5, Johar Town", city: "Lahore", country: "Pakistan",
    status: "Shipped", payMethod: "Cash on Delivery", date: "Feb 18, 2025", deliveryEta: "Feb 22, 2025",
    items: [
      { name: "Instant Camera Mini", qty: 1, price: 89, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop" },
    ],
    subtotal: 89, shipping: 10, discount: 0, total: 99, note: "",
  },
  {
    id: "ORD-7843", customer: "Bilal Hussain", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal",
    email: "bilal.h@yahoo.com", phone: "+92 333 5551234",
    address: "Street 7, F-10", city: "Islamabad", country: "Pakistan",
    status: "Processing", payMethod: "Bank Transfer", date: "Feb 19, 2025", deliveryEta: "Feb 25, 2025",
    items: [
      { name: "Gaming Laptop 16\" RTX", qty: 1, price: 1499, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=80&h=80&fit=crop" },
    ],
    subtotal: 1499, shipping: 0, discount: 75, total: 1424, note: "Gift wrap please.",
  },
  {
    id: "ORD-7844", customer: "Maryam Tariq", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maryam",
    email: "maryam.t@gmail.com", phone: "+92 312 7779988",
    address: "45 Canal Road", city: "Faisalabad", country: "Pakistan",
    status: "Cancelled", payMethod: "Card", date: "Feb 10, 2025", deliveryEta: "—",
    items: [
      { name: "Running Shoes X500",       qty: 1, price: 120, image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=80&h=80&fit=crop" },
      { name: "UV Protection Sunglasses", qty: 1, price: 45,  image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop" },
    ],
    subtotal: 165, shipping: 5, discount: 0, total: 170, note: "",
  },
  {
    id: "ORD-7845", customer: "Zara Noor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara",
    email: "zara.noor@gmail.com", phone: "+92 301 2223344",
    address: "Plot 9, DHA Phase 6", city: "Karachi", country: "Pakistan",
    status: "Delivered", payMethod: "Card", date: "Feb 5, 2025", deliveryEta: "Feb 8, 2025",
    items: [
      { name: "Leather Crossbody Bag", qty: 2, price: 75,  image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80&h=80&fit=crop" },
      { name: "Refurb iPhone 13",      qty: 1, price: 549, image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=80&h=80&fit=crop" },
    ],
    subtotal: 699, shipping: 0, discount: 50, total: 649, note: "",
  },
  {
    id: "ORD-7846", customer: "Hamza Sheikh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza",
    email: "hamza.s@gmail.com", phone: "+92 311 4445566",
    address: "University Road", city: "Peshawar", country: "Pakistan",
    status: "Returned", payMethod: "Cash on Delivery", date: "Jan 28, 2025", deliveryEta: "—",
    items: [
      { name: "Wireless Earbuds Elite", qty: 1, price: 149, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop" },
    ],
    subtotal: 149, shipping: 10, discount: 0, total: 159, note: "Item was defective.",
  },
  {
    id: "ORD-7847", customer: "Farah Siddiqui", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farah",
    email: "farah.sid@mail.com", phone: "+92 322 6667788",
    address: "Mission Road", city: "Quetta", country: "Pakistan",
    status: "Processing", payMethod: "Bank Transfer", date: "Feb 20, 2025", deliveryEta: "Feb 26, 2025",
    items: [
      { name: "Premium Smartwatch Pro", qty: 1, price: 299, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" },
      { name: "Instant Camera Mini",    qty: 1, price: 89,  image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=80&h=80&fit=crop" },
    ],
    subtotal: 388, shipping: 0, discount: 20, total: 368, note: "",
  },
];

export default function OrdersPage() {
  const [search, setSearch]             = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [selected, setSelected]         = useState<Order | null>(null);

  const visible = ORDERS.filter(o => {
    const ms = o.id.toLowerCase().includes(search.toLowerCase()) ||
               o.customer.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "All" || o.status === statusFilter;
    return ms && mf;
  });

  const revenue = ORDERS
    .filter(o => o.status !== "Cancelled" && o.status !== "Returned")
    .reduce((s, o) => s + o.total, 0);

  const tabs: { key: OrderStatus | "All"; label: string; dot?: string }[] = [
    { key: "All",        label: `All (${ORDERS.length})` },
    { key: "Processing", label: "Processing",  dot: "bg-amber-400"   },
    { key: "Shipped",    label: "Shipped",      dot: "bg-blue-500"    },
    { key: "Delivered",  label: "Delivered",    dot: "bg-emerald-500" },
    { key: "Cancelled",  label: "Cancelled",    dot: "bg-red-500"     },
    { key: "Returned",   label: "Returned",     dot: "bg-purple-500"  },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-sm text-gray-700">
      <div className="bg-white border-b border-gray-200 px-6 pt-6 pb-0">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#0a3d47" }}>Store</p>
            <h1 className="text-2xl font-extrabold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders</p>
          </div>
          <div className="text-right mt-1">
            <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
            <p className="text-xl font-extrabold" style={{ color: "#0a3d47" }}>${revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-0.5 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 relative bottom-[-1px] transition-colors
                ${statusFilter === t.key
                  ? "bg-gray-50 border-gray-200 text-gray-900"
                  : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {t.dot && <span className={`w-2 h-2 rounded-full ${t.dot}`} />}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-3 flex items-center gap-3 mt-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            className="w-full pl-9 h-10 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#0a3d47]/20 focus:border-[#0a3d47] transition-all"
            placeholder="Search by order ID or customer name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 ml-auto whitespace-nowrap">
          {visible.length} of {ORDERS.length} orders
        </p>
      </div>

      <div className="pb-10 space-y-2.5">
        {visible.length > 0 ? (
          visible.map(order => {
            const cfg       = STATUS_CFG[order.status];
            const Icon      = cfg.icon;
            const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-md hover:border-gray-300 hover:shadow-md transition-all duration-150 cursor-pointer group"
                onClick={() => setSelected(order)}
              >
                <div className="px-5 py-4 flex items-center gap-4 cursor-pointer">
                  <img
                    src={order.avatar}
                    alt={order.customer}
                    className="w-11 h-11 rounded-xl border border-gray-100 flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">{order.customer}</p>
                      <code className="text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">
                        {order.id}
                      </code>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{order.date}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{order.city}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Package className="h-3 w-3" />{itemCount} item{itemCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center -space-x-2 flex-shrink-0">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right min-w-[56px]">
                    <p className="text-base font-extrabold text-gray-900">${order.total.toLocaleString()}</p>
                    <p className="text-[11px] text-gray-400">{order.payMethod}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border ${cfg.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {order.status}
                    </span>
                  </div>

                  <div className="flex-shrink-0 cursor-pointer w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600 transition-all">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
            <div
              className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 border"
              style={{ backgroundColor: "#0a3d4710", borderColor: "#0a3d4720" }}
            >
              <Package className="h-5 w-5" style={{ color: "#0a3d47" }} />
            </div>
            <p className="font-semibold text-gray-700 mb-1">No orders found</p>
            <p className="text-xs text-gray-400">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {selected && (
        <OrderDetailPanel
          order={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}