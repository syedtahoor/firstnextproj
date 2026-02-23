"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Search, Inbox, Mail, Phone, MailOpen, Trash2, Send } from "lucide-react";

const mockQueries = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@gmail.com",
    phone: "+92 300 1234567",
    subject: "Website Redesign Inquiry",
    message:
      "Assalam o Alaikum, I want to discuss a complete website redesign for my business. Please let me know your availability and pricing details so we can move forward.",
    date: "Feb 23, 2025",
    time: "10:32 AM",
    status: "new",
  },
  {
    id: 2,
    name: "Sara Khan",
    email: "sara.khan@outlook.com",
    phone: "+92 321 9876543",
    subject: "E-commerce Development",
    message:
      "Hello, I need a full e-commerce solution with payment gateway integration for my clothing brand. Looking for a reliable developer.",
    date: "Feb 22, 2025",
    time: "03:15 PM",
    status: "read",
  },
  {
    id: 3,
    name: "Bilal Raza",
    email: "bilal.raza@company.pk",
    phone: "+92 333 5552211",
    subject: "Mobile App Development",
    message:
      "We need a cross-platform mobile app for our retail chain. Budget is flexible for the right developer. Please get in touch ASAP.",
    date: "Feb 22, 2025",
    time: "11:00 AM",
    status: "replied",
  },
  {
    id: 4,
    name: "Fatima Malik",
    email: "fatima@startup.io",
    phone: "+92 345 7890123",
    subject: "SEO & Digital Marketing",
    message:
      "Our startup needs help with SEO and digital marketing strategy. Can you provide a detailed proposal with pricing?",
    date: "Feb 21, 2025",
    time: "08:45 AM",
    status: "new",
  },
  {
    id: 5,
    name: "Usman Tariq",
    email: "usman.tariq@enterprise.com",
    phone: "+92 311 6543210",
    subject: "Corporate Portal Development",
    message:
      "We require an internal corporate portal with HR, attendance and payroll modules integrated. Timeline is 3 months.",
    date: "Feb 20, 2025",
    time: "05:22 PM",
    status: "read",
  },
  {
    id: 6,
    name: "Nadia Sheikh",
    email: "nadia.sheikh@mail.com",
    phone: "+92 322 1122334",
    subject: "Logo & Branding Package",
    message:
      "I need a complete branding package including logo, business card, and social media kit for my new salon.",
    date: "Feb 19, 2025",
    time: "02:10 PM",
    status: "replied",
  },
  {
    id: 7,
    name: "Hamza Ali",
    email: "hamza.ali@web.pk",
    phone: "+92 301 9988776",
    subject: "Landing Page Design",
    message:
      "I need a high-converting landing page for my digital product. Clean, modern, and fast. Please share your portfolio.",
    date: "Feb 18, 2025",
    time: "09:05 AM",
    status: "new",
  },
];

type Status = "new" | "read" | "replied";

const statusConfig: Record<Status, { label: string; className: string; dotColor: string }> = {
  new: {
    label: "New",
    className: "bg-[#d6f0f4] text-[#0a3d47] hover:bg-[#d6f0f4]",
    dotColor: "bg-[#0a3d47]",
  },
  read: {
    label: "Read",
    className: "bg-slate-100 text-slate-500 hover:bg-slate-100",
    dotColor: "bg-slate-400",
  },
  replied: {
    label: "Replied",
    className: "bg-green-100 text-green-700 hover:bg-green-100",
    dotColor: "bg-green-500",
  },
};

const avatarBgs = [
  "bg-[#0a3d47]", "bg-[#134e4a]", "bg-[#1e3a5f]",
  "bg-[#3b2a6e]", "bg-[#4a1942]", "bg-[#1a3a2a]", "bg-[#2d3a1a]",
];

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

