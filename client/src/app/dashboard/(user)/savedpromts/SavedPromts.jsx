"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  Sparkles,
  Search,
  Trash2,
  Copy,
  Check,
  Eye,
  Zap,
  Lock,
  Globe,
  Grid3X3,
  List,
  X,
  Star,
  Layers,
  Tag,
  ChevronRight,
  Terminal,
  Download,
  ArrowUpDown,
} from "lucide-react";

// Mock saved prompts dataset
const INITIAL_SAVED_PROMPTS = [
  {
    id: "saved-1",
    promptId: "p-101",
    title: "SaaS Cold Email Sequence (5-Step High Conversion)",
    description:
      "A battle-tested 5-touch email cadence tailored for B2B founders and outbound sales SDRs to book qualified demos.",
    content:
      "Act as an elite B2B copywriter. Write a personalized 5-step cold email cadence targeting [Target Persona] at [Industry] companies. Each email must have: 1. Pattern interrupt subject line (< 4 words), 2. Specific industry pain point regarding [Problem], 3. Low-friction soft CTA.",
    category: "Marketing & Copywriting",
    aiTool: "ChatGPT",
    aiModel: "GPT-4o",
    difficulty: "Beginner",
    visibility: "Public",
    rating: 4.9,
    reviewsCount: 38,
    copies: 142,
    savedAt: "2025-02-20",
    author: {
      name: "Alex Morgan",
      role: "Growth Marketer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    tags: ["email-marketing", "b2b-sales", "outreach", "copywriting"],
  },
  {
    id: "saved-2",
    promptId: "p-102",
    title: "Full-Stack Next.js 16 Clean Architecture Boilerplate",
    description:
      "Production-ready architectural layout generator with App Router, Better Auth, Server Actions, and Tailwind CSS patterns.",
    content:
      "You are a Senior Full-Stack Architect specializing in Next.js 16 and TypeScript. Scaffold a scalable folder hierarchy and design pattern for an enterprise web app with feature modules: [Module A], [Module B].",
    category: "Coding & Development",
    aiTool: "Claude",
    aiModel: "Claude 3.5 Sonnet",
    difficulty: "Pro",
    visibility: "Public",
    rating: 5.0,
    reviewsCount: 64,
    copies: 389,
    savedAt: "2025-02-21",
    author: {
      name: "Sarah Chen",
      role: "Staff Engineer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    tags: ["nextjs", "typescript", "architecture", "webdev"],
  },
  {
    id: "saved-3",
    promptId: "p-103",
    title: "Cyberpunk Cinematic Portrait & Neon Volumetric Lighting",
    description:
      "Hyper-realistic 8k octane render prompt with anamorphic lens glare, moody rainy atmosphere, and neon color palettes.",
    content:
      "/imagine prompt: Ultra-realistic cinematic 8k portrait of [Character Description] standing in a rainy Neo-Tokyo alleyway, drenched in cyan and magenta neon light reflections, octane render, Hasselblad 80mm lens, f/1.4 aperture --ar 16:9 --v 6.0",
    category: "Art & Image Generation",
    aiTool: "Midjourney",
    aiModel: "Midjourney v6",
    difficulty: "Intermediate",
    visibility: "Public",
    rating: 4.8,
    reviewsCount: 49,
    copies: 215,
    savedAt: "2025-02-18",
    author: {
      name: "Marcus Vance",
      role: "3D Visual Artist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    tags: ["midjourney", "photorealism", "cyberpunk", "lighting"],
  },
  {
    id: "saved-4",
    promptId: "p-104",
    title: "Multi-Agent Autonomous Research & Fact-Checking Engine",
    description:
      "Advanced reasoning framework enabling Gemini to break down conflicting source documents and cross-validate data.",
    content:
      "Act as an automated multi-agent research pipeline. Phase 1: Extract core factual claims from [Provided Text]. Phase 2: Identify assumptions or unverified assertions. Phase 3: Format findings into an executive brief.",
    category: "Productivity & Research",
    aiTool: "Google Gemini",
    aiModel: "Gemini 1.5 Pro",
    difficulty: "Pro",
    visibility: "Private",
    rating: 4.9,
    reviewsCount: 22,
    copies: 87,
    savedAt: "2025-02-23",
    author: {
      name: "Elena Rostova",
      role: "AI Researcher",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    tags: ["gemini", "research", "agentic-ai", "analysis"],
  },
  {
    id: "saved-5",
    promptId: "p-105",
    title: "3D Isometric SaaS App Icon Generator with Glassmorphic Rig",
    description:
      "Generates clean, Apple-inspired 3D icons with frosted glass textures and soft ambient shadows for modern web interfaces.",
    content:
      "Modern 3D isometric icon of [Application Icon Concept], frosted glass texture with translucent refractive materials, smooth rounded bevels, soft ambient studio lighting, octane render, Figma 3D asset style --v 6.0",
    category: "Design & 3D Assets",
    aiTool: "DALL-E 3",
    aiModel: "DALL-E 3 HD",
    difficulty: "Intermediate",
    visibility: "Public",
    rating: 4.7,
    reviewsCount: 19,
    copies: 176,
    savedAt: "2025-02-15",
    author: {
      name: "David Kim",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&q=80",
    tags: ["dalle-3", "isometric", "icon-design", "3d-art"],
  },
  {
    id: "saved-6",
    promptId: "p-106",
    title: "High-Ticket B2B Sales Objection Handling Matrix",
    description:
      "Instant response scripts for the top 10 pricing, timing, and competitor objections in enterprise software deals.",
    content:
      "You are an enterprise sales strategist. When a buyer states: '[Buyer Objection]', generate 3 distinct response frameworks: 1. Empathy-Reflect Pivot, 2. ROI Contrast, 3. Low-Risk Pilot Proposal.",
    category: "Business & Sales",
    aiTool: "ChatGPT",
    aiModel: "GPT-4o",
    difficulty: "Beginner",
    visibility: "Public",
    rating: 4.9,
    reviewsCount: 31,
    copies: 95,
    savedAt: "2025-02-12",
    author: {
      name: "Jordan Lee",
      role: "Sales Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    },
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
    tags: ["sales", "negotiation", "enterprise", "scripts"],
  },
];

const DIFFICULTY_STYLES = {
  beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  pro: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function SavedPromts() {
  const [savedPrompts, setSavedPrompts] = useState(INITIAL_SAVED_PROMPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [toolFilter, setToolFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const [copiedId, setCopiedId] = useState(null);
  const [previewPrompt, setPreviewPrompt] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastRemovedPrompt, setLastRemovedPrompt] = useState(null);

  const availableTools = useMemo(() => {
    const tools = new Set(savedPrompts.map((p) => p.aiTool));
    return ["all", ...Array.from(tools)];
  }, [savedPrompts]);

  const filteredPrompts = useMemo(() => {
    return savedPrompts
      .filter((prompt) => {
        const matchesSearch =
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.aiTool.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesTool = toolFilter === "all" || prompt.aiTool === toolFilter;
        const matchesDifficulty =
          difficultyFilter === "all" ||
          prompt.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

        return matchesSearch && matchesTool && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.savedAt) - new Date(a.savedAt);
        }
        if (sortBy === "copies") {
          return b.copies - a.copies;
        }
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [savedPrompts, searchQuery, toolFilter, difficultyFilter, sortBy]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyPrompt = (prompt) => {
    const textToCopy = prompt.content || prompt.description || prompt.title;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(prompt.id);
    showToast(`Copied "${prompt.title.slice(0, 30)}..." to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemoveBookmark = (id) => {
    const removed = savedPrompts.find((p) => p.id === id);
    if (removed) {
      setLastRemovedPrompt(removed);
      setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      showToast("Removed from saved prompts.");
    }
  };

  const handleUndoRemoval = () => {
    if (lastRemovedPrompt) {
      setSavedPrompts((prev) => [lastRemovedPrompt, ...prev]);
      setLastRemovedPrompt(null);
      setToastMessage(null);
    }
  };

  const handleExportSaved = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(savedPrompts, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "promptmatrix_saved_prompts.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Exported all saved prompts to JSON!");
  };

  const totalCopies = savedPrompts.reduce((acc, curr) => acc + (curr.copies || 0), 0);
  const totalTools = new Set(savedPrompts.map((p) => p.aiTool)).size;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Stats */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Bookmark className="h-3.5 w-3.5 fill-primary/20" />
              <span>Personal Bookmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Saved <span className="ai-gradient-text">Prompts</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Your curated collection of high-performing AI prompt templates. Ready to copy, test, and adapt for your daily workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportSaved}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all shadow-xs"
              title="Export saved prompts as JSON"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Export Collection</span>
            </button>
            <Link
              href="/allpromts"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
            >
              <Search className="h-4 w-4" />
              <span>Discover More Prompts</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Saved Prompts</p>
              <p className="font-extrabold text-foreground text-sm">{savedPrompts.length} items</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">AI Tools</p>
              <p className="font-extrabold text-foreground text-sm">{totalTools} Ecosystems</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Copy className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Total Copies</p>
              <p className="font-extrabold text-foreground text-sm">{totalCopies} executions</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Star className="h-4 w-4 fill-emerald-400/20" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Avg. Quality</p>
              <p className="font-extrabold text-foreground text-sm">4.9 ★ Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search, Filter & View Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved prompts by title, keywords, tags, or AI tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Tool:</span>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              {availableTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool === "all" ? "All AI Tools" : tool}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Level:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="pro">Pro</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="newest">Recently Saved</option>
              <option value="copies">Most Copied</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-0.5 ml-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Grid or List */}
      {filteredPrompts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20">
            <Bookmark className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {searchQuery || toolFilter !== "all" || difficultyFilter !== "all"
                ? "No matching saved prompts found"
                : "Your Saved Collection is Empty"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {searchQuery || toolFilter !== "all" || difficultyFilter !== "all"
                ? "Try adjusting your keywords or clearing the active filters."
                : "Bookmark prompts from the marketplace to access them instantly here whenever you need inspiration."}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {searchQuery || toolFilter !== "all" || difficultyFilter !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setToolFilter("all");
                  setDifficultyFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Reset Search Filters
              </button>
            ) : (
              <Link
                href="/allpromts"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <Search className="h-4 w-4" />
                <span>Explore All Prompts</span>
              </Link>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => {
            const difficultyStyle =
              DIFFICULTY_STYLES[prompt.difficulty.toLowerCase()] ||
              "bg-muted text-muted-foreground border-border";
            const isPrivate = prompt.visibility?.toLowerCase() === "private";
            const isDeleting = deleteConfirmId === prompt.id;
            const isCopied = copiedId === prompt.id;

            return (
              <div
                key={prompt.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-muted/40">
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg bg-background/85 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-md shadow-xs border border-border/50">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span>{prompt.aiModel || prompt.aiTool}</span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md ${
                          isPrivate ? "bg-amber-500/90" : "bg-emerald-600/90"
                        }`}
                      >
                        {isPrivate ? <Lock className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                        {isPrivate ? "Pro" : "Public"}
                      </span>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(prompt.id)}
                        className="p-1.5 rounded-lg bg-background/85 text-muted-foreground hover:text-destructive hover:bg-background backdrop-blur-md border border-border/50 transition-colors"
                        title="Remove from saved prompts"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md backdrop-blur-xs border border-border/40">
                        <Layers className="h-3 w-3 text-primary" />
                        {prompt.category}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border backdrop-blur-xs ${difficultyStyle}`}
                      >
                        {prompt.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 pb-3 space-y-3">
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {prompt.description}
                    </p>

                    {prompt.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {prompt.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-foreground">{prompt.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({prompt.reviewsCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Copy className="h-3 w-3 text-primary" />
                      <strong className="text-foreground">{prompt.copies}</strong> copies
                    </div>
                  </div>

                  {isDeleting ? (
                    <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-between gap-2 animate-in fade-in">
                      <span className="text-[11px] font-medium text-destructive">Remove prompt?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRemoveBookmark(prompt.id)}
                          className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-[10px] font-bold hover:bg-destructive/90 transition-all"
                        >
                          Yes, Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground text-[10px]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(prompt)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border py-2 px-3 text-xs font-semibold transition-all ${
                          isCopied
                            ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                            : "border-border/80 bg-background hover:bg-accent text-foreground"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPreviewPrompt(prompt)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary py-2 px-3 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Quick View</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Saved Prompt</th>
                  <th className="py-3.5 px-4">AI Model</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Rating & Copies</th>
                  <th className="py-3.5 px-4">Saved Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPrompts.map((prompt) => {
                  const difficultyStyle =
                    DIFFICULTY_STYLES[prompt.difficulty.toLowerCase()] ||
                    "bg-muted text-muted-foreground border-border";
                  const isCopied = copiedId === prompt.id;
                  const isDeleting = deleteConfirmId === prompt.id;

                  return (
                    <tr key={prompt.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prompt.thumbnail}
                            alt={prompt.title}
                            className="h-10 w-10 rounded-lg object-cover border border-border/60 shrink-0"
                          />
                          <div className="max-w-[260px]">
                            <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                              {prompt.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {prompt.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <Zap className="h-3 w-3" />
                          {prompt.aiModel || prompt.aiTool}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground font-medium">
                        {prompt.category}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${difficultyStyle}`}
                        >
                          {prompt.difficulty}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 font-bold text-foreground">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span>{prompt.rating}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {prompt.copies} copies
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">{prompt.savedAt}</td>

                      <td className="py-4 px-4 text-right">
                        {isDeleting ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRemoveBookmark(prompt.id)}
                              className="px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyPrompt(prompt)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isCopied
                                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40"
                              }`}
                              title="Copy Prompt Content"
                            >
                              {isCopied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => setPreviewPrompt(prompt)}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                              title="Quick Preview Template"
                            >
                              <Terminal className="h-3.5 w-3.5" />
                            </button>

                            <Link
                              href={`/allpromts/${prompt.promptId || prompt.id}`}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                              title="View Full Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(prompt.id)}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                              title="Remove from Saved"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Quick Preview Modal */}
      {previewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                    <Zap className="h-3 w-3" />
                    {previewPrompt.aiModel || previewPrompt.aiTool}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {previewPrompt.category}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {previewPrompt.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPreviewPrompt(null)}
                className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto pr-1 flex-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={previewPrompt.author.avatar}
                    alt={previewPrompt.author.name}
                    className="h-8 w-8 rounded-full object-cover border border-border"
                  />
                  <div>
                    <p className="font-bold text-foreground">{previewPrompt.author.name}</p>
                    <p className="text-[11px] text-muted-foreground">{previewPrompt.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{previewPrompt.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground font-medium">
                    {previewPrompt.copies} copies
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Overview & Use Case
                </h4>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {previewPrompt.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    Prompt Template Text
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Replace brackets like <code className="text-primary font-mono">[Parameter]</code>
                  </span>
                </div>

                <div className="relative rounded-xl border border-border/80 bg-muted/40 p-4 font-mono text-xs text-foreground/90 leading-relaxed overflow-x-auto selection:bg-primary/30">
                  {previewPrompt.content}
                </div>
              </div>

              {previewPrompt.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {previewPrompt.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border/60 pt-4 flex flex-wrap items-center justify-between gap-3">
              <Link
                href={`/allpromts/${previewPrompt.promptId || previewPrompt.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <span>Go to full details & reviews</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPrompt(previewPrompt)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    copiedId === previewPrompt.id
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                  }`}
                >
                  {copiedId === previewPrompt.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-4 py-3 text-xs text-foreground shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold">{toastMessage}</span>

          {lastRemovedPrompt && (
            <button
              type="button"
              onClick={handleUndoRemoval}
              className="ml-2 font-bold text-primary hover:underline"
            >
              Undo
            </button>
          )}

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
