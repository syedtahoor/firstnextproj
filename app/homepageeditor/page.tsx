"use client";
import { useState, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────
interface Slide { id: number; imageUrl: string; badge: string; }
interface LeftBanner { id: number; imageUrl: string; label: string; title: string; cta: string; accentColor: string; }
interface RightCard { id: number; imageUrl: string; tag: string; title: string; cta: string; }
type TabKey = "slider" | "left" | "right";
interface Tab { key: TabKey; label: string; highlight: string; }

// ─── Initial Data ────────────────────────────────────────────────
const INIT_SLIDES: Slide[] = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80", badge: "LIMITED OFFER · 50% OFF" },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80", badge: "EXCLUSIVE DEAL" },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80", badge: "NEW ARRIVALS" },
];

const INIT_LEFT: LeftBanner[] = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", label: "LIST FOR FREE", title: "EARN WITH EASE", cta: "Sell Today, 100% Free.", accentColor: "#0ec6d5" },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80", label: "SHOWCASE YOUR SKILLS", title: "GROW BUSINESS", cta: "Boost Business, 100% Free.", accentColor: "#f59e0b" },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80", label: "100% FREE PICKUPS", title: "GET $20 GIFT CERTIFICATE", cta: "Register For Certificate", accentColor: "#10b981" },
];

const INIT_RIGHT: RightCard[] = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&q=80", tag: "EXCLUSIVE", title: "IPHONE DEALS", cta: "IPhone Deals" },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", tag: "EXCLUSIVE", title: "SAMSUNG DEALS", cta: "Samsung Deals" },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80", tag: "SERVICE", title: "CELL PHONE REPAIR SERVICE!", cta: "Sell Phone Repair Service" },
];

// ─── Shared label class ──────────────────────────────────────────
const LBL = "block text-[10px] font-bold text-[#4b7a83] uppercase tracking-widest mb-1";
const INP = "w-full px-3 py-2 rounded-lg border border-[#cde4e8] bg-white text-xs text-[#1a3340] outline-none font-[inherit]";

// ─── ImageField ──────────────────────────────────────────────────
function ImageField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1">
      <label className={LBL}>{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste image URL..."
          className="flex-1 min-w-0 px-3 py-2 rounded-sm border border-[#cde4e8] bg-white text-xs text-[#1a3340] outline-none"
        />
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) onChange(URL.createObjectURL(f)); }}
        />
        <button
          onClick={() => ref.current?.click()}
          className="flex-shrink-0 px-3 py-2 rounded-lg border border-[#0ec6d5] bg-[#f0fdff] text-[#0a3d47] font-bold text-sm cursor-pointer whitespace-nowrap hover:bg-[#e0fafc] transition-colors"
        >
          📁
        </button>
      </div>
    </div>
  );
}

