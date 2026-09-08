import { useState } from "react";
import { open } from "@tauri-apps/plugin-shell";
import { toolsCatalog, ToolItem } from "./data/tools";
import { Download, ExternalLink, Cpu, Search } from "lucide-react";

export default function App() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const handleAction = async (tool: ToolItem) => {
    const targetUrl = tool.downloadUrl || tool.webUrl;
    if (targetUrl) {
      await open(targetUrl);
    }
  };

  const filteredTools = toolsCatalog.filter((t) => {
    const matchCategory = filter === "all" || t.category === filter;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                        t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="text-cyan-400 w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">AI Tools Manager <span className="text-cyan-400">PRO</span></h1>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari alat AI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        {/* Kategori Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "local", "cloud"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === cat
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {cat === "all" ? "Semua Alat" : cat === "local" ? "Model Lokal" : "Cloud / Daring"}
            </button>
          ))}
        </div>

        {/* Grid Alat */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-base">{tool.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase tracking-wider">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{tool.desc}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(tool)}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold py-2 px-3 rounded-lg border border-cyan-500/30 transition-all"
                >
                  <Download className="w-4 h-4" /> Download / Buka
                </button>
                {tool.webUrl && (
                  <button
                    onClick={() => open(tool.webUrl!)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                    title="Buka Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}