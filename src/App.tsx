import { useState, useEffect } from "react";
import { 
  FolderKanban, Plus, Trash2, ExternalLink, Globe, 
  ShoppingBag, BookOpen, MessageCircle, Crown, ChevronDown, 
  ChevronRight, User, X, Check 
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  emailOrToken?: string;
  customUrl?: string;
  createdAt: string;
}

interface ProjectItem {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  defaultUrl: string;
  accounts: Account[];
  subTabs: string[];
}

const initialPlatforms: Platform[] = [
  {
    id: "flow",
    name: "Flow",
    icon: "🌊",
    defaultUrl: "https://flow.google.com",
    subTabs: ["Flow Music", "Flow TV", "Discord", "Instagram", "X (Twitter)"],
    accounts: [
      { id: "acc-1", name: "alox1", emailOrToken: "aloxer.1@gmail.com", createdAt: "Sep 02, 2026" }
    ]
  },
  {
    id: "dola",
    name: "Dola",
    icon: "🤖",
    defaultUrl: "https://dola.ai",
    subTabs: ["Chat", "Agent Mode", "Settings"],
    accounts: []
  },
  {
    id: "grok",
    name: "Grok",
    icon: "⚡",
    defaultUrl: "https://x.com/i/grok",
    subTabs: ["Fun Mode", "Think Mode"],
    accounts: []
  },
  {
    id: "migoo",
    name: "Migoo",
    icon: "🎨",
    defaultUrl: "https://migoo.ai",
    subTabs: ["Generate", "Gallery"],
    accounts: []
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    icon: "💬",
    defaultUrl: "https://chatgpt.com",
    subTabs: ["GPT-4o", "Canvas", "DALL-E"],
    accounts: [
      { id: "acc-gpt", name: "Work Pro", emailOrToken: "team@workspace.com", createdAt: "Aug 15, 2026" }
    ]
  },
  {
    id: "google-notes",
    name: "Google Notes",
    icon: "📝",
    defaultUrl: "https://keep.google.com",
    subTabs: ["Notes", "Archive"],
    accounts: []
  },
  {
    id: "capcut",
    name: "CapCut",
    icon: "🎬",
    defaultUrl: "https://www.capcut.com/editor",
    subTabs: ["Video Editor", "Cloud Space"],
    accounts: []
  }
];

const mockProjects: Record<string, ProjectItem[]> = {
  flow: [
    {
      id: "p1",
      title: "Temple Cinematic Shoot",
      thumbnail: "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=600&auto=format&fit=crop&q=80",
      date: "Sep 02, 04:40 PM"
    },
    {
      id: "p2",
      title: "Ancient Pavilion Courtyard",
      thumbnail: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&auto=format&fit=crop&q=80",
      date: "Sep 02, 03:35 PM"
    },
    {
      id: "p3",
      title: "3D Cartoon Boy Playing",
      thumbnail: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=600&auto=format&fit=crop&q=80",
      date: "Sep 02, 03:04 PM"
    }
  ]
};

