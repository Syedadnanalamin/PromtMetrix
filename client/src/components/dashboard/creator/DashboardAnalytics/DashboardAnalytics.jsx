"use client";

import React, { useMemo } from "react";
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
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Award,
} from "lucide-react";

export default function CreatorDashboardAnalytics({ session, prompts = [] }) {
  const user = session?.user;
  const creatorName = user?.name || "AI Prompt Creator";

  const promptList = useMemo(() => (Array.isArray(prompts) ? prompts : []), [prompts]);
  const totalPrompts = promptList.length;
  const approvedPrompts = promptList.filter((p) => (p.status || "").toLowerCase() === "approved").length;
  const pendingPrompts = promptList.filter((p) => (p.status || "pending").toLowerCase() === "pending").length;
  const totalCopies = promptList.reduce((acc, p) => acc + (p.copyCount ?? p.copies ?? 0), 0);
  const totalBookmarks = promptList.reduce((acc, p) => acc + (p.bookmarks || 0), 0);

  const ratedPrompts = promptList.filter((p) => p.rating !== undefined && p.rating !== null);
  const avgRating =
    ratedPrompts.length > 0
      ? (ratedPrompts.reduce((acc, p) => acc + Number(p.rating), 0) / ratedPrompts.length).toFixed(1)
      : "5.0";

  // Dynamic Summary Metrics
  const stats = [
    {
      title: "Total Prompts",
      value: totalPrompts,
      subtext: `${approvedPrompts} approved, ${pendingPrompts} pending`,
      icon: FolderKanban,
      trend: `${totalPrompts} published`,
      color: "from-violet-500/20 to-purple-500/20 text-primary border-primary/20",
    },
    {
      title: "Total Prompt Copies",
      value: totalCopies,
      subtext: `${totalCopies} community executions`,
      icon: Copy,
      trend: `${totalCopies} copies`,
      color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/20",
    },
    {
      title: "Total Bookmarks",
      value: totalBookmarks,
      subtext: `${totalBookmarks} user saves`,
      icon: Bookmark,
      trend: `${totalBookmarks} saves`,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/20",
    },
    {
      title: "Avg Community Rating",
      value: totalPrompts > 0 ? avgRating : "0.0",
      subtext: totalPrompts > 0 ? `Across ${totalPrompts} prompts` : "No ratings yet",
      icon: Star,
      trend: totalPrompts > 0 ? "Rated" : "Unrated",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
    },
  ];

  // Tool distribution breakdown from real data
  const toolBreakdown = useMemo(() => {
    if (totalPrompts === 0) return [];
    const counts = {};
    promptList.forEach((p) => {
      const tool = p.aiTool || "Other";
      counts[tool] = (counts[tool] || 0) + 1;
    });
    const colors = ["bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-blue-500", "bg-primary"];
    return Object.entries(counts).map(([name, count], idx) => ({
      name,
      count,
      percentage: Math.round((count / totalPrompts) * 100),
      color: colors[idx % colors.length],
    }));
  }, [promptList, totalPrompts]);

  const topPrompts = promptList.slice(0, 5);

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

        {/* Creator Catalog Summary Ribbon */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 font-bold text-primary">
              <Award className="h-3.5 w-3.5" /> Creator Account
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{totalPrompts} Published Templates</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="text-muted-foreground hidden sm:inline">{totalCopies} Total Copies</span>
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

      {/* 3. Growth & AI Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Engagement Overview (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">Prompt Engagement Trajectory</h3>
              <p className="text-xs text-muted-foreground">Community interaction across all published templates</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
              <Zap className="h-3.5 w-3.5" /> Real-Time Analytics
            </span>
          </div>

          {totalPrompts === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">No Copy Activity Yet</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Once you publish prompt templates and members copy them, your engagement activity will be displayed here.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/add-prompt"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Create Your First Prompt</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                  <p className="text-xs text-muted-foreground">Average Copies / Prompt</p>
                  <p className="text-2xl font-black text-foreground mt-1">
                    {totalPrompts > 0 ? (totalCopies / totalPrompts).toFixed(1) : "0"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                  <p className="text-xs text-muted-foreground">Average Saves / Prompt</p>
                  <p className="text-2xl font-black text-foreground mt-1">
                    {totalPrompts > 0 ? (totalBookmarks / totalPrompts).toFixed(1) : "0"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: AI Tool Breakdown & Monetization Tip (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-foreground">Distribution by AI Tool</h3>
              <p className="text-xs text-muted-foreground">AI tools used across your prompt templates</p>
            </div>

            {toolBreakdown.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No AI tools registered yet. Create prompts to see distribution.</p>
            ) : (
              <div className="space-y-4">
                {toolBreakdown.map((tool, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-foreground">{tool.name}</span>
                      <span className="text-muted-foreground">
                        {tool.count} prompt(s) ({tool.percentage}%)
                      </span>
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
            )}
          </div>

          {/* Monetization / Pro Creator Banner */}
          <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-primary/15 via-card to-card p-5 backdrop-blur-xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Creator Monetization</span>
            </div>
            <h4 className="text-xs font-extrabold text-foreground">Monetize premium prompts</h4>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Mark your templates as <code>Private (Premium)</code> to earn revenue share whenever Pro subscribers access your workflows.
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
            <h3 className="text-sm font-bold text-foreground">Your Prompts Overview</h3>
            <p className="text-xs text-muted-foreground">Live performance of your AI prompt templates</p>
          </div>
          <Link
            href="/dashboard/my-prompts"
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Manage all prompts <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {topPrompts.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-foreground">No prompts published yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven&apos;t submitted any prompts to your creator catalog. Click below to add your first template.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/add-prompt"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add New Prompt</span>
              </Link>
            </div>
          </div>
        ) : (
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
                {topPrompts.map((prompt) => {
                  const pId = prompt._id || prompt.id;
                  const copiesCount = prompt.copyCount ?? prompt.copies ?? 0;
                  return (
                    <tr key={pId} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-foreground max-w-[240px] truncate">
                        {prompt.title}
                      </td>
                      <td className="py-3.5 pr-4 text-muted-foreground">{prompt.aiTool}</td>
                      <td className="py-3.5 pr-4 font-semibold text-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Copy className="h-3 w-3 text-primary" /> {copiesCount}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Bookmark className="h-3 w-3 text-amber-400" /> {prompt.bookmarks || 0}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-bold text-amber-400">★ {prompt.rating || 5}</span>
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
                          Manage <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
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
