export interface ToolItem {
  id: string;
  name: string;
  category: "local" | "cloud" | "utility";
  desc: string;
  downloadUrl?: string;
  webUrl?: string;
  isInstalled?: boolean;
}

export const toolsCatalog: ToolItem[] = [
  {
    id: "ollama",
    name: "Ollama",
    category: "local",
    desc: "Jalankan model bahasa besar (LLaMA 3, Mistral, Gemma) secara lokal.",
    downloadUrl: "https://ollama.com/download/OllamaSetup.exe",
    webUrl: "https://ollama.com"
  },
  {
    id: "comfyui",
    name: "ComfyUI Portable",
    category: "local",
    desc: "Workflow modular node-based untuk Stable Diffusion & Flux.",
    downloadUrl: "https://github.com/comfyanonymous/ComfyUI/releases",
    webUrl: "https://github.com/comfyanonymous/ComfyUI"
  },
  {
    id: "lmstudio",
    name: "LM Studio",
    category: "local",
    desc: "GUI desktop intuitif untuk bereksperimen dengan LLM lokal.",
    downloadUrl: "https://lmstudio.ai/",
    webUrl: "https://lmstudio.ai"
  }
];