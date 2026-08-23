"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Copy,
  Bookmark,
  Star,
  Sparkles,
  Lock,
  Globe,
  TrendingUp,
  Award,
  BarChart3,
  ExternalLink,
  Flame,
  X,
} from "lucide-react";

export default function CreatorMyPromts({ session }) {
  const user = session?.user;
  const creatorName = user?.name || "Creator";

  // Creator prompt inventory
  const [prompts, setPrompts] = useState([
    {
      id: "cp-1",
      title: "SaaS Cold Email Engine (3-Step B2B Personalization)",
      category: "Marketing & Copywriting",
      aiTool: "ChatGPT (GPT-4o)",
      difficulty: "Advanced",
      visibility: "Public",
      status: "approved",
      copies: 642,
      bookmarks: 182,
      rating: 4.9,
      reviewsCount: 42,
      createdAt: "2025-02-10",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    },
    {
      id: "cp-2",
      title: "Clean Next.js 15 Full-Stack Architecture Generator",
      category: "Coding & Development",
      aiTool: "Claude 3.5 Sonnet",
      difficulty: "Pro",
      visibility: "Private",
      status: "approved",
      copies: 518,
      bookmarks: 140,
      rating: 5.0,
      reviewsCount: 38,
      createdAt: "2025-02-14",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80",
    },
    {
      id: "cp-3",
      title: "Ultra-Realistic 8K Cyberpunk Cinematic Portrait",
      category: "Art & Image Generation",
      aiTool: "Midjourney v6",
      difficulty: "Intermediate",
      visibility: "Public",
      status: "approved",
      copies: 382,
      bookmarks: 76,
      rating: 4.8,
      reviewsCount: 19,
      createdAt: "2025-02-17",
      thumbnail: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80",
    },
    {
      id: "cp-4",
      title: "SEO Keyword Clustering & Content Gap Analyzer",
      category: "Marketing & Copywriting",
      aiTool: "Google Gemini 1.5",
      difficulty: "Intermediate",
      visibility: "Private",
      status: "pending",
      copies: 198,
      bookmarks: 30,
      rating: 4.7,
      reviewsCount: 8,
      createdAt: "2025-02-21",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter calculations
  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "premium" ? p.visibility === "Private" : p.status === statusFilter);
    const matchesTool = toolFilter === "all" || p.aiTool.toLowerCase().includes(toolFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesTool;
  });

  const handleDelete = (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  };

  const totalCopies = prompts.reduce((acc, curr) => acc + (curr.copies || 0), 0);
  const totalBookmarks = prompts.reduce((acc, curr) => acc + (curr.bookmarks || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Creator Portfolio Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Award className="h-3.5 w-3.5" />
              <span>Creator Template Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Manage <span className="ai-gradient-text">Creator Prompts</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Publish, refine, and monitor audience performance across your entire prompt catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/add-prompt"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Prompt</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-all"
            >
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span>View Analytics</span>
            </Link>
          </div>
        </div>

        {/* Creator Portfolio Metrics Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">Catalog Summary:</span>
            <span className="font-bold text-foreground">{prompts.length} Total Templates</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-semibold text-emerald-400">
              {prompts.filter((p) => p.status === "approved").length} Live Approved
            </span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="font-semibold text-amber-400 hidden sm:inline">
              {prompts.filter((p) => p.status === "pending").length} In Review
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              <Copy className="h-3.5 w-3.5 text-primary" /> {totalCopies.toLocaleString()} Copies
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              <Bookmark className="h-3.5 w-3.5" /> {totalBookmarks} Bookmarks
            </span>
          </div>
        </div>
      </div>

      {/* 2. Search & Multi-Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompts by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-muted/20 text-xs">
            {[
              { id: "all", label: "All" },
              { id: "approved", label: "Live" },
              { id: "pending", label: "In Review" },
              { id: "premium", label: "Premium (Private)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* AI Tool Dropdown */}
          <select
            value={toolFilter}
            onChange={(e) => setToolFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground font-medium focus:outline-none"
          >
            <option value="all">All AI Tools</option>
            <option value="chatgpt">ChatGPT</option>
            <option value="claude">Claude</option>
            <option value="midjourney">Midjourney</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
      </div>

      {/* 3. Creator Prompts Data Table */}
      <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
        {filteredPrompts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No creator prompts found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all" || toolFilter !== "all"
                ? "No templates match your active filters."
                : "You have not published any creator prompt templates yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Template</th>
                  <th className="py-3.5 px-4">Category & AI Tool</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4">Performance</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-muted/30 transition-colors">
                    {/* Title + Thumbnail */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prompt.thumbnail}
                          alt={prompt.title}
                          className="h-10 w-10 rounded-lg object-cover border border-border/60 shrink-0"
                        />
                        <div className="max-w-[200px]">
                          <p className="font-bold text-foreground truncate">{prompt.title}</p>
                          <span className="text-[10px] text-muted-foreground">
                            Added {prompt.createdAt}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & AI Tool */}
                    <td className="py-4 px-4 space-y-0.5">
                      <p className="font-medium text-foreground">{prompt.category}</p>
                      <p className="text-[11px] text-primary font-semibold">{prompt.aiTool}</p>
                    </td>

                    {/* Visibility Badge */}
                    <td className="py-4 px-4">
                      {prompt.visibility === "Private" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Lock className="h-3 w-3" /> Premium Private
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
                          <Globe className="h-3 w-3" /> Public Free
                        </span>
                      )}
                    </td>

                    {/* Performance: Copies & Bookmarks */}
                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <Copy className="h-3 w-3 text-primary" />
                        <span>{prompt.copies} copies</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Bookmark className="h-2.5 w-2.5 text-amber-400" />
                        <span>{prompt.bookmarks} saves</span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{prompt.rating}</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({prompt.reviewsCount})
                        </span>
                      </div>
                    </td>

                    {/* Moderation Status */}
                    <td className="py-4 px-4">
                      {prompt.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="h-3 w-3" /> In Review
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      {deleteConfirmId === prompt.id ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(prompt.id)}
                            className="px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-[10px] font-bold"
                          >
                            Delete
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
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/allpromts/${prompt.id}`}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                            title="View Public Page"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => alert(`Edit prompt: ${prompt.title}`)}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            title="Edit Prompt Template"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prompt.id)}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                            title="Delete Template"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Creator Monetization Tip */}
      <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 via-card to-card p-5 backdrop-blur-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Monetization Tip</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Prompts marked as <strong>Private (Premium)</strong> unlock revenue shares from $5 Pro subscribers every time they copy your workflow.
          </p>
        </div>

        <Link
          href="/dashboard/add-prompt"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
        >
          <span>Publish Private Prompt &rarr;</span>
        </Link>
      </div>
    </div>
  );
}
