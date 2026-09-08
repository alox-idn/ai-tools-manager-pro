import { useState, useEffect } from "react";
import { 
  FolderKanban, Plus, Trash2, ExternalLink, Globe, 
  ShoppingBag, BookOpen, MessageCircle, Crown, ChevronDown, ChevronRight, User
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  notes?: string;
  url?: string;
}

interface ToolPlatform {
  id: string;
  name: string;
  defaultUrl: string;
  iconText: string;
  accounts: Account[];
}

const initialPlatforms: ToolPlatform[] = [
  {
    id: "flow",
    name: "Flow",
    defaultUrl: "https://flow.google.com",
    iconText: "🌊",
    accounts: [{ id: "acc-1", name: "alox1", notes: "Akun Utama" }]
  },
  {
    id: "dola",
    name: "Dola",
    defaultUrl: "https://dola.ai",
    iconText: "🤖",
    accounts: []
  },
  {
    id: "grok",
    name: "Grok",
    defaultUrl: "https://x.com/i/grok",
    iconText: "⚡",
    accounts: []
  },
  {
    id: "migoo",
    name: "Migoo",
    defaultUrl: "https://migoo.ai",
    iconText: "🎨",
    accounts: []
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    defaultUrl: "https://chatgpt.com",
    iconText: "💬",
    accounts: [{ id: "acc-gpt1", name: "Work Team", notes: "Plus" }]
  },
  {
    id: "google-notes",
    name: "Google Notes",
    defaultUrl: "https://keep.google.com",
    iconText: "📝",
    accounts: []
  },
  {
    id: "capcut",
    name: "CapCut",
    defaultUrl: "https://www.capcut.com/editor",
    iconText: "🎬",
    accounts: []
  }
];