// ─── MobilePreview (stacked layout for mobile) ───────────────────
function MobilePreview({ slides, leftBanners, rightCards, activeSlide, onSlideChange, highlight }:
  { slides: Slide[]; leftBanners: LeftBanner[]; rightCards: RightCard[]; activeSlide: number; onSlideChange: (i: number) => void; highlight: string }
) {
  return (
    <div className="flex flex-col gap-1.5 p-2">

      {/* CENTER SLIDER — full width on mobile */}
      <div
        className={`relative rounded-xl overflow-hidden bg-[#e8f4f5] transition-all duration-200 ${highlight === "slider" ? "outline outline-2 outline-[#0a3d47]" : "outline outline-2 outline-transparent"}`}
        style={{ height: 200 }}
      >
        <img
          src={slides[activeSlide]?.imageUrl}
          alt="slide"
          className="w-full h-full object-cover block"
          onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/700x200/e8f4f5/0a3d47?text=Slide+Image"; }}
        />
        {slides[activeSlide]?.badge && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-center text-[7px] font-black leading-tight p-1">
            {slides[activeSlide].badge}
          </div>
        )}
        <button
          onClick={() => onSlideChange((activeSlide - 1 + slides.length) % slides.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border-none rounded-full w-7 h-7 cursor-pointer text-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >‹</button>
        <button
          onClick={() => onSlideChange((activeSlide + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border-none rounded-full w-7 h-7 cursor-pointer text-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
        >›</button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => onSlideChange(i)}
              className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-200"
              style={{ width: i === activeSlide ? 18 : 6, background: i === activeSlide ? "#0ec6d5" : "rgba(255,255,255,0.6)" }}
            />
          ))}
        </div>
      </div>

      {/* LEFT BANNERS — horizontal scroll on mobile */}
      <div
        className={`transition-all duration-200 ${highlight === "left" ? "outline outline-2 outline-[#0a3d47] rounded-sm" : ""}`}
      >
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {leftBanners.map((b, i) => (
            <div
              key={b.id}
              className="relative rounded-sm overflow-hidden flex-shrink-0"
              style={{ width: 140, height: 80, border: `1.5px solid ${b.accentColor}40` }}
            >
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover block"
                onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/140x80/0a3d47/fff?text=Banner+${i + 1}`; }}
              />
              <div className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5" style={{ background: b.accentColor }}>
                <div className="text-[8px] text-white font-extrabold truncate">{b.cta}</div>
              </div>
              <div className="absolute top-1 left-1 bg-black/55 rounded px-1 py-0.5">
                <div className="text-[6px] text-white font-bold tracking-wide">{b.label}</div>
                <div className="text-[8px] text-white font-black">{b.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CARDS — horizontal scroll on mobile */}
      <div
        className={`transition-all duration-200 ${highlight === "right" ? "outline outline-2 outline-[#0a3d47] rounded-sm" : ""}`}
      >
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {rightCards.map((c, i) => (
            <div
              key={c.id}
              className="relative rounded-sm overflow-hidden flex-shrink-0 border border-[#0ec6d530]"
              style={{ width: 140, height: 80 }}
            >
              <img
                src={c.imageUrl}
                alt={c.title}
                className="w-full h-full object-cover block"
                onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/140x80/0a3d47/fff?text=Card+${i + 1}`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
              <div className="absolute top-1 left-1.5">
                <div className="text-[6px] text-[#0ec6d5] font-extrabold tracking-widest">{c.tag}</div>
                <div className="text-[8px] text-white font-black leading-tight">{c.title}</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-[#0ec6d5] px-1.5 py-0.5">
                <div className="text-[8px] text-[#0a3d47] font-extrabold truncate">{c.cta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DesktopPreview (original 3-column layout) ───────────────────
function DesktopPreview({ slides, leftBanners, rightCards, activeSlide, onSlideChange, highlight }:
  { slides: Slide[]; leftBanners: LeftBanner[]; rightCards: RightCard[]; activeSlide: number; onSlideChange: (i: number) => void; highlight: string }
) {
  return (
    <div className="grid gap-1.5 p-2" style={{ gridTemplateColumns: "180px 1fr 180px" }}>

      {/* LEFT BANNERS */}
      <div className={`flex flex-col gap-1.5 rounded-sm transition-all duration-200 ${highlight === "left" ? "outline outline-2 outline-[#0a3d47]" : "outline outline-2 outline-transparent"}`}>
        {leftBanners.map((b, i) => (
          <div key={b.id} className="relative rounded-sm overflow-hidden h-[100px]" style={{ border: `1.5px solid ${b.accentColor}40` }}>
            <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover block"
              onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/300x100/0a3d47/fff?text=Banner+${i + 1}`; }} />
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1" style={{ background: b.accentColor }}>
              <div className="text-[9px] text-white font-extrabold">{b.cta}</div>
            </div>
            <div className="absolute top-1.5 left-1.5 bg-black/55 rounded px-1.5 py-0.5">
              <div className="text-[7px] text-white font-bold tracking-wide">{b.label}</div>
              <div className="text-[9px] text-white font-black">{b.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CENTER SLIDER */}
      <div className={`relative rounded-xl overflow-hidden bg-[#e8f4f5] transition-all duration-200 ${highlight === "slider" ? "outline outline-2 outline-[#0a3d47]" : "outline outline-2 outline-transparent"}`} style={{ height: 311 }}>
        <img src={slides[activeSlide]?.imageUrl} alt="slide" className="w-full h-full object-cover block"
          onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/700x311/e8f4f5/0a3d47?text=Slide+Image"; }} />
        {slides[activeSlide]?.badge && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-center text-[8px] font-black leading-tight p-1">
            {slides[activeSlide].badge}
          </div>
        )}
        <button onClick={() => onSlideChange((activeSlide - 1 + slides.length) % slides.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 border-none rounded-full w-7 h-7 cursor-pointer text-sm flex items-center justify-center shadow-md hover:bg-white transition-colors">
          ‹
        </button>
        <button onClick={() => onSlideChange((activeSlide + 1) % slides.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 border-none rounded-full w-7 h-7 cursor-pointer text-sm flex items-center justify-center shadow-md hover:bg-white transition-colors">
          ›
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => onSlideChange(i)}
              className="h-1.5 rounded-full border-none cursor-pointer transition-all duration-200"
              style={{ width: i === activeSlide ? 18 : 6, background: i === activeSlide ? "#0ec6d5" : "rgba(255,255,255,0.6)" }} />
          ))}
        </div>
      </div>

      {/* RIGHT CARDS */}
      <div className={`flex flex-col gap-1.5 rounded-sm transition-all duration-200 ${highlight === "right" ? "outline outline-2 outline-[#0a3d47]" : "outline outline-2 outline-transparent"}`}>
        {rightCards.map((c, i) => (
          <div key={c.id} className="relative rounded-sm overflow-hidden h-[100px] border border-[#0ec6d530]">
            <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover block"
              onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/300x100/0a3d47/fff?text=Card+${i + 1}`; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />
            <div className="absolute top-1.5 left-2">
              <div className="text-[7px] text-[#0ec6d5] font-extrabold tracking-widest">{c.tag}</div>
              <div className="text-[9px] text-white font-black leading-tight">{c.title}</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-[#0ec6d5] px-2 py-1">
              <div className="text-[9px] text-[#0a3d47] font-extrabold">{c.cta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LivePreview (responsive wrapper) ────────────────────────────
function LivePreview({ slides, leftBanners, rightCards, activeSlide, onSlideChange, highlight }:
  { slides: Slide[]; leftBanners: LeftBanner[]; rightCards: RightCard[]; activeSlide: number; onSlideChange: (i: number) => void; highlight: string }
) {
  return (
    <div className="bg-[#f0f8f9] rounded-2xl border-2 border-[#0ec6d530] overflow-hidden mb-7">
      {/* Mini Nav */}
      <div className="bg-white border-b border-[#e5eef0] px-4 py-2 flex items-center gap-3">
        <span className="font-black text-sm text-[#0a3d47]">Flex<span className="text-[#0ec6d5]">E</span> Market</span>
        <div className="w-px h-4 bg-gray-200" />
        <span className="text-[11px] text-gray-500 hidden sm:inline">Products</span>
        <span className="text-[11px] text-gray-500 hidden sm:inline">Services</span>
        <div className="flex-1" />
      </div>

      {/* Mobile preview */}
      <div className="block md:hidden">
        <MobilePreview
          slides={slides} leftBanners={leftBanners} rightCards={rightCards}
          activeSlide={activeSlide} onSlideChange={onSlideChange} highlight={highlight}
        />
      </div>

      {/* Desktop preview */}
      <div className="hidden md:block">
        <DesktopPreview
          slides={slides} leftBanners={leftBanners} rightCards={rightCards}
          activeSlide={activeSlide} onSlideChange={onSlideChange} highlight={highlight}
        />
      </div>
    </div>
  );
}

// ─── SliderEditor ────────────────────────────────────────────────
function SliderEditor({ slides, setSlides, activeSlide, setActiveSlide }:
  { slides: Slide[]; setSlides: (s: Slide[]) => void; activeSlide: number; setActiveSlide: (i: number) => void }
) {
  const update = (i: number, field: keyof Slide, val: string) =>
    setSlides(slides.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const addSlide = () => { setSlides([...slides, { id: Date.now(), imageUrl: "", badge: "" }]); setActiveSlide(slides.length); };
  const removeSlide = (i: number) => {
    if (slides.length === 1) return;
    setSlides(slides.filter((_, idx) => idx !== i));
    setActiveSlide(Math.max(0, i - 1));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {slides.map((s, i) => (
          <div key={s.id} className="flex">
            <button onClick={() => setActiveSlide(i)}
              className={`px-3.5 py-1.5 rounded-l-lg text-xs font-semibold cursor-pointer border transition-colors ${i === activeSlide ? "bg-[#0a3d47] text-white border-[#0a3d47]" : "bg-white text-[#4b7a83] border-[#cde4e8]"}`}>
              Slide {i + 1}
            </button>
            <button onClick={() => removeSlide(i)}
              className="px-2.5 py-1.5 rounded-r-lg text-xs font-bold cursor-pointer border border-l-0 border-red-200 bg-red-50 text-red-400 hover:bg-red-100 transition-colors">
              ✕
            </button>
          </div>
        ))}
        <button onClick={addSlide}
          className="px-3.5 py-1.5 rounded-lg border border-dashed border-[#0ec6d5] bg-[#f0fdff] text-[#0ec6d5] font-bold text-xs cursor-pointer hover:bg-[#e0fafc] transition-colors">
          + Add Slide
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <ImageField label={`Slide ${activeSlide + 1} — Image`} value={slides[activeSlide]?.imageUrl || ""} onChange={val => update(activeSlide, "imageUrl", val)} />
        <div>
          <label className={LBL}>Badge Text (circle overlay)</label>
          <input value={slides[activeSlide]?.badge || ""} onChange={e => update(activeSlide, "badge", e.target.value)}
            placeholder="e.g. LIMITED OFFER · 50% OFF" className={INP} />
        </div>
      </div>
    </div>
  );
}

// ─── LeftBannersEditor ───────────────────────────────────────────
function LeftBannersEditor({ banners, setBanners }:
  { banners: LeftBanner[]; setBanners: (b: LeftBanner[]) => void }
) {
  const update = (i: number, field: keyof LeftBanner, val: string) =>
    setBanners(banners.map((b, idx) => idx === i ? { ...b, [field]: val } : b));

  return (
    <div className="flex flex-col gap-5">
      {banners.map((b, i) => (
        <div key={b.id} className="bg-[#f4f9fa] rounded-xl p-4" style={{ border: `1.5px solid ${b.accentColor}40` }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-9 rounded flex-shrink-0" style={{ background: b.accentColor }} />
            <span className="font-bold text-sm text-[#0a3d47]">Banner {i + 1}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className={LBL}>Top Label</label>
              <input value={b.label} onChange={e => update(i, "label", e.target.value)} className={INP} />
            </div>
            <div>
              <label className={LBL}>Main Title</label>
              <input value={b.title} onChange={e => update(i, "title", e.target.value)} className={INP} />
            </div>
            <div>
              <label className={LBL}>CTA Text</label>
              <input value={b.cta} onChange={e => update(i, "cta", e.target.value)} className={INP} />
            </div>
            <div>
              <label className={LBL}>Accent Color</label>
              <input type="color" value={b.accentColor} onChange={e => update(i, "accentColor", e.target.value)}
                className="w-full h-[38px] rounded-lg border border-[#cde4e8] cursor-pointer p-0.5" />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <ImageField label="Banner Image" value={b.imageUrl} onChange={val => update(i, "imageUrl", val)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RightCardsEditor ────────────────────────────────────────────
function RightCardsEditor({ cards, setCards }:
  { cards: RightCard[]; setCards: (c: RightCard[]) => void }
) {
  const update = (i: number, field: keyof RightCard, val: string) =>
    setCards(cards.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  return (
    <div className="flex flex-col gap-5">
      {cards.map((c, i) => (
        <div key={c.id} className="bg-[#f4f9fa] rounded-xl p-4 border border-[#0ec6d530]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-9 rounded bg-[#0ec6d5] flex-shrink-0" />
            <span className="font-bold text-sm text-[#0a3d47]">Card {i + 1}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className={LBL}>Tag</label>
              <input value={c.tag} onChange={e => update(i, "tag", e.target.value)} className={INP} />
            </div>
            <div>
              <label className={LBL}>Title</label>
              <input value={c.title} onChange={e => update(i, "title", e.target.value)} className={INP} />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className={LBL}>CTA Text</label>
              <input value={c.cta} onChange={e => update(i, "cta", e.target.value)} className={INP} />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <ImageField label="Card Image" value={c.imageUrl} onChange={val => update(i, "imageUrl", val)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function HomepageEditor() {
  const [slides, setSlides]           = useState<Slide[]>(INIT_SLIDES);
  const [leftBanners, setLeftBanners] = useState<LeftBanner[]>(INIT_LEFT);
  const [rightCards, setRightCards]   = useState<RightCard[]>(INIT_RIGHT);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab]     = useState<TabKey>("slider");
  const [publishing, setPublishing]   = useState(false);
  const [published, setPublished]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: Tab[] = [
    { key: "left",   label: "📌 Left Banners", highlight: "left"   },
    { key: "slider", label: "🖼️ Hero Slider",  highlight: "slider" },
    { key: "right",  label: "🃏 Right Cards",  highlight: "right"  },
  ];

  const currentHighlight = tabs.find(t => t.key === activeTab)?.highlight ?? "";

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); setTimeout(() => setPublished(false), 3000); }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f0f8f9] font-sans">

      {/* TOP BAR */}
      <div className="sticky top-0 rounded-lg z-50 bg-[#0a3d47] px-4 md:px-7 h-14 flex items-center justify-between shadow-[0_4px_20px_rgba(10,61,71,0.3)]">
        <div className="flex items-center gap-2 md:gap-3.5 min-w-0">
          <span className="font-black text-base md:text-lg text-white tracking-tight whitespace-nowrap">
            Flex<span className="text-[#0ec6d5]">E</span> Market
          </span>
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          <span className="hidden sm:inline text-white/65 text-sm truncate">Home Page Editor</span>
        </div>
        <div className="flex gap-2 items-center">
          {published && (
            <span className="hidden sm:inline bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-full text-xs font-semibold px-3 py-1">
              ✓ Published!
            </span>
          )}
          <button className="hidden sm:inline-flex bg-white/10 border border-white/20 text-white rounded-lg px-4 py-1.5 text-sm font-semibold cursor-pointer hover:bg-white/20 transition-colors">
            Preview
          </button>
          <button
            onClick={handlePublish}
            className={`border-none text-[#0a3d47] rounded-lg px-4 md:px-5 py-1.5 text-sm font-extrabold cursor-pointer transition-all shadow-[0_2px_10px_rgba(14,198,213,0.4)] ${publishing ? "bg-[#0ec6d599]" : "bg-[#0ec6d5] hover:bg-[#0bb8c7]"}`}
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="px-0 md:px-7 lg:px-10 xl:px-0 mx-auto max-w-screen-xl pt-6 pb-16">

        {/* Title */}
        <div className="mb-5">
          <h1 className="font-extrabold text-xl md:text-2xl text-[#0a3d47] m-0">Home Page Editor</h1>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">Changes reflect live in the preview below. Click a tab to edit that section.</p>
        </div>

        {/* LIVE PREVIEW */}
        <div className="mb-1.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-0.5 h-4 bg-[#0ec6d5] rounded" />
            <span className="font-bold text-sm text-[#0a3d47]">Live Preview</span>
            <span className="bg-[#0ec6d520] text-[#0ec6d5] border border-[#0ec6d550] rounded-full text-[10px] font-bold px-2.5 py-0.5 tracking-widest">
              LIVE
            </span>
          </div>
          <LivePreview
            slides={slides} leftBanners={leftBanners} rightCards={rightCards}
            activeSlide={activeSlide} onSlideChange={setActiveSlide} highlight={currentHighlight}
          />
        </div>

        {/* TABS — scrollable on mobile */}
        <div className="mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-1 bg-[#e0edf0] rounded-xl p-1 w-fit min-w-full sm:min-w-0">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 rounded-[9px] border-none font-semibold text-xs sm:text-sm cursor-pointer transition-all font-[inherit] whitespace-nowrap ${activeTab === t.key ? "bg-[#0a3d47] text-white" : "bg-transparent text-[#4b7a83] hover:text-[#0a3d47]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* EDITOR PANEL */}
        <div className="bg-white rounded-2xl border border-[#e0edf0] shadow-sm p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-1 h-5 bg-[#0ec6d5] rounded" />
            <span className="font-bold text-[15px] text-[#0a3d47]">
              {activeTab === "slider" ? "Hero Slider Images" : activeTab === "left" ? "Left Banner Images" : "Right Card Images"}
            </span>
          </div>

          {activeTab === "slider" && <SliderEditor slides={slides} setSlides={setSlides} activeSlide={activeSlide} setActiveSlide={setActiveSlide} />}
          {activeTab === "left"   && <LeftBannersEditor banners={leftBanners} setBanners={setLeftBanners} />}
          {activeTab === "right"  && <RightCardsEditor cards={rightCards} setCards={setRightCards} />}
        </div>

        {/* Mobile published toast */}
        {published && (
          <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white rounded-full text-sm font-semibold px-5 py-2 shadow-lg z-50">
            ✓ Published!
          </div>
        )}
      </div>
    </div>
  );
}