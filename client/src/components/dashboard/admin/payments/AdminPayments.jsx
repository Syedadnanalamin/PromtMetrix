"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  DollarSign,
  CheckCircle2,
  Crown,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

export default function AdminPayments({ initialPayments = [] }) {
  const [paymentsList] = useState(Array.isArray(initialPayments) ? initialPayments : []);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Stats
  const totalTransactions = paymentsList.length;
  const totalRevenue = totalTransactions * 5;

  // Filtered payments
  const filteredPayments = useMemo(() => {
    let result = [...paymentsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.email || "").toLowerCase().includes(q) ||
          (p.plan || "").toLowerCase().includes(q) ||
          (p.sessionId || "").toLowerCase().includes(q) ||
          (p.customerId || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [paymentsList, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Stripe Revenue & Subscriptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            All Stripe <span className="ai-gradient-text">Payments</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Live overview of all $5 Lifetime Pro tier upgrades, payment sessions, and subscriber transaction history.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Total Transactions:</span>
            <span className="font-extrabold text-foreground">{totalTransactions}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-muted-foreground font-medium">Gross Revenue:</span>
            <span className="font-extrabold text-amber-400">${totalRevenue} USD</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <Crown className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground font-medium">Plan Type:</span>
            <span className="font-bold text-foreground">Pro Tier ($5 Lifetime)</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-muted-foreground font-medium">Payment Status:</span>
            <span className="font-bold text-emerald-400">100% Succeeded</span>
          </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer email or session ID..."
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

      {/* 3. Payments Table Card */}
      <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No payments found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? "No transactions match your search query."
                : "No customer payments recorded in the subscriber collection yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Customer Email</th>
                  <th className="py-3.5 px-4">Purchased Plan</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-right">Stripe Session ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPayments.map((p, idx) => {
                  const pId = p._id?.toString() || p.id || idx;
                  const sessionId = p.sessionId || p.id || "cs_live_session";
                  const dateFormatted = p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <tr key={pId} className="hover:bg-muted/20 transition-colors">
                      {/* Customer Email */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">{p.email || "customer@example.com"}</p>
                          <p className="text-[10px] text-muted-foreground">Customer ID: {p.userId || "—"}</p>
                        </div>
                      </td>

                      {/* Purchased Plan */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          <Crown className="h-3 w-3" /> Pro ($5 Lifetime)
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-extrabold text-foreground">$5.00 USD</td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Paid & Active
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-muted-foreground">{dateFormatted}</td>

                      {/* Session ID snippet */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleCopy(sessionId)}
                          title="Click to copy Session ID"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted font-mono text-[11px] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                        >
                          <span className="max-w-[120px] truncate">{sessionId}</span>
                          {copiedId === sessionId ? (
                            <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                          ) : (
                            <Copy className="h-3 w-3 shrink-0" />
                          )}
                        </button>
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