export default function App() {
  const [platforms, setPlatforms] = useState<ToolPlatform[]>(() => {
    const saved = localStorage.getItem("ai_tools_platforms");
    return saved ? JSON.parse(saved) : initialPlatforms;
  });

  const [activePlatformId, setActivePlatformId] = useState<string>("flow");
  const [activeAccountId, setActiveAccountId] = useState<string>("acc-1");
  const [expandedPlatforms, setExpandedPlatforms] = useState<Record<string, boolean>>({ flow: true });

  useEffect(() => {
    localStorage.setItem("ai_tools_platforms", JSON.stringify(platforms));
  }, [platforms]);

  const activePlatform = platforms.find((p) => p.id === activePlatformId) || platforms[0];
  const activeAccount = activePlatform?.accounts.find((a) => a.id === activeAccountId);

  // Toggle Collapse Platform
  const togglePlatformExpand = (id: string) => {
    setExpandedPlatforms((prev) => ({ ...prev, [id]: !prev[id] }));
    setActivePlatformId(id);
  };

  // Tambah Akun Baru ke Platform Tertentu
  const handleAddAccount = (platformId: string) => {
    const accountName = prompt("Masukkan nama akun / label baru (contoh: akun2, tim-a):");
    if (!accountName || !accountName.trim()) return;

    const newAccount: Account = {
      id: "acc-" + Date.now(),
      name: accountName.trim(),
      notes: "Profil Mandiri"
    };

    setPlatforms((prev) =>
      prev.map((plat) => {
        if (plat.id === platformId) {
          return {
            ...plat,
            accounts: [...plat.accounts, newAccount]
          };
        }
        return plat;
      })
    );
    setActivePlatformId(platformId);
    setActiveAccountId(newAccount.id);
  };

  // Hapus Akun
  const handleDeleteAccount = (platformId: string, accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus profil akun ini?")) return;

    setPlatforms((prev) =>
      prev.map((plat) => {
        if (plat.id === platformId) {
          return {
            ...plat,
            accounts: plat.accounts.filter((a) => a.id !== accountId)
          };
        }
        return plat;
      })
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#0d0f12] text-slate-200 select-none overflow-hidden font-sans">
      {/* ================= SIDEBAR KIRI ================= */}
      <aside className="w-64 bg-[#111317] border-r border-[#1e2229] flex flex-col justify-between shrink-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header Sidebar */}
          <div className="p-4 border-b border-[#1e2229]">
            <h1 className="text-sm font-bold tracking-wider text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span>
              AI TOOLS MANAGER
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 px-2 py-1.5 bg-[#171a20] rounded-md border border-[#232731]">
              <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-300">WORKSPACE</span>
            </div>
          </div>

          {/* List AI Platforms */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
            {platforms.map((plat) => {
              const isSelected = activePlatformId === plat.id;
              const isExpanded = !!expandedPlatforms[plat.id];

              return (
                <div key={plat.id} className="rounded-lg overflow-hidden transition-colors">
                  {/* Platform Item Bar */}
                  <div
                    onClick={() => togglePlatformExpand(plat.id)}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer rounded-lg transition-all ${
                      isSelected ? "bg-[#1a202c] text-white border border-[#2b3548]" : "hover:bg-[#16191f] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{plat.iconText}</span>
                      <span>{plat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#202530] text-slate-400 font-mono">
                        {plat.accounts.length}
                      </span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Sub-Accounts Tree */}
                  {isExpanded && (
                    <div className="pl-6 pr-2 py-1.5 space-y-1 border-l border-slate-800 ml-4 my-1">
                      {plat.accounts.map((acc) => {
                        const isAccActive = activePlatformId === plat.id && activeAccountId === acc.id;
                        return (
                          <div
                            key={acc.id}
                            onClick={() => {
                              setActivePlatformId(plat.id);
                              setActiveAccountId(acc.id);
                            }}
                            className={`group flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] cursor-pointer transition-all ${
                              isAccActive ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-slate-400 hover:bg-[#1a1e26] hover:text-slate-200"
                            }`}
                          >
                            <span className="truncate">{acc.name}</span>
                            <button
                              onClick={(e) => handleDeleteAccount(plat.id, acc.id, e)}
                              className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}

                      <button
                        onClick={() => handleAddAccount(plat.id)}
                        className="w-full mt-1 flex items-center justify-center gap-1.5 py-1 text-[10px] text-cyan-400 hover:text-cyan-300 border border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded transition-all bg-cyan-500/5"
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
          <div className="p-3 border-t border-[#1e2229] space-y-2">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> WhatsApp
            </a>
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-indigo-950/40">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> Upgrade Premium
            </button>
          </div>
        </div>
      </aside>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0d0f12]">
        {/* Top Navbar */}
        <header className="h-14 px-6 border-b border-[#1e2229] flex items-center justify-between bg-[#111317]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                AI TOOLS MANAGER <span className="text-cyan-400 text-[10px] font-mono">v1.0.15</span>
              </span>
              <span className="text-[10px] text-slate-400">Akses Banyak Macam Tools AI dalam 1 APP</span>
            </div>
          </div>

          {/* Navigation Badges & Profil */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
              <Globe className="w-3.5 h-3.5" /> HOME
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
              <BookOpen className="w-3.5 h-3.5" /> KELAS
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" /> SHOP
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-300 font-medium">aloxer.1@gmail.com</span>
            </div>
          </div>
        </header>

        {/* Action Toolbar Platform */}
        <div className="px-6 py-3 border-b border-[#1a1e24] flex items-center justify-between bg-[#0e1014]">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{activePlatform.name}</span>
              {activeAccount && (
                <span className="text-xs font-normal text-slate-400 bg-[#1a1e26] px-2.5 py-0.5 rounded-full border border-slate-800">
                  Akun: <b className="text-cyan-400">{activeAccount.name}</b>
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activePlatform.defaultUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#1a1e26] hover:bg-[#232934] text-slate-300 rounded border border-[#2b3342] transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Buka Browser Asli
            </a>
          </div>
        </div>

        {/* Webview / Workspace Viewport */}
        <main className="flex-1 p-4 overflow-hidden relative">
          <div className="w-full h-full rounded-xl border border-[#1e2229] bg-[#14171d] overflow-hidden flex flex-col">
            {/* Embedded Web View */}
            <iframe
              key={`${activePlatform.id}-${activeAccountId}`}
              src={activePlatform.defaultUrl}
              title={activePlatform.name}
              className="w-full h-full border-0 bg-[#0d0f12]"
              allow="microphone; camera; clipboard-write; clipboard-read;"
            />
          </div>
        </main>
      </div>
    </div>
  );
}