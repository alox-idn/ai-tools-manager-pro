import { useState, useEffect, useRef } from "react";
import { 
  FolderKanban, Plus, Trash2, Globe, ShoppingBag, BookOpen, 
  MessageCircle, Crown, ChevronDown, ChevronRight, User, X, 
  Check, ArrowLeft, ArrowRight, RotateCw, LogOut, ShieldCheck, ExternalLink
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  emailOrNote?: string;
  currentUrl?: string;
  isLoggedIn: boolean;
  createdAt: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  loginUrl: string;
  accounts: Account[];
}

const initialPlatforms: Platform[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "💬",
    loginUrl: "https://chatgpt.com/auth/login",
    accounts: [
      { id: "acc-gpt1", name: "Work Account", emailOrNote: "aloxer.1@gmail.com", isLoggedIn: true, createdAt: "Sep 02, 2026" }
    ]
  },
  {
    id: "flow",
    name: "Flow AI",
    icon: "🌊",
    loginUrl: "https://flow.google.com",
    accounts: [
      { id: "acc-flow1", name: "Main Studio", emailOrNote: "Studio Utama", isLoggedIn: false, createdAt: "Sep 02, 2026" }
    ]
  },
  {
    id: "grok",
    name: "Grok",
    icon: "⚡",
    loginUrl: "https://x.com/i/flow/login",
    accounts: []
  },
  {
    id: "claude",
    name: "Claude AI",
    icon: "🧠",
    loginUrl: "https://claude.ai/login",
    accounts: []
  },
  {
    id: "midjourney",
    name: "Midjourney",
    icon: "🎨",
    loginUrl: "https://www.midjourney.com/explore",
    accounts: []
  },
  {
    id: "capcut",
    name: "CapCut Web",
    icon: "🎬",
    loginUrl: "https://www.capcut.com/login",
    accounts: []
  }
];

