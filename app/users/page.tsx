"use client";
import { useState } from "react";
import {
  Search, X, ChevronDown, ChevronUp,
  SlidersHorizontal, ArrowUpDown,
  User, ShieldCheck, ShieldAlert,
  Mail, Phone, MapPin, Calendar,
  Ban, Trash2, ShoppingBag, DollarSign,
  MoreHorizontal,
} from "lucide-react";

type UserStatus = "Active" | "Inactive" | "Banned" | "Pending";
type UserRole   = "Admin" | "Moderator" | "Customer";
type SortKey    = "name" | "role" | "joined" | "orders" | "spent" | "status";

interface AppUser {
  id:       number;
  avatar:   string;
  name:     string;
  email:    string;
  phone:    string;
  location: string;
  role:     UserRole;
  status:   UserStatus;
  joined:   string;
  orders:   number;
  spent:    number;
}

const INITIAL_USERS: AppUser[] = [
  { id: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",  name: "Ahmed Raza",     email: "ahmed.raza@gmail.com",  phone: "+92 300 1234567", location: "Karachi, PK",    role: "Admin",     status: "Active",   joined: "Jan 12, 2024", orders: 34, spent: 12400 },
  { id: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",   name: "Sara Khan",      email: "sara.k@outlook.com",    phone: "+92 321 9876543", location: "Lahore, PK",     role: "Customer",  status: "Active",   joined: "Mar 5, 2024",  orders: 12, spent: 4320  },
  { id: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal",  name: "Bilal Hussain",  email: "bilal.h@yahoo.com",     phone: "+92 333 5551234", location: "Islamabad, PK",  role: "Customer",  status: "Inactive", joined: "Feb 20, 2023", orders: 2,  spent: 890   },
  { id: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maryam", name: "Maryam Tariq",   email: "maryam.t@gmail.com",    phone: "+92 312 7779988", location: "Faisalabad, PK", role: "Moderator", status: "Active",   joined: "Jul 1, 2024",  orders: 7,  spent: 3100  },
  { id: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman",  name: "Usman Ali",      email: "usman.ali@hotmail.com", phone: "+92 345 0001122", location: "Multan, PK",     role: "Customer",  status: "Banned",   joined: "Oct 15, 2022", orders: 1,  spent: 150   },
  { id: 6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zara",   name: "Zara Noor",      email: "zara.noor@gmail.com",   phone: "+92 301 2223344", location: "Karachi, PK",    role: "Customer",  status: "Active",   joined: "Aug 9, 2024",  orders: 21, spent: 8750  },
  { id: 7, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza",  name: "Hamza Sheikh",   email: "hamza.s@gmail.com",     phone: "+92 311 4445566", location: "Peshawar, PK",   role: "Admin",     status: "Active",   joined: "Jun 14, 2023", orders: 0,  spent: 0     },
  { id: 8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farah",  name: "Farah Siddiqui", email: "farah.sid@mail.com",    phone: "+92 322 6667788", location: "Quetta, PK",     role: "Customer",  status: "Pending",  joined: "Nov 30, 2024", orders: 0,  spent: 0     },
];

const STATUS_CLASS: Record<UserStatus, string> = {
  Active:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
  Banned:   "bg-red-100 text-red-600 border-red-200",
  Pending:  "bg-amber-100 text-amber-700 border-amber-200",
};
const STATUS_DOT: Record<UserStatus, string> = {
  Active:   "bg-emerald-500",
  Inactive: "bg-gray-400",
  Banned:   "bg-red-500",
  Pending:  "bg-amber-400",
};
const ROLE_CLASS: Record<UserRole, string> = {
  Admin:     "bg-violet-100 text-violet-700 border-violet-200",
  Moderator: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Customer:  "bg-blue-50 text-blue-600 border-blue-200",
};
const ROLE_ICON: Record<UserRole, React.ElementType> = {
  Admin:     ShieldCheck,
  Moderator: ShieldAlert,
  Customer:  User,
};

const SortArrow = ({ active, asc }: { active: boolean; asc: boolean }) =>
  active
    ? asc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
    : <ArrowUpDown className="h-3 w-3 opacity-30" />;

function UserCard({ user, onBan, onDelete }: { user: AppUser; onBan: (id: number) => void; onDelete: (id: number) => void }) {
  const RoleIcon = ROLE_ICON[user.role];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="h-1.5 w-full" style={{ backgroundColor: "#0a3d47" }} />

      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "#0a3d4725" }}>
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full flex items-center justify-center text-xl font-extrabold" style={{ backgroundColor: "#0a3d4715", color: "#0a3d47" }}>
                  {user.name[0]}
                </div>
              )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight truncate">{user.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">ID #{user.id}</p>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold border mt-1.5 ${ROLE_CLASS[user.role]}`}>
              <RoleIcon className="h-3 w-3" />{user.role}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold border whitespace-nowrap ${STATUS_CLASS[user.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status]}`} />
            {user.status}
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-xl w-36 py-1 text-xs">
                  <button
                    onClick={() => { onBan(user.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    <Ban className="h-3.5 w-3.5" />
                    {user.status === "Banned" ? "Unban User" : "Ban User"}
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => { onDelete(user.id); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-5 border-t border-gray-100" />

      <div className="px-5 py-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span>{user.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span>Joined {user.joined}</span>
        </div>
      </div>

      <div className="mx-4 mb-4 mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: "#0a3d4708" }}>
          <div className="flex items-center gap-1 mb-0.5">
            <ShoppingBag className="h-3 w-3" style={{ color: "#0a3d47" }} />
            <span className="text-xs font-semibold" style={{ color: "#0a3d47" }}>Orders</span>
          </div>
          <p className="text-xl font-extrabold text-gray-900">{user.orders}</p>
        </div>
        <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: "#0a3d4708" }}>
          <div className="flex items-center gap-1 mb-0.5">
            <DollarSign className="h-3 w-3" style={{ color: "#0a3d47" }} />
            <span className="text-xs font-semibold" style={{ color: "#0a3d47" }}>Spent</span>
          </div>
          <p className="text-xl font-extrabold text-gray-900">${user.spent.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers]               = useState<AppUser[]>(INITIAL_USERS);
  const [search, setSearch]             = useState<string>("");
  const [roleFilter, setRoleFilter]     = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [sortKey, setSortKey]           = useState<SortKey>("name");
  const [sortAsc, setSortAsc]           = useState<boolean>(true);

  const visible = users
    .filter(u => {
      const ms = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const mr = roleFilter   === "All" || u.role   === roleFilter;
      const mf = statusFilter === "All" || u.status === statusFilter;
      return ms && mr && mf;
    })
    .sort((a, b) => {
      const va = a[sortKey as keyof AppUser];
      const vb = b[sortKey as keyof AppUser];
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortAsc ? cmp : -cmp;
    });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(a => !a); else { setSortKey(k); setSortAsc(true); }
  };

  const banUser    = (id: number) => setUsers(u => u.map(x => x.id === id ? { ...x, status: (x.status === "Banned" ? "Inactive" : "Banned") as UserStatus } : x));
  const deleteUser = (id: number) => setUsers(u => u.filter(x => x.id !== id));

  const stats = {
    total:    users.length,
    active:   users.filter(u => u.status === "Active").length,
    banned:   users.filter(u => u.status === "Banned").length,
    pending:  users.filter(u => u.status === "Pending").length,
    inactive: users.filter(u => u.status === "Inactive").length,
  };

  const statusTabs: { key: UserStatus | "All"; label: string; n: number; dot: string }[] = [
    { key: "All",      label: "All",      n: stats.total,    dot: "bg-gray-400"    },
    { key: "Active",   label: "Active",   n: stats.active,   dot: "bg-emerald-500" },
    { key: "Pending",  label: "Pending",  n: stats.pending,  dot: "bg-amber-400"   },
    { key: "Inactive", label: "Inactive", n: stats.inactive, dot: "bg-gray-300"    },
    { key: "Banned",   label: "Banned",   n: stats.banned,   dot: "bg-red-500"     },
  ];

  const sortOptions: { label: string; key: SortKey }[] = [
    { label: "Name",   key: "name"   },
    { label: "Orders", key: "orders" },
    { label: "Spent",  key: "spent"  },
    { label: "Joined", key: "joined" },
    { label: "Role",   key: "role"   },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="min-h-screen font-sans text-sm text-gray-700">

      <div className="bg-white border-b rounded-md border-gray-200 px-6 pt-6 pb-0">
        <div className="mb-5">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#0a3d47" }}>Management</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all registered users on your platform</p>
        </div>

        <div className="flex gap-1">
          {statusTabs.map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-t-lg border border-b-0 relative bottom-[-1px] transition-colors
                ${statusFilter === s.key
                  ? "bg-gray-50 border-gray-200 text-gray-900"
                  : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
              <span className="font-bold text-gray-700">{s.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            className="pl-9 w-64 h-9 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#0a3d47] bg-white"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Sort:</span>
          <div className="flex gap-1">
            {sortOptions.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => toggleSort(key)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                  ${sortKey === key ? "text-white border-transparent" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                style={sortKey === key ? { backgroundColor: "#0a3d47" } : {}}
              >
                {label} <SortArrow active={sortKey === key} asc={sortAsc} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="py-4">
        {visible.length > 0 ? (
          <>
            <p className="text-xs text-gray-400 mb-3 font-medium">
              Showing {visible.length} of {users.length} users
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visible.map(user => (
                <UserCard key={user.id} user={user} onBan={banUser} onDelete={deleteUser} />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-center py-20">
              <div
                className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3 border"
                style={{ backgroundColor: "#0a3d4710", borderColor: "#0a3d4720" }}
              >
                <SlidersHorizontal className="h-5 w-5" style={{ color: "#0a3d47" }} />
              </div>
              <p className="font-semibold text-gray-700 mb-1">No users found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}