export default function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = localStorage.getItem("ai_manager_platforms_v2");
    return saved ? JSON.parse(saved) : initialPlatforms;
  });

  const [activePlatformId, setActivePlatformId] = useState<string>("flow");
  const [activeAccountId, setActiveAccountId] = useState<string>("acc-1");
  const [expandedPlatforms, setExpandedPlatforms] = useState<Record<string, boolean>>({ flow: true });
  const [activeSubTab, setActiveSubTab] = useState<string>("Flow Music");

  // Modal Tambah Akun
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPlatformId, setTargetPlatformId] = useState<string>("");
  const [newAccName, setNewAccName] = useState("");
  const [newAccToken, setNewAccToken] = useState("");
  const [newAccUrl, setNewAccUrl] = useState("");

  useEffect(() => {
    localStorage.setItem("ai_manager_platforms_v2", JSON.stringify(platforms));
  }, [platforms]);

  const activePlatform = platforms.find((p) => p.id === activePlatformId) || platforms[0];
  const activeAccount = activePlatform?.accounts.find((a) => a.id === activeAccountId);
  const projects = mockProjects[activePlatformId] || [];

  const toggleExpand = (id: string) => {
    setExpandedPlatforms((prev) => ({ ...prev, [id]: !prev[id] }));
    setActivePlatformId(id);
  };

  const openAddAccountModal = (platId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetPlatformId(platId);
    setNewAccName("");
    setNewAccToken("");
    setNewAccUrl("");
    setIsModalOpen(true);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;

    const newAcc: Account = {
      id: "acc-" + Date.now(),
      name: newAccName.trim(),
      emailOrToken: newAccToken.trim() || undefined,
      customUrl: newAccUrl.trim() || undefined,
      createdAt: "Just now"
    };

    setPlatforms((prev) =>
      prev.map((p) => (p.id === targetPlatformId ? { ...p, accounts: [...p.accounts, newAcc] } : p))
    );

    setActivePlatformId(targetPlatformId);
    setActiveAccountId(newAcc.id);
    setIsModalOpen(false);
  };

  const handleDeleteAccount = (platId: string, accId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus akun ini dari workspace?")) return;
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platId ? { ...p, accounts: p.accounts.filter((a) => a.id !== accId) } : p
      )
    );
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0c0f] text-slate-200 select-none overflow-hidden font-sans text-xs">
      {/* ================= MODAL TAMBAH AKUN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#13171f] border border-[#222938] rounded-xl shadow-2xl p-5 relative text-slate-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Tambah Akun Baru
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Masukkan profil untuk platform <span className="text-cyan-400 uppercase font-bold">{targetPlatformId}</span>
            </p>

            <form onSubmit={handleSaveAccount} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nama Profil / Label Akun *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akun Pribadi, VIP 2, Tim Design"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-[#0a0c10] border border-[#262f40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email / Sesi Token / Catatan</label>
                <input
                  type="text"
                  placeholder="user@gmail.com / session-cookie (opsional)"
                  value={newAccToken}
                  onChange={(e) => setNewAccToken(e.target.value)}
                  className="w-full bg-[#0a0c10] border border-[#262f40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Custom Workspace URL</label>
                <input
                  type="url"
                  placeholder="https://... (kosongkan untuk URL default)"
                  value={newAccUrl}
                  onChange={(e) => setNewAccUrl(e.target.value)}
                  className="w-full bg-[#0a0c10] border border-[#262f40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
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
                  <Check className="w-3.5 h-3.5" /> Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SIDEBAR WORKSPACE ================= */}
      <aside className="w-60 bg-[#0f1217] border-r border-[#1a1f29] flex flex-col justify-between shrink-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Brand */}
          <div className="p-3.5 border-b border-[#1a1f29]">
            <h1 className="text-xs font-black tracking-wider text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
              AI TOOLS MANAGER
            </h1>
            <div className="flex items-center gap-2 mt-3 px-2.5 py-1.5 bg-[#141821] rounded-md border border-[#222938]">
              <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-[11px] tracking-wide text-slate-300">WORKSPACE</span>
            </div>
          </div>

          {/* List AI Platforms */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin">
            {platforms.map((plat) => {
              const isSelected = activePlatformId === plat.id;
              const isExpanded = !!expandedPlatforms[plat.id];

              return (
                <div key={plat.id} className="rounded-lg overflow-hidden">
                  <div
                    onClick={() => toggleExpand(plat.id)}
                    className={`flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#18202e] text-white border border-[#2c3952]"
                        : "hover:bg-[#131720] text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{plat.icon}</span>
                      <span className="font-semibold text-[11px]">{plat.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {plat.accounts.length} &gt;
                      </span>
                      {isExpanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                    </div>
                  </div>

                  {/* Sub-Akun Container */}
                  {isExpanded && (
                    <div className="pl-4 pr-1 py-1.5 space-y-1 border-l border-slate-800 ml-3.5 my-1">
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
                              isAccActive
                                ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30"
                                : "text-slate-400 hover:bg-[#151922] hover:text-slate-200"
                            }`}
                          >
                            <span className="truncate">{acc.name}</span>
                            <button
                              onClick={(e) => handleDeleteAccount(plat.id, acc.id, e)}
                              className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5"
                              title="Hapus akun"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Tombol Tambah Akun */}
                      <button
                        onClick={(e) => openAddAccountModal(plat.id, e)}
                        className="w-full flex items-center justify-center gap-1 py-1 text-[10px] text-cyan-400 hover:text-cyan-300 border border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded transition-all bg-cyan-500/5 mt-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Akun {plat.name}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Action Dock */}
          <div className="p-2.5 border-t border-[#1a1f29] space-y-1.5">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#22c55e] hover:bg-[#1eb355] text-slate-950 font-bold rounded-lg transition-colors text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp
            </a>
            <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-lg transition-all shadow-md text-[11px]">
              <Crown className="w-3.5 h-3.5 text-amber-300" /> Upgrade Premium
            </button>
          </div>
        </div>
      </aside>

      {/* ================= AREA KANAN (NAVBAR + WORKSPACE) ================= */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090c]">
        {/* Top Navbar Header */}
        <header className="h-12 px-5 border-b border-[#1a1f29] flex items-center justify-between bg-[#0f1217]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              AI TOOLS MANAGER <span className="text-cyan-400 font-mono text-[10px]">v1.0.15</span>
            </span>
            <span className="text-slate-600 text-xs">|</span>
            <span className="text-[10px] text-slate-400">Akses Banyak Macam Tools AI dalam 1 APP</span>
          </div>

          {/* Tombol Aksi Kanan & Profile */}
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

            {/* Profile Pill */}
            <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-slate-800">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] text-slate-300 font-medium">aloxer.1@gmail.com</span>
            </div>
          </div>
        </header>

        {/* Sub Navigation Bar (Flow Music, Flow TV, dll.) */}
        <div className="h-12 px-5 border-b border-[#161a22] flex items-center justify-between bg-[#0c0e13]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white mr-2 flex items-center gap-1.5">
              <span>Google {activePlatform.name}</span>
              {activeAccount && (
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#1b2230] text-cyan-400 border border-[#2d3950]">
                  {activeAccount.name}
                </span>
              )}
            </h2>
          </div>

          {/* Subtabs Filter Tabs */}
          <div className="flex items-center gap-1.5">
            {activePlatform.subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activeSubTab === tab
                    ? "bg-[#1f2633] text-white border border-[#303c52]"
                    : "text-slate-400 hover:bg-[#141821] hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
            <a
              href={activeAccount?.customUrl || activePlatform.defaultUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-slate-400 hover:text-white"
              title="Buka Tab Luar"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ================= WORKSPACE CONTENT (CARDS / PROJECTS) ================= */}
        <main className="flex-1 p-5 overflow-y-auto bg-[#08090d]">
          {/* Grid Proyek */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {projects.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-[#10131a] border border-[#1d2330] hover:border-slate-600 transition-all cursor-pointer shadow-lg"
              >
                <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                    <span className="text-[11px] font-semibold text-white drop-shadow">{item.title}</span>
                    <span className="text-[10px] text-slate-300 font-mono">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Project Floating / Center Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => alert(`Membuat proyek baru di ${activePlatform.name} (${activeAccount?.name || "Default"})`)}
              className="px-6 py-3 bg-[#151922] hover:bg-[#1c2230] border border-[#2b3548] text-slate-300 hover:text-white rounded-2xl flex items-center gap-2 font-medium shadow-xl transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New project</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}