export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = localStorage.getItem("ai_manager_isolated_sessions");
    return saved ? JSON.parse(saved) : initialPlatforms;
  });

  const [activePlatformId, setActivePlatformId] = useState<string>("chatgpt");
  const [activeAccountId, setActiveAccountId] = useState<string>("acc-gpt1");
  const [expandedPlatforms, setExpandedPlatforms] = useState<Record<string, boolean>>({ chatgpt: true });

  // Browser Frame Controls
  const [browserUrl, setBrowserUrl] = useState<string>("https://chatgpt.com/auth/login");
  const [inputUrl, setInputUrl] = useState<string>("https://chatgpt.com/auth/login");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPlatformId, setTargetPlatformId] = useState<string>("");
  const [newAccName, setNewAccName] = useState("");
  const [newAccNote, setNewAccNote] = useState("");

  useEffect(() => {
    localStorage.setItem("ai_manager_isolated_sessions", JSON.stringify(platforms));
  }, [platforms]);

  const activePlatform = platforms.find((p) => p.id === activePlatformId) || platforms[0];
  const activeAccount = activePlatform?.accounts.find((a) => a.id === activeAccountId);

  // Ganti Akun & Muat Sesi URL Akun Tersebut
  const handleSelectAccount = (platformId: string, acc: Account) => {
    setActivePlatformId(platformId);
    setActiveAccountId(acc.id);
    const target = acc.currentUrl || platforms.find((p) => p.id === platformId)?.loginUrl || "";
    setBrowserUrl(target);
    setInputUrl(target);
  };

  const toggleExpand = (id: string) => {
    setExpandedPlatforms((prev) => ({ ...prev, [id]: !prev[id] }));
    setActivePlatformId(id);
  };

  const openAddAccountModal = (platId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetPlatformId(platId);
    setNewAccName("");
    setNewAccNote("");
    setIsModalOpen(true);
  };

  // Tambah Profil Akun Baru
  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const plat = platforms.find((p) => p.id === targetPlatformId);
    const newAcc: Account = {
      id: `acc-${Date.now()}`,
      name: newAccName.trim(),
      emailOrNote: newAccNote.trim() || undefined,
      currentUrl: plat?.loginUrl,
      isLoggedIn: false,
      createdAt: "Baru ditambahkan"
    };

    setPlatforms((prev) =>
      prev.map((p) => (p.id === targetPlatformId ? { ...p, accounts: [...p.accounts, newAcc] } : p))
    );

    handleSelectAccount(targetPlatformId, newAcc);
    setIsModalOpen(false);
  };

  // Hapus Akun & Bersihkan Sesi
  const handleDeleteAccount = (platId: string, accId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus profil ini beserta sesi loginnya?")) return;

    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platId ? { ...p, accounts: p.accounts.filter((a) => a.id !== accId) } : p
      )
    );

    if (activeAccountId === accId) {
      const remainingAccs = activePlatform.accounts.filter((a) => a.id !== accId);
      if (remainingAccs.length > 0) {
        handleSelectAccount(platId, remainingAccs[0]);
      } else {
        setActiveAccountId("");
        setBrowserUrl(activePlatform.loginUrl);
        setInputUrl(activePlatform.loginUrl);
      }
    }
  };

  // Logout Akun Aktif (Reset ke halaman login legal platform)
  const handleLogoutCurrentAccount = () => {
    if (!activeAccount) return;
    if (!confirm(`Keluar (logout) dari sesi ${activeAccount.name}?`)) return;

    const defaultLogin = activePlatform.loginUrl;
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === activePlatformId) {
          return {
            ...p,
            accounts: p.accounts.map((a) =>
              a.id === activeAccountId ? { ...a, isLoggedIn: false, currentUrl: defaultLogin } : a
            )
          };
        }
        return p;
      })
    );
    setBrowserUrl(defaultLogin);
    setInputUrl(defaultLogin);
  };

  const handleReloadFrame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = browserUrl;
    }
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    setBrowserUrl(url);
    setInputUrl(url);
  };

  return (
    <div className="flex h-screen w-screen bg-[#090b0e] text-slate-200 select-none overflow-hidden font-sans text-xs">
      {/* ================= MODAL TAMBAH AKUN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#12161f] border border-[#212838] rounded-xl shadow-2xl p-5 relative text-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Tambah Profil Akun Baru
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Sesi terisolasi otomatis disiapkan untuk platform <b className="text-cyan-400 uppercase">{targetPlatformId}</b>.
            </p>

            <form onSubmit={handleSaveAccount} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Akun / Profil *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akun Pribadi, Tim Bisnis, Akun VIP"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-[#0a0c10] border border-[#252e3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Catatan / Keterangan Email</label>
                <input
                  type="text"
                  placeholder="Contoh: login via Google / aloxer@gmail.com"
                  value={newAccNote}
                  onChange={(e) => setNewAccNote(e.target.value)}
                  className="w-full bg-[#0a0c10] border border-[#252e3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Buka & Mulai Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PANEL KIRI: MENU AKUN & WORKSPACE ================= */}
      <aside className="w-64 bg-[#0e1117] border-r border-[#1a1f29] flex flex-col justify-between shrink-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Aplikasi */}
          <div className="p-3.5 border-b border-[#1a1f29]">
            <h1 className="text-xs font-black tracking-wider text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              AI TOOLS MANAGER PRO
            </h1>
            <div className="flex items-center gap-2 mt-3 px-2.5 py-1.5 bg-[#141821] rounded-md border border-[#222938]">
              <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-[11px] tracking-wide text-slate-300">DAFTAR AKUN AI</span>
            </div>
          </div>

          {/* List Kategori Platform & Akun Tersimpan */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
            {platforms.map((plat) => {
              const isSelected = activePlatformId === plat.id;
              const isExpanded = !!expandedPlatforms[plat.id];

              return (
                <div key={plat.id} className="rounded-lg overflow-hidden border border-transparent">
                  {/* Item Platform Bar */}
                  <div
                    onClick={() => toggleExpand(plat.id)}
                    className={`flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#161d2a] text-white border border-[#28354b]"
                        : "hover:bg-[#13161f] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{plat.icon}</span>
                      <span className="font-semibold text-[11px]">{plat.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1b2230] text-cyan-400 font-mono">
                        {plat.accounts.length}
                      </span>
                      {isExpanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                    </div>
                  </div>

                  {/* Sub Akun / Sub-Sessions */}
                  {isExpanded && (
                    <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-3.5 my-1">
                      {plat.accounts.map((acc) => {
                        const isAccActive = activePlatformId === plat.id && activeAccountId === acc.id;
                        return (
                          <div
                            key={acc.id}
                            onClick={() => handleSelectAccount(plat.id, acc)}
                            className={`group flex items-center justify-between px-2.5 py-2 rounded-md text-[11px] cursor-pointer transition-all ${
                              isAccActive
                                ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm"
                                : "text-slate-400 hover:bg-[#151922] hover:text-slate-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`w-1.5 h-1.5 rounded-full ${acc.isLoggedIn ? "bg-emerald-400" : "bg-amber-400"}`} />
                              <div className="truncate">
                                <div className="truncate">{acc.name}</div>
                                {acc.emailOrNote && (
                                  <div className="text-[9px] text-slate-500 truncate">{acc.emailOrNote}</div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteAccount(plat.id, acc.id, e)}
                              className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-1"
                              title="Hapus profil & session akun"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Tombol Tambah Akun Baru */}
                      <button
                        onClick={(e) => openAddAccountModal(plat.id, e)}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-cyan-400 hover:text-cyan-300 border border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-md transition-all bg-cyan-500/5 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Akun {plat.name}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Sidebar */}
          <div className="p-3 border-t border-[#1a1f29] space-y-2">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#22c55e] hover:bg-[#1eb355] text-slate-950 font-bold rounded-lg transition-colors text-[11px]"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp Support
            </a>
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold rounded-lg transition-all shadow-md text-[11px]">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> Upgrade VIP Member
            </button>
          </div>
        </div>
      </aside>

      {/* ================= PANEL KANAN: FRAME BROWSER MULTI-SESSION ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090c]">
        {/* Top Navbar Header */}
        <header className="h-12 px-5 border-b border-[#1a1f29] flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              AI TOOLS MANAGER <span className="text-cyan-400 font-mono text-[10px]">v1.0.16</span>
            </span>
            <span className="text-slate-600 text-xs">|</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Sesi Terisolasi & Terenkripsi Aman
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px]">
              <Globe className="w-3 h-3" /> HOME
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded text-[10px]">
              <BookOpen className="w-3 h-3" /> KELAS
            </button>
            <button className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[10px]">
              <ShoppingBag className="w-3 h-3" /> SHOP
            </button>

            <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-slate-800">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] text-slate-300 font-medium">aloxer.1@gmail.com</span>
            </div>
          </div>
        </header>

        {/* Browser In-App Navigation Bar */}
        <div className="h-11 px-4 border-b border-[#161a22] flex items-center gap-2 bg-[#0b0e13]">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => window.history.back()}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1a1f2b]"
              title="Kembali"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => window.history.forward()}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1a1f2b]"
              title="Maju"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleReloadFrame}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1a1f2b]"
              title="Muat Ulang"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* URL Search Bar */}
          <form onSubmit={handleNavigate} className="flex-1 max-w-2xl mx-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-[#131720] border border-[#212938] text-slate-200 text-xs rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-cyan-500"
              />
              <button type="submit" className="absolute right-2 text-slate-400 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Informasi Profil Aktif & Logout */}
          <div className="flex items-center gap-2 ml-auto">
            {activeAccount ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#162030] text-cyan-300 border border-[#263752]">
                  Profil: <b>{activeAccount.name}</b>
                </span>
                <button
                  onClick={handleLogoutCurrentAccount}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] transition-colors"
                  title="Logout akun ini dari webview"
                >
                  <LogOut className="w-3 h-3" /> Logout
                </button>
              </div>
            ) : (
              <span className="text-[10px] text-slate-500">Pilih atau tambah akun di sidebar kiri</span>
            )}
          </div>
        </div>

        {/* Frame Browser Interaktif (Session Isolated Webview) */}
        <main className="flex-1 w-full h-full relative bg-[#090b0e] p-2">
          <div className="w-full h-full rounded-xl overflow-hidden border border-[#1b202a] bg-black relative shadow-inner">
            <iframe
              ref={iframeRef}
              key={`${activePlatformId}-${activeAccountId || "guest"}`}
              src={browserUrl}
              title={`Browser - ${activePlatform.name}`}
              className="w-full h-full border-0"
              allow="camera; microphone; clipboard-read; clipboard-write; fullscreen"
            />
          </div>
        </main>
      </div>
    </div>
  );
}