export default function ContactQueriesPage() {
  const [selected, setSelected]     = useState<number | null>(null);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [reply, setReply]           = useState("");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const queries  = mockQueries.filter((q) => !deletedIds.includes(q.id));
  const filtered = queries.filter((q) => {
    const matchFilter = filter === "all" || q.status === filter;
    const matchSearch =
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const selectedQuery = queries.find((q) => q.id === selected);

  const counts = {
    all:     queries.length,
    new:     queries.filter((q) => q.status === "new").length,
    read:    queries.filter((q) => q.status === "read").length,
    replied: queries.filter((q) => q.status === "replied").length,
  };

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => [...prev, id]);
    if (selected === id) setSelected(null);
  };

  const handleSelect = (id: number) => {
    setSelected(id);
  };

  const filters = [
    { key: "all",     label: `All (${counts.all})`         },
    { key: "new",     label: `New (${counts.new})`         },
    { key: "read",    label: `Read (${counts.read})`       },
    { key: "replied", label: `Replied (${counts.replied})` },
  ] as const;

  // On mobile: show detail if selected, else show list
  const showDetailMobile = selected !== null && selectedQuery;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#f4f8f9] font-sans">

      {/* ── Filter + Search Bar ── */}
      <div className="flex-shrink-0 bg-white border-b border-[#e4eef0] px-4 md:px-8 py-3 flex items-center gap-2 md:gap-3 flex-wrap">

        {/* Mobile back button — only when detail is open */}
        {showDetailMobile && (
          <button
            onClick={() => setSelected(null)}
            className="md:hidden flex items-center gap-1 text-[#0a3d47] font-bold text-sm mr-1 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        {/* Search — always visible on desktop, hidden on mobile only when detail is open */}
        <div className={`relative w-full sm:max-w-[280px] sm:flex-1 md:max-w-[280px] md:flex-1 ${showDetailMobile ? "hidden md:block" : "block"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#b0c8cc]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queries..."
            className="pl-9 h-9 border-[#e0ecee] bg-[#f8fbfc] text-[#0a3d47] text-[13px] focus-visible:ring-[#0a3d47]/20"
          />
        </div>

        {/* Filter tabs — always visible on desktop, hidden on mobile when detail is open */}
        <div className={`flex gap-1 md:gap-1.5 overflow-x-auto flex-nowrap ${showDetailMobile ? "hidden md:flex" : "flex"}`} style={{ scrollbarWidth: "none" }}>
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 text-[11px] md:text-[12px] font-semibold h-8 whitespace-nowrap
                ${filter === f.key
                  ? "bg-[#0a3d47] hover:bg-[#0a3d47]/90 text-white border-none"
                  : "border-[#e0ecee] text-[#5a7a82] hover:bg-[#f0f9fb] hover:text-[#0a3d47]"
                }`}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Subject title — mobile only when detail is open */}
        {showDetailMobile && (
          <span className="md:hidden text-sm font-bold text-[#0a3d47] truncate flex-1">
            {selectedQuery.subject}
          </span>
        )}
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left: Query List ──
            Mobile: full width, hidden when detail is open
            Desktop: fixed 380px sidebar always visible
        */}
        <div
          className={`
            flex flex-col bg-white border-r border-[#e4eef0]
            w-full md:w-[380px] md:flex-shrink-0
            ${showDetailMobile ? "hidden md:flex" : "flex"}
          `}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-[#9ab5bb]">
                <div className="flex justify-center mb-2.5">
                  <Inbox className="h-10 w-10 text-[#b0c8cc]" />
                </div>
                <div className="text-sm font-semibold">No Contacts</div>
              </div>
            ) : (
              filtered.map((q, i) => {
                const s        = statusConfig[q.status as Status];
                const isActive = selected === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => handleSelect(q.id)}
                    className={`px-4 md:px-5 py-4 border-b border-[#f0f6f8] cursor-pointer transition-all duration-100
                      ${isActive
                        ? "bg-[#eef8fa] border-l-[3px] border-l-[#0a3d47]"
                        : "hover:bg-[#f8fbfc] border-l-[3px] border-l-transparent"
                      }`}
                  >
                    <div className="flex gap-3 items-start">
                      <div
                        className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-[12px] font-extrabold text-white
                          ${isActive ? "bg-[#0a3d47]" : avatarBgs[i % avatarBgs.length]}`}
                      >
                        {initials(q.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className={`text-[13px] text-[#0a3d47] truncate ${q.status === "new" ? "font-bold" : "font-medium"}`}>
                            {q.name}
                          </span>
                          <span className="text-[10px] text-[#aac5cb] flex-shrink-0 ml-1">{q.time}</span>
                        </div>
                        <div className="text-[12px] font-semibold text-[#2c6e7a] truncate mb-1">
                          {q.subject}
                        </div>
                        <div className="text-[11px] text-[#8aacb2] truncate mb-2">
                          {q.message}
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge className={`${s.className} text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                            <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.dotColor}`} />
                            {s.label}
                          </Badge>
                          <span className="text-[10px] text-[#b0c8cc]">{q.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Detail Panel ──
            Mobile: full width, shown only when a query is selected
            Desktop: flex-1, always visible
        */}
        <div
          className={`
            flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-8 py-4 md:py-6
            ${showDetailMobile ? "block" : "hidden md:block"}
          `}
        >
          {!selectedQuery ? (
            <div className="h-full flex flex-col items-center justify-center text-[#b0c8cc] min-h-[300px]">
              <div className="w-20 h-20 rounded-2xl bg-[#e4f0f3] flex items-center justify-center mb-4">
                <Mail className="h-9 w-9 text-[#7aacb5]" />
              </div>
              <div className="text-base font-bold text-[#7aacb5]">No Contact Query Found!</div>
              <div className="text-[13px] text-[#c0d8dc] mt-1">Press from the left side to view details</div>
            </div>
          ) : (
            <div className="max-w-[680px] mx-auto space-y-4">

              {/* Sender Card */}
              <Card className="shadow-sm border-[#e8f0f2]">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex gap-3 md:gap-4 items-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#0a3d47] text-white flex items-center justify-center text-base md:text-lg font-extrabold flex-shrink-0">
                        {initials(selectedQuery.name)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-[16px] md:text-[18px] font-extrabold text-[#0a3d47] m-0 leading-tight">
                          {selectedQuery.name}
                        </h2>
                        <div className="mt-1.5 flex flex-col gap-1">
                          <a
                            href={`mailto:${selectedQuery.email}`}
                            className="text-[12px] md:text-[13px] text-[#3a9aaa] no-underline hover:underline truncate flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3 flex-shrink-0" /> {selectedQuery.email}
                          </a>
                          <span className="text-[12px] md:text-[13px] text-[#7aacb5] flex items-center gap-1">
                            <Phone className="h-3 w-3 flex-shrink-0" /> {selectedQuery.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col sm:text-right sm:items-end flex-row items-center justify-between flex-shrink-0 sm:ml-4">
                      <div className="text-[11px] text-[#aac5cb] sm:mb-2">
                        {selectedQuery.date} · {selectedQuery.time}
                      </div>
                      <Badge
                        className={`${statusConfig[selectedQuery.status as Status].className} text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${statusConfig[selectedQuery.status as Status].dotColor}`} />
                        {statusConfig[selectedQuery.status as Status].label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message Card */}
              <Card className="shadow-sm border-[#e8f0f2]">
                <CardContent className="p-4 md:p-6">
                  <p className="text-[11px] font-bold text-[#9ab5bb] uppercase tracking-widest mb-1.5">
                    Subject
                  </p>
                  <p className="text-[15px] md:text-[16px] font-bold text-[#0a3d47] mb-4">
                    {selectedQuery.subject}
                  </p>
                  <Separator className="mb-4 bg-[#f0f6f8]" />
                  <p className="text-[11px] font-bold text-[#9ab5bb] uppercase tracking-widest mb-2">
                    Message
                  </p>
                  <p className="text-[13px] md:text-[14px] leading-[1.8] text-[#2c4a55] m-0">
                    {selectedQuery.message}
                  </p>
                </CardContent>
              </Card>

              {/* Reply Card */}
              <Card className="shadow-sm border-[#e8f0f2]">
                <CardContent className="p-4 md:p-6">
                  <p className="text-[13px] font-bold text-[#0a3d47] mb-3 flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5" /> Reply to {selectedQuery.name}
                  </p>
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                    className="border-[#ddeef1] bg-[#f8fbfc] text-[#2c4a55] text-[13px] leading-[1.7] focus-visible:ring-[#0a3d47]/20 resize-none"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedQuery.id)}
                      className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 text-[12px] font-bold"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete Query
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none border-[#ddeef1] text-[#5a7a82] hover:bg-[#f0f9fb] text-[12px] font-bold"
                      >
                        <MailOpen className="h-3.5 w-3.5 mr-1.5" /> Mark as Read
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-none bg-[#0a3d47] hover:bg-[#0a3d47]/90 text-white text-[13px] font-bold px-4 md:px-6"
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" /> Send Reply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom padding for mobile scroll */}
              <div className="h-4 md:hidden" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}