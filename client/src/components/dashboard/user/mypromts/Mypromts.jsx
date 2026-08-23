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
  Sparkles,
  ExternalLink,
  Crown,
  AlertCircle,
  X,
  ChevronRight,
} from "lucide-react";

export default function UserMyPromts({ session }) {
  const user = session?.user;
  const userName = user?.name || "User";
  const isPremium = user?.isPremium || false;

  // Mock initial prompts for user
  const [prompts, setPrompts] = useState([
    {
      id: "u-prompt-1",
      title: "SaaS Cold Email Sequence (5-Step High Conversion)",
      category: "Marketing & Copywriting",
      aiTool: "ChatGPT (GPT-4o)",
      difficulty: "Beginner",
      visibility: "Public",
      status: "approved",
      copies: 142,
      createdAt: "2025-02-18",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    },
    {
      id: "u-prompt-2",
      title: "Python FastAPI Clean Architecture Generator",
      category: "Coding & Development",
      aiTool: "Claude 3.5 Sonnet",
      difficulty: "Intermediate",
      visibility: "Public",
      status: "pending",
      copies: 0,
      createdAt: "2025-02-22",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Quota calculation (Free users max 3 prompts)
  const maxFreePrompts = 3;
  const usedPrompts = prompts.length;
  const remainingQuota = isPremium ? "Unlimited" : Math.max(0, maxFreePrompts - usedPrompts);

  // Filtered prompts
  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.aiTool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Quota Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <FolderKanban className="h-3.5 w-3.5" />
              <span>Prompt Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              My <span className="ai-gradient-text">Prompts</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              View, edit, and track the status of all prompt templates you have submitted to the platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/add-prompt"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit New Prompt</span>
            </Link>
          </div>
        </div>

        {/* User Quota Bar */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-medium">Submission Quota:</span>
            <span className="font-bold text-foreground">
              {usedPrompts} / {isPremium ? "∞ Unlimited" : `${maxFreePrompts} Free Prompts`}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-primary font-semibold">
              {isPremium ? "Unlimited Active" : `${remainingQuota} slots left`}
            </span>
          </div>

          {!isPremium && (
            <Link
              href="/payment"
              className="inline-flex items-center gap-1 font-bold text-amber-400 hover:underline"
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Upgrade for Unlimited Submissions ($5) &rarr;</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl">
          <p className="text-xs font-semibold text-muted-foreground">Total Submissions</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">{prompts.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl">
          <p className="text-xs font-semibold text-emerald-400">Live / Approved</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {prompts.filter((p) => p.status === "approved").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl">
          <p className="text-xs font-semibold text-amber-400">In Moderation</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {prompts.filter((p) => p.status === "pending").length}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl">
          <p className="text-xs font-semibold text-primary">Total Copies</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {prompts.reduce((acc, curr) => acc + (curr.copies || 0), 0)}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search my prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          {["all", "approved", "pending"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Prompts Table */}
      <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
        {filteredPrompts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 text-muted-foreground mx-auto flex items-center justify-center">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No prompts found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or status filter."
                : "You haven't submitted any AI prompts yet. Share your first prompt with the community!"}
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/add-prompt"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Submit Your First Prompt</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Prompt Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">AI Tool</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Copies</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPrompts.map((prompt) => (
                  <tr key={prompt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prompt.thumbnail}
                          alt={prompt.title}
                          className="h-9 w-9 rounded-lg object-cover border border-border/60 shrink-0"
                        />
                        <div className="max-w-[220px]">
                          <p className="font-bold text-foreground truncate">{prompt.title}</p>
                          <span className="text-[10px] text-muted-foreground">{prompt.difficulty}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground font-medium">{prompt.category}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-primary">
                        {prompt.aiTool}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {prompt.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="h-3 w-3" /> Pending Review
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Copy className="h-3 w-3 text-muted-foreground" /> {prompt.copies}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{prompt.createdAt}</td>
                    <td className="py-4 px-4 text-right">
                      {deleteConfirmId === prompt.id ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(prompt.id)}
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
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/allpromts/${prompt.id}`}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                            title="View Public Details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => alert(`Edit prompt: ${prompt.title}`)}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            title="Edit Prompt"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prompt.id)}
                            className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                            title="Delete Prompt"
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
    </div>
  );
}
