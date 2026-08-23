"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bookmark,
  PlusCircle,
  FolderKanban,
  MessageSquare,
  ArrowUpRight,
  Copy,
  Flame,
  Crown,
  Zap,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bot,
  ExternalLink,
} from "lucide-react";

export default function UserDashboardAnalytics({ session }) {
  const user = session?.user;
  const userName = user?.name || "Prompt Explorer";
  const userEmail = user?.email || "";
  const isPremium = user?.isPremium || false;

  // Mock user dashboard metrics (aligned with platform specs)
  const [activeTab, setActiveTab] = useState("recent");

  const stats = [
    {
      title: "My Prompts",
      value: "1",
      subtext: isPremium ? "Unlimited submissions" : "1 of 3 free prompts used",
      icon: FolderKanban,
      trend: isPremium ? "Pro Tier" : "33% Quota",
      color: "from-violet-500/20 to-purple-500/20 text-primary border-primary/20",
      link: "/dashboard/my-prompts",
    },
    {
      title: "Saved Prompts",
      value: "8",
      subtext: "Bookmarks in collection",
      icon: Bookmark,
      trend: "+3 this week",
      color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/20",
      link: "/dashboard/saved",
    },
    {
      title: "Reviews Given",
      value: "4",
      subtext: "Community ratings submitted",
      icon: MessageSquare,
      trend: "4.8 avg rating",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
      link: "/dashboard/my-reviews",
    },
    {
      title: "Total Copies",
      value: "26",
      subtext: "Prompts executed",
      icon: Copy,
      trend: "~4.5 hrs saved",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/20",
      link: "/allpromts",
    },
  ];

  const recentSavedPrompts = [
    {
      id: "1",
      title: "SaaS Cold Email Sequence (5-Step High Conversion)",
      category: "Marketing & Copywriting",
      tool: "ChatGPT (GPT-4o)",
      rating: 4.9,
      copies: 142,
    },
    {
      id: "2",
      title: "Full-Stack Next.js 15 Tailwind Architecture Generator",
      category: "Coding & Development",
      tool: "Claude 3.5 Sonnet",
      rating: 5.0,
      copies: 389,
    },
    {
      id: "3",
      title: "Cyberpunk Cinematic Portrait & Lighting Rig",
      category: "Art & Image Generation",
      tool: "Midjourney v6",
      rating: 4.8,
      copies: 215,
    },
  ];

  const mySubmissions = [
    {
      id: "sub-1",
      title: "E-Commerce Black Friday Ad Copy Hook Engine",
      tool: "ChatGPT",
      status: "approved",
      date: "2 days ago",
      copies: 18,
    },
    {
      id: "sub-2",
      title: "Python Clean Architecture API Boilerplate",
      tool: "Claude",
      status: "pending",
      date: "Just now",
      copies: 0,
    },
  ];

  const aiCategories = [
    { name: "ChatGPT (GPT-4o)", count: "120+ prompts", badge: "Most Popular", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { name: "Claude 3.5", count: "85+ prompts", badge: "Trending", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    { name: "Midjourney v6", count: "90+ prompts", badge: "Visual Art", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
    { name: "Google Gemini 1.5", count: "45+ prompts", badge: "Multimodal", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Welcome & Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>User Dashboard Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="ai-gradient-text">{userName}</span> 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Track your saved prompts, manage your community contributions, and discover battle-tested AI templates.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/add-prompt"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit Prompt</span>
            </Link>
            <Link
              href="/allpromts"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Subscription / Plan Quick Pill */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Account Status:</span>
            {isPremium ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 font-bold text-amber-400">
                <Crown className="h-3.5 w-3.5" /> Premium Pro Member
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-0.5 font-semibold text-foreground">
                <Zap className="h-3.5 w-3.5 text-primary" /> Free Tier Member
              </span>
            )}
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground hidden sm:inline">{userEmail}</span>
          </div>

          {!isPremium && (
            <Link
              href="/payment"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Crown className="h-3.5 w-3.5" />
              <span>Upgrade to Pro ($5 Lifetime) &rarr;</span>
            </Link>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Grid (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
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
                  <span className="text-muted-foreground">{stat.subtext}</span>
                  <span className="font-semibold text-primary/90">{stat.trend}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex items-center text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                <span>View details</span>
                <ChevronRight className="h-3.5 w-3.5 ml-auto transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 3. Main Split View: Activity & Quick Bookmarks (Left) + Pro Upgrade & AI Ecosystem (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Submissions & Saved Prompts (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs">
            {/* Tab Selector Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("recent")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "recent"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Saved Prompts (Bookmarks)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("submissions")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "submissions"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  My Submissions
                </button>
              </div>

              <Link
                href={activeTab === "recent" ? "/dashboard/saved" : "/dashboard/my-prompts"}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Tab Content 1: Bookmarked Prompts */}
            {activeTab === "recent" && (
              <div className="mt-4 space-y-3">
                {recentSavedPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-primary/30 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {prompt.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground/80">{prompt.category}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">{prompt.tool}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs">
                      <div className="flex items-center gap-1 font-semibold text-amber-400">
                        <span>★</span>
                        <span>{prompt.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground font-medium">
                        <Copy className="h-3 w-3" />
                        <span>{prompt.copies}</span>
                      </div>
                      <Link
                        href={`/allpromts/${prompt.id}`}
                        className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        title="View Prompt Details"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content 2: My Submissions */}
            {activeTab === "submissions" && (
              <div className="mt-4 space-y-3">
                {mySubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground line-clamp-1">{sub.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{sub.tool}</span>
                        <span>•</span>
                        <span>{sub.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sub.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="h-3 w-3" /> Pending Review
                        </span>
                      )}
                      <Link
                        href="/dashboard/my-prompts"
                        className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-center">
                  <Link
                    href="/dashboard/add-prompt"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Create another prompt
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick AI Tool Explorer Tags */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs">
            <h3 className="text-xs font-bold tracking-tight text-foreground uppercase tracking-wider text-muted-foreground mb-4">
              Explore Popular AI Ecosystems
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiCategories.map((cat, index) => (
                <Link
                  key={index}
                  href={`/allpromts?tool=${encodeURIComponent(cat.name)}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-card hover:border-primary/30 transition-all group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{cat.count}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cat.color}`}>
                    {cat.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upgrade to Pro & Platform Tips (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pro Upgrade Card */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-br from-primary/15 via-card to-card p-6 backdrop-blur-xl shadow-lg shadow-primary/5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Crown className="h-4 w-4" />
              <span>PromptMatrix Pro</span>
            </div>
            <h3 className="text-lg font-extrabold text-foreground">
              Unlock Unlimited Private Prompts & Premium AI Templates
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Get one-click copy access to verified high-converting copywriting frameworks, coding architectures, and midjourney parameters.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Unlimited prompt submissions (No 3-prompt cap)</span>
              </li>
              <li className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Unlock hidden/private VIP prompt templates</span>
              </li>
              <li className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Verified Pro Creator badge on your profile</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xl font-extrabold text-foreground">$5</span>
                <span className="text-xs text-muted-foreground"> / One-time payment</span>
              </div>
              <Link
                href="/payment"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <span>Upgrade Now</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-2">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Creator Tips</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">How to write prompts that get copied?</h4>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Use brackets for variable placeholders (e.g. <code>[Target Audience]</code>), provide clear execution steps, and specify the ideal AI model (e.g. GPT-4o, Claude 3.5).
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard/add-prompt"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Write a new prompt now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
