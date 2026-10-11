"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  CheckCircle2,
  Trash2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { deleteReport } from "@/lib/actions/admin/reports";
import { deletePrompt } from "@/lib/actions/admin/prompts";

export default function AdminReports({ initialReports = [] }) {
  const [reportsList, setReportsList] = useState(Array.isArray(initialReports) ? initialReports : []);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const totalReports = reportsList.length;

  const filteredReports = useMemo(() => {
    let result = [...reportsList];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          (r.promptTitle || "").toLowerCase().includes(q) ||
          (r.reason || "").toLowerCase().includes(q) ||
          (r.reporter || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [reportsList, searchQuery]);

  // Handle Dismiss / Resolve Report
  const handleDismiss = async (reportId) => {
    try {
      const res = await deleteReport(reportId);
      if (res?.success !== false) {
        setReportsList((prev) => prev.filter((r) => (r._id || r.id) !== reportId));
        showToast("Report resolved and dismissed");
      } else {
        showToast("Failed to dismiss report", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error dismissing report", "error");
    }
  };

  // Handle Delete Flagged Prompt
  const handleDeletePrompt = async (reportId, promptId) => {
    try {
      if (promptId) {
        await deletePrompt(promptId);
      }
      await deleteReport(reportId);
      setReportsList((prev) => prev.filter((r) => (r._id || r.id) !== reportId));
      showToast("Flagged prompt deleted and report resolved");
    } catch (err) {
      console.error(err);
      showToast("Error resolving flagged prompt", "error");
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
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Community Safety & Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Reported <span className="ai-gradient-text">Prompts</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Audit flagged prompt templates reported by community members for policy violations, harmful instructions, or malicious behavior.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Active Reports:</span>
            <span className="font-extrabold text-foreground">{totalReports}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            {totalReports === 0 ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-400">Safety Status Optimal</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-bold text-amber-400">Action Required</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Search Bar if reports exist */}
      {totalReports > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports by prompt or reason..."
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
        </div>
      )}

      {/* 3. Reports Container */}
      {filteredReports.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card/80 p-12 text-center backdrop-blur-xl shadow-xs space-y-3">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No Reported Prompts</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            All marketplace prompts are compliant with safety policies. When community users report suspicious or violating prompts, they will appear here for audit.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/all-prompts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              <span>View Moderation Queue</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const rId = report._id?.toString() || report.id;
            const pId = report.promptId;
            return (
              <div
                key={rId}
                className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 backdrop-blur-xl shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Flagged
                    </span>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">
                      {report.promptTitle || "Reported Prompt"}
                    </h4>
                  </div>
                  {pId && (
                    <Link
                      href={`/allpromts/${pId}`}
                      target="_blank"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-card/60 border border-border/60 text-xs space-y-1">
                  <p className="font-semibold text-foreground">Reason for Flag:</p>
                  <p className="text-muted-foreground">{report.reason || "Policy violation reported"}</p>
                </div>

                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-muted-foreground">
                    Reported by {report.reporter || "Anonymous User"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(rId)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-border bg-card text-foreground hover:bg-accent transition-colors"
                    >
                      Dismiss Flag
                    </button>
                    {pId && (
                      <button
                        onClick={() => handleDeletePrompt(rId, pId)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        Delete Prompt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
