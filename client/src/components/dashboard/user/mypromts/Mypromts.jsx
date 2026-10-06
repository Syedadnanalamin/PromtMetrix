"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  PlusCircle,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  Crown,
  AlertCircle,
  X,
  Grid3X3,
  List,
  ArrowUpDown,
  Code2,
  Bot,
  Info,
  Calendar,
} from "lucide-react";
import { deletePromt } from "@/lib/actions/promts/deletepromt";

// AI tool badge styling helper
const getToolBadgeColor = (tool = "") => {
  const t = tool.toLowerCase();
  if (t.includes("chatgpt") || t.includes("gpt")) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
  if (t.includes("claude")) {
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  }
  if (t.includes("midjourney")) {
    return "bg-purple-500/10 text-purple-400 border-purple-500/30";
  }
  if (t.includes("gemini")) {
    return "bg-sky-500/10 text-sky-400 border-sky-500/30";
  }
  return "bg-primary/10 text-primary border-primary/30";
};

// Difficulty badge styling helper
const getDifficultyBadge = (difficulty = "Beginner") => {
  const d = difficulty.toLowerCase();
  if (d === "pro" || d === "advanced") {
    return "bg-rose-500/10 text-rose-400 border-rose-500/25";
  }
  if (d === "intermediate") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/25";
  }
  return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export default function UserMyPromts({ session, data = [] }) {
  const user = session?.user;
  const isPremium = user?.isPremium || false;

  // Prompts state initialized from API data prop
  const [promptsList, setPromptsList] = useState(Array.isArray(data) ? data : []);

  // Synchronize when data prop updates
  useEffect(() => {
    if (Array.isArray(data)) {
      setPromptsList(data);
    }
  }, [data]);

  // UI state
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "copies" | "title"
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [previewPrompt, setPreviewPrompt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Toast auto-hide helper
  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Quota calculation (Free tier max 3 prompts)
  const maxFreePrompts = 3;
  const usedPrompts = promptsList.length;
  const remainingQuota = isPremium ? "Unlimited" : Math.max(0, maxFreePrompts - usedPrompts);
  const quotaPercent = isPremium ? 100 : Math.min(100, Math.round((usedPrompts / maxFreePrompts) * 100));

  // Extract unique AI Tools for filter dropdown
  const uniqueTools = useMemo(() => {
    const tools = new Set();
    promptsList.forEach((p) => {
      if (p?.aiTool) tools.add(p.aiTool);
    });
    return Array.from(tools);
  }, [promptsList]);

  // Filtered & Sorted prompts
  const filteredPrompts = useMemo(() => {
    let result = [...promptsList];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const titleMatch = (p.title || "").toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const toolMatch = (p.aiTool || "").toLowerCase().includes(q);
        const catMatch = (p.category || "").toLowerCase().includes(q);
        const tagMatch = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || toolMatch || catMatch || tagMatch;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => (p.status || "pending").toLowerCase() === statusFilter.toLowerCase());
    }

    // Tool filter
    if (toolFilter !== "all") {
      result = result.filter((p) => (p.aiTool || "").toLowerCase() === toolFilter.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "copies") {
        const copiesA = a.copyCount ?? a.copies ?? 0;
        const copiesB = b.copyCount ?? b.copies ?? 0;
        return copiesB - copiesA;
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return result;
  }, [promptsList, searchQuery, statusFilter, toolFilter, sortBy]);

  // Total copies calculation
  const totalCopies = useMemo(() => {
    return promptsList.reduce((acc, curr) => acc + (curr.copyCount ?? curr.copies ?? 0), 0);
  }, [promptsList]);

  const approvedCount = useMemo(() => {
    return promptsList.filter((p) => (p.status || "").toLowerCase() === "approved").length;
  }, [promptsList]);

  const pendingCount = useMemo(() => {
    return promptsList.filter((p) => (p.status || "pending").toLowerCase() === "pending").length;
  }, [promptsList]);

  // Copy Prompt Content action
  const handleCopyContent = (prompt, e) => {
    if (e) e.stopPropagation();
    const textToCopy = prompt.content || prompt.title;
    navigator.clipboard.writeText(textToCopy);
    setCopiedPromptId(prompt._id || prompt.id);
    showToast("Prompt template copied to clipboard!");
    setTimeout(() => {
      setCopiedPromptId(null);
    }, 2500);
  };

  // Delete Prompt action
  const handleDeletePrompt = async (id) => {
    if (!id) return;
    setIsDeletingId(id);
    try {
      const res = await deletePromt(id);
      if (res?.success !== false) {
        setPromptsList((prev) => prev.filter((p) => (p._id || p.id) !== id));
        if (previewPrompt && (previewPrompt._id || previewPrompt.id) === id) {
          setPreviewPrompt(null);
        }
        showToast("Prompt deleted successfully", "success");
      } else {
        showToast(res?.message || "Failed to delete prompt", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting prompt", "error");
    } finally {
      setIsDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl text-xs font-semibold ${
              toastMessage.type === "error"
                ? "bg-destructive/90 text-destructive-foreground border-destructive/50 shadow-destructive/20"
                : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-500/20"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive-foreground" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* 1. Header Banner & Quota Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-56 w-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-xs">
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Prompt Management Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              My <span className="ai-gradient-text">Prompts</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Track live performance, monitor moderation status, and manage all your submitted AI templates in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/add-prompt"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/35 transition-all active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit New Prompt</span>
            </Link>
          </div>
        </div>

        {/* User Quota Bar */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">Submission Quota:</span>
              <span className="font-bold text-foreground">
                {usedPrompts} / {isPremium ? "∞ Unlimited" : `${maxFreePrompts} Free Prompts`}
              </span>
            </div>

            {/* Quota Progress Bar for Free Users */}
            {!isPremium && (
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 rounded-full bg-muted overflow-hidden border border-border/60">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      quotaPercent >= 100
                        ? "bg-rose-500"
                        : quotaPercent >= 66
                        ? "bg-amber-400"
                        : "bg-primary"
                    }`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {remainingQuota} {remainingQuota === 1 ? "slot" : "slots"} left
                </span>
              </div>
            )}

            {isPremium && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Crown className="h-3 w-3" /> Pro Unlimited
              </span>
            )}
          </div>

          {!isPremium && (
            <Link
              href="/payment"
              className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 transition-colors self-start sm:self-auto"
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Unlock Unlimited Submissions ($5) &rarr;</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs transition-all hover:border-border">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Submissions</span>
            <FolderKanban className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">{promptsList.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Prompt portfolio</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold text-emerald-400">Live & Approved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">{approvedCount}</p>
          <p className="text-[11px] text-emerald-400/80 mt-0.5">Discoverable publicly</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs transition-all hover:border-amber-500/30">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold text-amber-400">In Moderation</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">{pendingCount}</p>
          <p className="text-[11px] text-amber-400/80 mt-0.5">Under review</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs transition-all hover:border-primary/40">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold text-primary">Total Copies</span>
            <Copy className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-foreground">{totalCopies.toLocaleString()}</p>
          <p className="text-[11px] text-primary/80 mt-0.5">User interactions</p>
        </div>
      </div>

      {/* 3. Search, Filter, Sort & View Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by prompt title, AI tool, tag, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 border border-border rounded-xl p-1 bg-muted/20 text-xs">
            {[
              { id: "all", label: "All" },
              { id: "approved", label: "Live" },
              { id: "pending", label: "Pending" },
              { id: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* AI Tool Dropdown Filter */}
          {uniqueTools.length > 0 && (
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All AI Tools</option>
              {uniqueTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 border border-border rounded-xl px-2.5 py-1.5 bg-background text-xs text-foreground">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-foreground font-medium focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="copies">Most Copied</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-border rounded-xl p-1 bg-muted/20">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid Card View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Filter Tags Pill Bar */}
      {(searchQuery || statusFilter !== "all" || toolFilter !== "all") && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/25 px-2.5 py-1 text-primary font-semibold">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="hover:opacity-80">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted border border-border px-2.5 py-1 text-foreground font-semibold">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter("all")} className="hover:opacity-80">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {toolFilter !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted border border-border px-2.5 py-1 text-foreground font-semibold">
              Tool: {toolFilter}
              <button onClick={() => setToolFilter("all")} className="hover:opacity-80">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setToolFilter("all");
            }}
            className="text-xs text-primary font-semibold hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 5. Prompts Presentation (Table or Grid) */}
      {filteredPrompts.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center border border-border/60">
            <FolderKanban className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-foreground">
              {promptsList.length === 0 ? "No Prompts Submitted Yet" : "No Matching Prompts Found"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {promptsList.length === 0
                ? "You have not submitted any AI prompts yet. Share your high-converting prompts with the developer and creator community!"
                : "No prompts match your active search or filter criteria. Try resetting your search filters."}
            </p>
          </div>
          <div className="pt-2">
            {promptsList.length === 0 ? (
              <Link
                href="/dashboard/add-prompt"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Submit Your First Prompt</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setToolFilter("all");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4 min-w-[280px]">Prompt Title & Details</th>
                  <th className="py-3.5 px-4 min-w-[140px]">AI Tool & Category</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                  <th className="py-3.5 px-4 min-w-[90px]">Copies</th>
                  <th className="py-3.5 px-4 min-w-[100px]">Date</th>
                  <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPrompts.map((prompt) => {
                  const pId = prompt._id || prompt.id;
                  const promptCopies = prompt.copyCount ?? prompt.copies ?? 0;
                  const promptStatus = (prompt.status || "pending").toLowerCase();
                  const isDeleting = isDeletingId === pId;
                  const isConfirming = deleteConfirmId === pId;
                  const isCopied = copiedPromptId === pId;

                  return (
                    <tr key={pId} className="hover:bg-muted/30 transition-colors group">
                      {/* Title & Preview */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              prompt.thumbnail ||
                              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
                            }
                            alt={prompt.title}
                            className="h-11 w-11 rounded-xl object-cover border border-border/60 shrink-0 bg-muted"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80";
                            }}
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {prompt.title}
                              </p>
                              {prompt.difficulty && (
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyBadge(
                                    prompt.difficulty
                                  )}`}
                                >
                                  {prompt.difficulty}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-sm">
                              {prompt.description || prompt.content || "No overview provided"}
                            </p>
                            {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                                {prompt.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {prompt.tags.length > 3 && (
                                  <span className="text-[9px] text-muted-foreground">
                                    +{prompt.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Tool & Category */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getToolBadgeColor(
                              prompt.aiTool
                            )}`}
                          >
                            <Bot className="h-3 w-3" />
                            {prompt.aiTool || "ChatGPT"}
                          </span>
                          <p className="text-[11px] text-muted-foreground font-medium truncate max-w-[140px]">
                            {prompt.category || "General"}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {promptStatus === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : promptStatus === "rejected" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <Clock className="h-3 w-3" /> In Review
                          </span>
                        )}
                      </td>

                      {/* Copies Count */}
                      <td className="py-4 px-4 font-bold text-foreground">
                        <span className="inline-flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-lg border border-border/40">
                          <Copy className="h-3 w-3 text-primary" /> {promptCopies}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3" />
                          {formatDate(prompt.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        {isConfirming ? (
                          <div className="inline-flex items-center gap-1.5 animate-in fade-in">
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => handleDeletePrompt(pId)}
                              className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-[11px] font-bold hover:bg-destructive/90 transition-all disabled:opacity-50"
                            >
                              {isDeleting ? "Deleting..." : "Confirm"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-lg border border-border hover:bg-muted text-muted-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            {/* Copy Prompt Content Button */}
                            <button
                              type="button"
                              onClick={(e) => handleCopyContent(prompt, e)}
                              className={`p-2 rounded-xl border transition-all ${
                                isCopied
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                  : "bg-card text-muted-foreground hover:text-primary hover:border-primary/40 border-border"
                              }`}
                              title={isCopied ? "Copied!" : "Copy prompt template"}
                            >
                              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>

                            {/* Quick Inspect Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setPreviewPrompt(prompt)}
                              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                              title="Quick Preview"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* View Full Page Link */}
                            <Link
                              href={`/allpromts/${pId}`}
                              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                              title="View Public Details"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(pId)}
                              className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
                              title="Delete Prompt"
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
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPrompts.map((prompt) => {
            const pId = prompt._id || prompt.id;
            const promptCopies = prompt.copyCount ?? prompt.copies ?? 0;
            const promptStatus = (prompt.status || "pending").toLowerCase();
            const isDeleting = isDeletingId === pId;
            const isConfirming = deleteConfirmId === pId;
            const isCopied = copiedPromptId === pId;

            return (
              <div
                key={pId}
                className="group relative rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-5 shadow-xs hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Thumbnail + Badges */}
                <div className="space-y-3">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-border/60 bg-muted">
                    <img
                      src={
                        prompt.thumbnail ||
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80"
                      }
                      alt={prompt.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />

                    {/* Status Pill on Thumbnail */}
                    <div className="absolute top-3 left-3">
                      {promptStatus === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-xs">
                          <CheckCircle2 className="h-3 w-3" /> Live
                        </span>
                      ) : promptStatus === "rejected" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-xs">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-xs">
                          <Clock className="h-3 w-3" /> In Review
                        </span>
                      )}
                    </div>

                    {/* AI Tool Badge on Thumbnail */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-xs border ${getToolBadgeColor(
                          prompt.aiTool
                        )} bg-background/80`}
                      >
                        <Bot className="h-3 w-3" />
                        {prompt.aiTool || "ChatGPT"}
                      </span>
                    </div>

                    {/* Category Overlay */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[10px] font-semibold text-foreground/90 bg-background/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-border/40">
                        {prompt.category || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {prompt.title}
                      </h4>
                      {prompt.difficulty && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getDifficultyBadge(
                            prompt.difficulty
                          )}`}
                        >
                          {prompt.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {prompt.description || prompt.content || "No overview description provided."}
                    </p>
                  </div>

                  {/* Tags */}
                  {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {prompt.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Metrics & Action Buttons */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <Copy className="h-3.5 w-3.5 text-primary" /> {promptCopies}
                    </span>
                    <span>•</span>
                    <span className="text-[11px]">{formatDate(prompt.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  {isConfirming ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDeletePrompt(pId)}
                        className="px-2 py-1 rounded-lg bg-destructive text-destructive-foreground text-[10px] font-bold"
                      >
                        {isDeleting ? "..." : "Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded-lg border border-border text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleCopyContent(prompt, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isCopied
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-muted/40 text-muted-foreground hover:text-primary hover:border-primary/40 border-border"
                        }`}
                        title="Copy template"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewPrompt(prompt)}
                        className="p-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                        title="Quick View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/allpromts/${pId}`}
                        className="p-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                        title="Full Details"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(pId)}
                        className="p-1.5 rounded-lg border border-border bg-muted/40 text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Quick Preview Modal */}
      {previewPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getToolBadgeColor(
                      previewPrompt.aiTool
                    )}`}
                  >
                    <Bot className="h-3 w-3" />
                    {previewPrompt.aiTool || "ChatGPT"}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDifficultyBadge(
                      previewPrompt.difficulty
                    )}`}
                  >
                    {previewPrompt.difficulty || "Beginner"}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {previewPrompt.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{previewPrompt.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewPrompt(null)}
                className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            {previewPrompt.description && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Overview</span>
                <p className="text-xs text-foreground/90 bg-muted/30 p-3 rounded-xl border border-border/40 leading-relaxed">
                  {previewPrompt.description}
                </p>
              </div>
            )}

            {/* Prompt Template Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-primary" /> Prompt Template Instructions
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopyContent(previewPrompt, e)}
                  className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>
                    {copiedPromptId === (previewPrompt._id || previewPrompt.id)
                      ? "Copied to Clipboard!"
                      : "Copy Prompt"}
                  </span>
                </button>
              </div>

              <div className="relative rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {previewPrompt.content || "No prompt content available."}
              </div>
            </div>

            {/* Usage Instructions */}
            {previewPrompt.usageInstructions && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-amber-400" /> Usage Guidelines & Variables
                </span>
                <p className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-xl border border-border/40 leading-relaxed">
                  {previewPrompt.usageInstructions}
                </p>
              </div>
            )}

            {/* Tags & Metadata */}
            {Array.isArray(previewPrompt.tags) && previewPrompt.tags.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {previewPrompt.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/40"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                <span>Submitted on {formatDate(previewPrompt.createdAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleCopyContent(previewPrompt, e)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/25"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>
                    {copiedPromptId === (previewPrompt._id || previewPrompt.id)
                      ? "Copied!"
                      : "Copy Template"}
                  </span>
                </button>
                <Link
                  href={`/allpromts/${previewPrompt._id || previewPrompt.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Public Page</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
