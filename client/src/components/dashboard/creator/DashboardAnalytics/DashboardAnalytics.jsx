"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Copy,
  Bookmark,
  FolderKanban,
  Star,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Award,
  Layers,
  ExternalLink,
} from "lucide-react";

export default function CreatorDashboardAnalytics({ session }) {
  const user = session?.user;
  const creatorName = user?.name || "AI Prompt Creator";

  const [timeRange, setTimeRange] = useState("30d");

  // Summary Metrics as required in Section 5.B
  const stats = [
    {
      title: "Total Prompts",
      value: "14",
      subtext: "12 approved, 2 pending",
      icon: FolderKanban,
      trend: "+3 this month",
      trendUp: true,
      color: "from-violet-500/20 to-purple-500/20 text-primary border-primary/20",
    },
    {
      title: "Total Prompt Copies",
      value: "1,842",
      subtext: "+24.8% vs last month",
      icon: Copy,
      trend: "+342 this week",
      trendUp: true,
      color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/20",
    },
    {
      title: "Total Bookmarks",
      value: "428",
      subtext: "Saved by 310 users",
      icon: Bookmark,
      trend: "+18.2% growth",
      trendUp: true,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/20",
    },
    {
      title: "Avg Community Rating",
      value: "4.92",
      subtext: "From 94 verified reviews",
      icon: Star,
      trend: "Top 5% Creator",
      trendUp: true,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
    },
  ];

  // Visual Weekly Analytics Data (for interactive SVG graph)
  const weeklyData = [
    { day: "Mon", copies: 48, views: 120 },
    { day: "Tue", copies: 65, views: 180 },
    { day: "Wed", copies: 92, views: 240 },
    { day: "Thu", copies: 85, views: 210 },
    { day: "Fri", copies: 124, views: 320 },
    { day: "Sat", copies: 140, views: 390 },
    { day: "Sun", copies: 168, views: 440 },
  ];
  const maxCopies = 180;

  // AI Tool distribution breakdown
  const toolBreakdown = [
    { name: "ChatGPT (GPT-4o)", percentage: 48, copies: 884, color: "bg-emerald-500" },
    { name: "Claude 3.5 Sonnet", percentage: 28, copies: 516, color: "bg-amber-500" },
    { name: "Midjourney v6", percentage: 16, copies: 295, color: "bg-purple-500" },
    { name: "Google Gemini 1.5", percentage: 8, copies: 147, color: "bg-blue-500" },
  ];

  // Top Performing Prompts Table
  const topPrompts = [
    {
      id: "p1",
      title: "SaaS Cold Email Engine (3-Step B2B Personalization)",
      category: "Marketing & Copywriting",
      tool: "ChatGPT",
      copies: 642,
      bookmarks: 182,
      rating: 4.9,
      status: "approved",
    },
    {
      id: "p2",
      title: "Clean Next.js 15 Full-Stack Architecture Generator",
      category: "Coding & Dev",
      tool: "Claude 3.5",
      copies: 518,
      bookmarks: 140,
      rating: 5.0,
      status: "approved",
    },
    {
      id: "p3",
      title: "Ultra-Realistic 8K Cyberpunk Cinematic Portrait",
      category: "Art & Image",
      tool: "Midjourney v6",
      copies: 382,
      bookmarks: 76,
      rating: 4.8,
      status: "approved",
    },
    {
      id: "p4",
      title: "SEO Keyword Clustering & Content Gap Analyzer",
      category: "Marketing & Copywriting",
      tool: "Gemini 1.5",
      copies: 198,
      bookmarks: 30,
      rating: 4.7,
      status: "pending",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Creator Studio Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Creator Analytics Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Creator Studio, <span className="ai-gradient-text">{creatorName}</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Track real-time prompt copy engagement, growth trajectory, and audience reception across your AI templates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/add-prompt"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Publish New Prompt</span>
            </Link>
            <Link
              href="/dashboard/my-prompts"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-all"
            >
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
              <span>Manage Prompts</span>
            </Link>
          </div>
        </div>

        {/* Creator Tier & Score Ribbon */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 font-bold text-primary">
              <Award className="h-3.5 w-3.5" /> Verified Tier 2 Creator
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">98.4% Approval Rate</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground hidden sm:inline">14 Published Templates</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Filter Analytics:</span>
            {["7d", "30d", "All Time"].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range.toLowerCase())}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  timeRange === range.toLowerCase()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Key Performance Metrics (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{stat.title}</span>
                <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-extrabold tracking-tight text-foreground">{stat.value}</p>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stat.subtext}</span>
                  <span className="font-bold text-emerald-400 inline-flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> {stat.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Visual Growth Graph & AI Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Weekly Copies Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">Prompt Copy Trajectory</h3>
              <p className="text-xs text-muted-foreground">Daily executions and engagement across all published prompts</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
              <Zap className="h-3.5 w-3.5" /> +24% vs Last Week
            </span>
          </div>

          {/* Interactive Responsive SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-56 w-full flex items-end justify-between gap-3 px-2">
              {weeklyData.map((item, i) => {
                const heightPercent = Math.round((item.copies / maxCopies) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded-md shadow-md border border-border pointer-events-none mb-1">
                      {item.copies} copies
                    </div>
                    {/* Visual Bar with Gradient */}
                    <div className="w-full max-w-[36px] bg-muted/40 rounded-t-lg overflow-hidden h-40 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-linear-to-t from-primary/70 via-primary to-violet-400 rounded-t-lg group-hover:from-primary group-hover:to-cyan-400 transition-all duration-300"
                      />
                    </div>
                    {/* Day Label */}
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Peak Activity: <strong>Sunday (168 copies)</strong></span>
            <span>Total 7-Day Copies: <strong>722 copies</strong></span>
          </div>
        </div>

        {/* Right: AI Tool Breakdown & Monetization Tip (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">Distribution by AI Tool</h3>
              <p className="text-xs text-muted-foreground">Where your audience executes your prompts</p>
            </div>

            <div className="space-y-4">
              {toolBreakdown.map((tool, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">{tool.name}</span>
                    <span className="text-muted-foreground">{tool.copies} copies ({tool.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${tool.percentage}%` }}
                      className={`h-full ${tool.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monetization / Pro Creator Banner */}
          <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-primary/15 via-card to-card p-5 backdrop-blur-xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Creator Monetization</span>
            </div>
            <h4 className="text-xs font-extrabold text-foreground">Want to monetize private prompts?</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Mark your top-tier templates as <code>Private (Premium)</code> to earn revenue shares whenever subscribed users copy your workflow.
            </p>
            <div className="mt-3">
              <Link
                href="/dashboard/add-prompt"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                Create a Premium Prompt &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Performing Prompts Table */}
      <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-sm font-bold text-foreground">Top Performing Prompts</h3>
            <p className="text-xs text-muted-foreground">Your most copied and highly rated AI templates</p>
          </div>
          <Link
            href="/dashboard/my-prompts"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            View all my prompts <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground">
                <th className="pb-3 font-semibold">Prompt Title</th>
                <th className="pb-3 font-semibold">AI Tool</th>
                <th className="pb-3 font-semibold">Copies</th>
                <th className="pb-3 font-semibold">Bookmarks</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {topPrompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-foreground max-w-[240px] truncate">
                    {prompt.title}
                  </td>
                  <td className="py-3.5 pr-4 text-muted-foreground">{prompt.tool}</td>
                  <td className="py-3.5 pr-4 font-semibold text-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Copy className="h-3 w-3 text-primary" /> {prompt.copies}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Bookmark className="h-3 w-3 text-amber-400" /> {prompt.bookmarks}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="font-bold text-amber-400">★ {prompt.rating}</span>
                  </td>
                  <td className="py-3.5 pr-4">
                    {prompt.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Clock className="h-3 w-3" /> In Review
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href="/dashboard/my-prompts"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      Manage <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
