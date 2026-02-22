"use client";
import { useState } from "react";
import {
    MessageSquarePlus, Trash2, Edit2, Send,
    Search, X, ChevronLeft, ChevronRight,
    MessageCircle, Clock, CheckCheck, AlertCircle,
} from "lucide-react";

interface Message {
    id: number;
    text: string;
    createdAt: string;
}

const INITIAL_MESSAGES: Message[] = [
    { id: 1, text: "I would like to buy this, are there any more stocks?", createdAt: "Feb 14, 2025 · 10:32 AM" },
    { id: 2, text: "Can you provide more details about this item?", createdAt: "Feb 15, 2025 · 02:14 PM" },
    { id: 3, text: "Are there any defects or issues with the item?", createdAt: "Feb 17, 2025 · 09:05 AM" },
    { id: 4, text: "Where would be a convenient meetup spot for us?", createdAt: "Feb 18, 2025 · 04:47 PM" },
    { id: 5, text: "Is the price negotiable?", createdAt: "Feb 19, 2025 · 11:20 AM" },
    { id: 6, text: "Can you ship this to Lahore?", createdAt: "Feb 20, 2025 · 06:30 PM" },
    { id: 7, text: "What is the warranty period for this product?", createdAt: "Feb 21, 2025 · 08:00 AM" },
];

const PAGE_SIZE = 5;

const STATUS_CFG = {
    Sent: { cls: "bg-blue-100 text-blue-600 border-blue-200", icon: Send, dot: "bg-blue-500" },
    Read: { cls: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCheck, dot: "bg-emerald-500" },
    Pending: { cls: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, dot: "bg-amber-400" },
};

function EditModal({ message, onSave, onClose }: {
    message: Message;
    onSave: (id: number, text: string) => void;
    onClose: () => void;
}) {
    const [text, setText] = useState(message.text);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="h-1 w-full" style={{ backgroundColor: "#0a3d47" }} />
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "#0a3d47" }}>Edit</p>
                        <h2 className="text-lg font-extrabold text-gray-900">Update Message</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="px-6 py-5">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Message</label>
                    <textarea
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 resize-none"
                        style={{ "--tw-ring-color": "#0a3d47" } as React.CSSProperties}
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                </div>
                <div className="px-6 pb-5 flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={() => { onSave(message.id, text); onClose(); }}
                        disabled={!text.trim()}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
                        style={{ backgroundColor: "#0a3d47" }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AskMessagePage() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [editMsg, setEditMsg] = useState<Message | null>(null);

    const handleSubmit = () => {
        if (!input.trim()) return;
        const newMsg: Message = {
            id: Date.now(),
            text: input.trim(),
            createdAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        };
        setMessages(prev => [newMsg, ...prev]);
        setInput("");
        setPage(1);
    };

    const handleDelete = (id: number) => setMessages(m => m.filter(x => x.id !== id));
    const handleEdit = (id: number, text: string) => setMessages(m => m.map(x => x.id === id ? { ...x, text } : x));

    const filtered = messages.filter(m => m.text.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="min-h-screen font-sans text-sm text-gray-700">
            <div className="bg-white border-b rounded-lg border-gray-200 px-6 pt-6 pb-5">
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#0a3d47" }}>Support</p>
                <h1 className="text-2xl font-extrabold text-gray-900">Ask a Message</h1>
                <p className="text-sm text-gray-500 mt-1">Send a message to the seller and manage your inquiries</p>
            </div>

            <div className="py-5 space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-5">
                            <div className="h-1 w-full" style={{ backgroundColor: "#0a3d47" }} />
                            <div className="px-5 pt-5 pb-2 flex items-center gap-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: "#0a3d4712" }}
                                >
                                    <MessageSquarePlus className="h-4 w-4" style={{ color: "#0a3d47" }} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">New Message</p>
                                    <p className="text-xs text-gray-400">Type your question below</p>
                                </div>
                            </div>

                            <div className="px-5 py-4 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message</label>
                                    <textarea
                                        rows={6}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleSubmit(); }}
                                        placeholder="e.g. Is the price negotiable? Can you ship to Lahore?"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent resize-none placeholder:text-gray-300 transition-all"
                                        style={{ "--tw-ring-color": "#0a3d4740" } as React.CSSProperties}
                                    />
                                    <p className="text-[11px] text-gray-400 mt-1">Tip: Press Ctrl + Enter to send</p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!input.trim()}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 hover:opacity-90 active:scale-[.98]"
                                    style={{ backgroundColor: "#0a3d47" }}
                                >
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </button>
                            </div>

                            <div className="mx-5 mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 flex gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-700 leading-relaxed">
                                    Be clear and specific in your message to get a faster response from the seller.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <input
                                className="w-full pl-9 h-10 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0a3d47]/20 focus:border-[#0a3d47] transition-all"
                                placeholder="Search messages…"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                            {search && (
                                <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-2.5">
                            {paginated.length > 0 ? paginated.map((msg, idx) => {
                                return (
                                    <div
                                        key={msg.id}
                                        className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                    >
                                        <div className="px-5 py-4 flex items-start gap-4">
                                            <div
                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5"
                                                style={{ backgroundColor: "#0a3d4710", color: "#0a3d47" }}
                                            >
                                                {(page - 1) * PAGE_SIZE + idx + 1}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800 font-medium leading-relaxed">{msg.text}</p>
                                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />{msg.createdAt}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditMsg(msg)}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
                                    <div
                                        className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 border"
                                        style={{ backgroundColor: "#0a3d4710", borderColor: "#0a3d4720" }}
                                    >
                                        <MessageCircle className="h-5 w-5" style={{ color: "#0a3d47" }} />
                                    </div>
                                    <p className="font-semibold text-gray-700 mb-1">No messages found</p>
                                    <p className="text-xs text-gray-400">
                                        {search ? "Try a different search term" : "Send your first message using the form"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {filtered.length > PAGE_SIZE && (
                            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    Page <span className="font-bold text-gray-700">{page}</span> of{" "}
                                    <span className="font-bold text-gray-700">{totalPages}</span>
                                    <span className="ml-2 text-gray-300">·</span>
                                    <span className="ml-2">{filtered.length} messages</span>
                                </p>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className="w-8 h-8 rounded-lg text-xs font-bold border transition-colors"
                                            style={n === page
                                                ? { backgroundColor: "#0a3d47", borderColor: "#0a3d47", color: "white" }
                                                : { backgroundColor: "white", borderColor: "#e5e7eb", color: "#6b7280" }}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {editMsg && (
                <EditModal
                    message={editMsg}
                    onSave={handleEdit}
                    onClose={() => setEditMsg(null)}
                />
            )}
        </div>
    );
}