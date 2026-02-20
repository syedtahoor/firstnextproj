"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ClockArrowUp, MessageSquare,
  FileText, CalendarDays, Settings, Sparkles,
  Menu, X, ChevronLeft, ChevronRight, ChartBarDecreasing, ShoppingCart
} from "lucide-react";

const navItems = [
  { label: "Dashboard",  href: "/dashboard",            icon: <LayoutDashboard size={18} /> },
  { label: "Categories", href: "/dashboard/categories", icon: <ChartBarDecreasing size={18} /> },
  { label: "Products",   href: "/dashboard/products",   icon: <ShoppingCart size={18} /> },
  { label: "Users",      href: "/dashboard/users",      icon: <Users size={18} /> },
  { label: "Orders",   href: "/dashboard/orders",   icon: <ClockArrowUp size={18} />, badge: 5 },
  { label: "Ask A Message",    href: "/dashboard/askamessage",    icon: <MessageSquare size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [isPending, startTransition] = useTransition();

  const [collapsed,  setCollapsed]  = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);
  // Optimistic active link — fires INSTANTLY on click, no network wait
  const [activeHref, setActiveHref] = useState(pathname);

  useEffect(() => { setActiveHref(pathname); }, [pathname]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Click → instant highlight + background push
  const go = useCallback((href: string) => {
    if (href === pathname) return;
    setActiveHref(href);                        // instant
    startTransition(() => router.push(href));   // non-blocking
  }, [pathname, router]);

  const sidebarWidth = isMobile ? "260px" : collapsed ? "72px" : "260px";
  const show = isMobile ? mobileOpen : true;

  return (
    <>
      <style>{`:root{--sidebar-width:${isMobile ? "0px" : collapsed ? "72px" : "260px"}}`}</style>

      {isMobile && !mobileOpen && (
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{
          position:"fixed",top:"11px",left:"16px",zIndex:60,
          background:"#0a3d47",border:"none",borderRadius:"5px",
          width:"40px",height:"40px",display:"flex",alignItems:"center",
          justifyContent:"center",color:"white",
          boxShadow:"0 4px 12px rgba(10,61,71,0.45)",cursor:"pointer",
        }}>
          <Menu size={20} />
        </button>
      )}

      {isMobile && mobileOpen && (
        <div className="sidebar-overlay show" onClick={() => setMobileOpen(false)} />
      )}

      <aside style={{
        width:sidebarWidth,minHeight:"100vh",
        background:"linear-gradient(#07252e 50%,#061f27 100%)",
        display:"flex",flexDirection:"column",
        transform:show ? "translateX(0)" : "translateX(-100%)",
        transition:"width 0.2s cubic-bezier(0.4,0,0.2,1),transform 0.2s cubic-bezier(0.4,0,0.2,1)",
        position:"fixed",left:0,top:0,bottom:0,zIndex:50,
        boxShadow:"4px 0 24px rgba(10,61,71,0.35)",
        overflow:"hidden",willChange:"width,transform",
      }}>

        {/* Logo row */}
        <div style={{
          padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,0.10)",
          display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",overflow:"hidden"}}>
            <div style={{
              width:"36px",height:"36px",borderRadius:"10px",flexShrink:0,
              background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.18)",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              <Sparkles size={17} color="white" />
            </div>
            {(!collapsed || isMobile) && (
              <span style={{color:"white",fontWeight:800,fontSize:"18px",letterSpacing:"-0.3px",whiteSpace:"nowrap"}}>
                SkyPanel
              </span>
            )}
          </div>
          <button onClick={isMobile ? () => setMobileOpen(false) : () => setCollapsed(c => !c)} style={{
            background:"rgba(255,255,255,0.10)",border:"none",borderRadius:"5px",
            marginLeft:"-10px",width:"40px",height:"35px",cursor:"pointer",color:"white",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
          }}>
            {isMobile ? <X size={15}/> : collapsed ? <ChevronRight size={15}/> : <ChevronLeft size={15}/>}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{flex:1,padding:"10px 14px",overflowY:"auto"}}>
          {(!collapsed || isMobile) && (
            <p style={{
              color:"rgba(255,255,255,0.35)",fontSize:"10px",fontWeight:600,
              letterSpacing:"1.2px",textTransform:"uppercase",
              padding:"0 8px",marginBottom:"8px",
            }}>Main Menu</p>
          )}
          <ul style={{listStyle:"none",margin:0,padding:0,display:"flex",flexDirection:"column",gap:"2px"}}>
            {navItems.map((item) => {
              const active = activeHref === item.href;
              return (
                <li key={item.href}>
                  <button
                    onClick={() => go(item.href)}
                    title={(collapsed && !isMobile) ? item.label : undefined}
                    style={{
                      width:"100%",display:"flex",alignItems:"center",gap:"11px",
                      padding:(collapsed && !isMobile) ? "11px" : "10px 11px",
                      borderRadius:"3px",fontFamily:"inherit",outline:"none",
                      background: active ? "rgba(255,255,255,0.14)" : "transparent",
                      border: active ? "1px solid rgba(255,255,255,0.18)" : "1px solid transparent",
                      color: active ? "white" : "rgba(255,255,255,0.60)",
                      justifyContent:(collapsed && !isMobile) ? "center" : "flex-start",
                      whiteSpace:"nowrap", cursor:"pointer",
                    }}
                  >
                    <span style={{flexShrink:0,display:"flex",alignItems:"center", cursor:"pointer"}}>{item.icon}</span>
                    {(!collapsed || isMobile) && (
                      <>
                        <span style={{fontSize:"13.5px",fontWeight:active?600:400,flex:1,textAlign:"left", cursor:"pointer"}}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span style={{
                            background:"rgba(255,255,255,0.85)",color:"#0a3d47",
                            fontSize:"10px",fontWeight:700,borderRadius:"99px",padding:"1px 7px", cursor:"pointer",
                          }}>{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User footer */}
        <div style={{padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,0.10)"}}>
          <div style={{
            display:"flex",alignItems:"center",gap:"10px",padding:"10px 11px",
            borderRadius:"10px",background:"rgba(255,255,255,0.08)",
            justifyContent:(collapsed && !isMobile) ? "center" : "flex-start",
          }}>
            <div style={{
              width:"34px",height:"34px",borderRadius:"50%",background:"rgba(255,255,255,0.9)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:"12px",fontWeight:700,color:"#0a3d47",flexShrink:0,
            }}>AK</div>
            {(!collapsed || isMobile) && (
              <div>
                <p style={{color:"white",fontSize:"13px",fontWeight:600,margin:0}}>Ali Khan</p>
                <p style={{color:"rgba(255,255,255,0.45)",fontSize:"11px",margin:0}}>Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}