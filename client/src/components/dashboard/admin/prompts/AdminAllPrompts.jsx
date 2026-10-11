"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Lock,
  Globe,
  Star,
  Copy,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { updatePromptStatus, deletePrompt } from "@/lib/actions/admin/prompts";

export default function AdminAllPrompts({ initialPrompts = [] }) {
  const [promptsList, setPromptsList] = useState(Array.isArray(initialPrompts) ? initialPrompts : []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Stats
  const totalPrompts = promptsList.length;
  const approvedCount = promptsList.filter((p) => (p.status || "").toLowerCase() === "approved").length;
  const pendingCount = promptsList.filter((p) => (p.status || "pending").toLowerCase() === "pending").length;
  const rejectedCount = promptsList.filter((p) => (p.status || "").toLowerCase() === "rejected").length;

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    let result = [...promptsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.aiTool || "").toLowerCase().includes(q) ||
          (p.creator?.name || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => (p.status || "pending").toLowerCase() === statusFilter.toLowerCase());
    }

    if (visibilityFilter !== "all") {
      result = result.filter((p) => (p.visibility || "Public").toLowerCase() === visibilityFilter.toLowerCase());
    }

    return result;
  }, [promptsList, searchQuery, statusFilter, visibilityFilter]);

  // Handle status update
  const handleStatusChange = async (promptId, newStatus) => {
    setUpdatingId(promptId);
    try {
      const res = await updatePromptStatus(promptId, newStatus);
      if (res?.success !== false) {
        setPromptsList((prev) =>
          prev.map((p) => ((p._id || p.id) === promptId ? { ...p, status: newStatus } : p))
        );
        showToast(`Prompt marked as ${newStatus}`);
      } else {
        showToast("Failed to update prompt status", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating prompt status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete
  const handleDelete = async (promptId) => {
    try {
      const res = await deletePrompt(promptId);
      if (res?.success !== false) {
        setPromptsList((prev) => prev.filter((p) => (p._id || p.id) !== promptId));
        showToast("Prompt deleted successfully");
      } else {
        showToast("Failed to delete prompt", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting prompt", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl text-xs font-semibold ${
              toastMessage.type === "error"
                ? "bg-destructive/90 text-destructive-foreground border-destructive/50"
                : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Layers className="h-3.5 w-3.5" />
            <span>Prompt Moderation Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            All AI <span className="ai-gradient-text">Prompts</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Review community prompt submissions, approve high-quality templates for the marketplace, or reject non-compliant items.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Total:</span>
            <span className="font-extrabold text-foreground">{totalPrompts}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-muted-foreground font-medium">Approved:</span>
            <span className="font-bold text-emerald-400">{approvedCount}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-muted-foreground font-medium">Pending Review:</span>
            <span className="font-bold text-amber-400">{pendingCount}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-muted-foreground font-medium">Rejected:</span>
            <span className="font-bold text-rose-400">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by prompt title, tool, creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-card/80 py-2.5 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-card/80 py-2.5 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Moderation ({pendingCount})</option>
            <option value="approved">Approved ({approvedCount})</option>
            <option value="rejected">Rejected ({rejectedCount})</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-card/80 py-2.5 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Visibility</option>
            <option value="Public">Public Free</option>
            <option value="Private">Premium Private</option>
          </select>
        </div>
      </div>

      {/* 3. Table Card */}
      <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
        {filteredPrompts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No prompts found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || statusFilter !== "all" || visibilityFilter !== "all"
                ? "No templates match your active filters."
                : "No prompts submitted to the platform yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Prompt Template</th>
                  <th className="py-3.5 px-4">Creator</th>
                  <th className="py-3.5 px-4">Tool & Category</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPrompts.map((prompt) => {
                  const pId = prompt._id?.toString() || prompt.id;
                  const isPending = (prompt.status || "pending").toLowerCase() === "pending";
                  const isApproved = (prompt.status || "").toLowerCase() === "approved";
                  const isRejected = (prompt.status || "").toLowerCase() === "rejected";

                  return (
                    <tr key={pId} className="hover:bg-muted/20 transition-colors">
                      {/* Title + Thumbnail */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {prompt.thumbnail ? (
                            <img
                              src={prompt.thumbnail}
                              alt={prompt.title}
                              className="h-10 w-10 rounded-lg object-cover border border-border/60 shrink-0"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                              <Layers className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="max-w-[220px]">
                            <p className="font-bold text-foreground truncate">{prompt.title}</p>
                            <Link
                              href={`/allpromts/${pId}`}
                              target="_blank"
                              className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5 mt-0.5"
                            >
                              <span>View live</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground">
                          {prompt.creator?.name || "Anonymous Creator"}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{prompt.creator?.email || "—"}</p>
                      </td>

                      {/* Tool & Category */}
                      <td className="py-4 px-4 space-y-0.5">
                        <p className="font-semibold text-primary">{prompt.aiTool || "AI Tool"}</p>
                        <p className="text-[11px] text-muted-foreground">{prompt.category || "General"}</p>
                      </td>

                      {/* Visibility */}
                      <td className="py-4 px-4">
                        {prompt.visibility === "Private" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            <Lock className="h-3 w-3" /> Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-md">
                            <Globe className="h-3 w-3" /> Public
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                            <Clock className="h-3 w-3" /> In Review
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                            <XCircle className="h-3 w-3" /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Moderation Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {!isApproved && (
                            <button
                              onClick={() => handleStatusChange(pId, "approved")}
                              disabled={updatingId === pId}
                              title="Approve Prompt"
                              className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {!isRejected && (
                            <button
                              onClick={() => handleStatusChange(pId, "rejected")}
                              disabled={updatingId === pId}
                              title="Reject Prompt"
                              className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {deleteConfirmId === pId ? (
                            <div className="inline-flex items-center gap-1 ml-1">
                              <button
                                onClick={() => handleDelete(pId)}
                                className="px-2 py-1 rounded-md text-[10px] font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-1 rounded-md text-[10px] border border-border text-foreground hover:bg-accent"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(pId)}
                              title="Delete Prompt"
                              className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10 transition-all cursor-pointer ml-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
