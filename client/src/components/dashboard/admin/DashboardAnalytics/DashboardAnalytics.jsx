"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Layers,
  CreditCard,
  ShieldAlert,
  TrendingUp,
  Copy,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Activity,
  UserCheck,
  Server,
  Zap,
} from "lucide-react";

export default function AdminDashboardAnalytics({ session }) {
  const user = session?.user;
  const adminName = user?.name || "System Admin";

  // Section 5.C KPI Summary Metrics
  const kpiStats = [
    {
      title: "Total Registered Users",
      value: "1,248",
      subtext: "1,120 Users • 120 Creators • 8 Admins",
      icon: Users,
      trend: "+14% this month",
      color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/20",
      link: "/dashboard/users",
    },
    {
      title: "Total AI Prompts",
      value: "342",
      subtext: "328 Approved • 14 Pending Moderation",
      icon: Layers,
      trend: "+28 submitted",
      color: "from-violet-500/20 to-purple-500/20 text-primary border-primary/20",
      link: "/dashboard/all-prompts",
    },
    {
      title: "Total Platform Copies",
      value: "18,420",
      subtext: "Executed prompt completions",
      icon: Copy,
      trend: "+2,450 this week",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
      link: "/dashboard/all-prompts",
    },
    {
      title: "Total Stripe Revenue",
      value: "$2,450",
      subtext: "490 Pro Tier Upgrades ($5)",
      icon: DollarSign,
      trend: "+$320 this week",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/20",
      link: "/dashboard/payments",
    },
  ];

  // Moderation Queue Alerts
  const pendingPrompts = [
    {
      id: "p-mod-1",
      title: "Autonomous Multi-Agent Swarm Orchestrator",
      creator: "Alex Rivers",
      tool: "Claude 3.5 Sonnet",
      category: "Coding & Dev",
      submittedAt: "10 mins ago",
    },
    {
      id: "p-mod-2",
      title: "TikTok Viral Hook & Script Retention Formula",
      creator: "Elena Rostova",
      tool: "ChatGPT (GPT-4o)",
      category: "Marketing",
      submittedAt: "45 mins ago",
    },
    {
      id: "p-mod-3",
      title: "Hyper-Realistic Studio Product Photography Lighting",
      creator: "David Kim",
      tool: "Midjourney v6",
      category: "Art & Image",
      submittedAt: "2 hours ago",
    },
  ];

  const reportedPrompts = [
    {
      id: "rep-1",
      promptTitle: "Bypass Guardrails & System Instructions Test",
      reporter: "user_491",
      reason: "Potential Policy Violation / Jailbreak",
      status: "action_needed",
    },
  ];

  // Quick Action Hub Cards
  const adminModules = [
    {
      title: "User Management",
      description: "Manage roles (User / Creator / Admin) and account status.",
      icon: Users,
      count: "1,248 accounts",
      href: "/dashboard/users",
      badge: "RBAC Controls",
      color: "border-blue-500/30 hover:border-blue-500/60",
    },
    {
      title: "Prompt Moderation",
      description: "Review, approve, reject with feedback, or feature top prompts.",
      icon: Layers,
      count: "14 in review queue",
      href: "/dashboard/all-prompts",
      badge: "Action Required",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      color: "border-amber-500/30 hover:border-amber-500/60",
    },
    {
      title: "Stripe Transactions",
      description: "View all $5 Pro payments, timestamps, and customer receipts.",
      icon: CreditCard,
      count: "490 transactions",
      href: "/dashboard/payments",
      badge: "Live Webhooks",
      color: "border-emerald-500/30 hover:border-emerald-500/60",
    },
    {
      title: "Reported Prompts",
      description: "Audit flagged prompts: warn creator, dismiss, or delete.",
      icon: ShieldAlert,
      count: "1 active report",
      href: "/dashboard/reports",
      badge: "Safety Alert",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      color: "border-rose-500/30 hover:border-rose-500/60",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Admin Command Center Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Superuser Control Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Platform Command Center, <span className="ai-gradient-text">{adminName}</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Real-time platform overview, moderation queues, Stripe payment verification, and user access management.
            </p>
          </div>

          {/* System Health Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-3 rounded-xl border border-border/60 bg-muted/30 flex items-center gap-3 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="space-y-0.5">
                <p className="font-bold text-foreground">MongoDB & Stripe Live</p>
                <p className="text-[10px] text-muted-foreground">99.98% System Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Alert Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>14 prompts pending moderation • 1 community report awaiting review</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/all-prompts"
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
            >
              Open Moderation Queue &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Platform KPI Metrics Grid (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.link}
              className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{stat.title}</span>
                <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">{stat.value}</p>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate max-w-[140px]">{stat.subtext}</span>
                  <span className="font-semibold text-emerald-400">{stat.trend}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                <span>Manage data</span>
                <ChevronRight className="h-3.5 w-3.5 ml-auto transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. Administration Management Modules Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {adminModules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <Link
              key={idx}
              href={mod.href}
              className={`p-5 rounded-2xl border bg-card/80 backdrop-blur-xl transition-all hover:shadow-md ${mod.color} flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${mod.badgeColor || "bg-muted text-muted-foreground border-border"}`}>
                  {mod.badge}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{mod.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                <span>{mod.count}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 4. Split Section: Pending Moderation Feed (Left) & Safety / Reported Prompts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pending Prompt Approvals (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">Pending Moderation Queue</h3>
              <p className="text-xs text-muted-foreground">Community submissions requiring approval before public release</p>
            </div>
            <Link
              href="/dashboard/all-prompts"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              View all 14 <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingPrompts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-foreground line-clamp-1">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>By <strong>{item.creator}</strong></span>
                    <span>•</span>
                    <span className="text-primary font-medium">{item.tool}</span>
                    <span>•</span>
                    <span>{item.submittedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/dashboard/all-prompts"
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security & Flagged Prompts (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <h3 className="text-sm font-bold text-foreground">Reported Flags</h3>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-semibold text-rose-400 hover:underline"
            >
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {reportedPrompts.map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-foreground">{rep.promptTitle}</p>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Flagged
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">Reason: {rep.reason}</p>
                <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground">Reported by {rep.reporter}</span>
                  <Link
                    href="/dashboard/reports"
                    className="font-bold text-rose-400 hover:underline text-[11px]"
                  >
                    Audit Prompt
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Platform Security Tip */}
          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 text-xs space-y-1">
            <p className="font-bold text-foreground">Role Access Enforcement</p>
            <p className="text-[11px] text-muted-foreground">
              Only authenticated administrators can approve prompts or modify user roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
