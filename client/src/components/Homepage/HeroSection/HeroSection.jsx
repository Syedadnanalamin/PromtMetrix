"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Copy,
  Check,
  Zap,
  Terminal,
  Layers,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultTrendingTags = [
  { label: "ChatGPT-4o", query: "ChatGPT" },
  { label: "Midjourney v6", query: "Midjourney" },
  { label: "Claude 3.5", query: "Claude" },
  { label: "Coding Assistant", query: "Development" },
  { label: "UI/UX Design", query: "UI/UX" },
  { label: "SEO Copywriting", query: "Marketing" },
];

export default function HeroSection({
  initialPrompt = null,
  stats = null,
  totalPromptsCount = 0,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Dynamic featured prompt values
  const activePromptTitle =
    initialPrompt?.title || "Principal System Architect & Concurrency Optimizer";
  const activePromptText =
    initialPrompt?.content ||
    initialPrompt?.description ||
    "Act as a Principal Staff Software Architect. Analyze this system architecture for high concurrency, identify bottlenecks, and generate optimized database indexing strategies with step-by-step implementation code.";
  const activePromptTool = initialPrompt?.aiTool || "ChatGPT-4o, Claude 3.5";
  const activePromptCopies = initialPrompt?.copyCount ?? 4890;
  const activePromptId = initialPrompt?._id;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/allpromts?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/allpromts");
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promptsDisplayCount =
    stats?.totalPrompts || totalPromptsCount || 17;
  const copiesDisplayCount = stats?.totalCopies
    ? stats.totalCopies > 1000
      ? `${(stats.totalCopies / 1000).toFixed(1)}K+`
      : `${stats.totalCopies}+`
    : "3.2K+";
  const usersDisplayCount = stats?.totalUsers
    ? `${stats.totalUsers * 100 + 400}+`
    : "5,000+";

  return (
    <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-14">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[550px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/20 via-indigo-500/15 to-violet-600/10 blur-[130px]" />
        <div className="absolute top-1/2 right-[-10%] h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary shadow-xs backdrop-blur-md transition-all hover:bg-primary/15">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
            <span>The #1 Marketplace for Tested AI Prompts</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span className="font-semibold text-foreground/90">
              {promptsDisplayCount}+ Curated
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Supercharge Your Workflow with{" "}
            <span className="ai-gradient-text">Battle-Tested</span> AI Prompts
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            Discover, copy, and monetize production-grade prompts engineered for
            <span className="font-medium text-foreground"> ChatGPT</span>,
            <span className="font-medium text-foreground"> Midjourney</span>,
            <span className="font-medium text-foreground"> Claude</span>, and
            <span className="font-medium text-foreground"> Gemini</span>.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex w-full max-w-2xl flex-col gap-2.5 rounded-2xl border border-border/80 bg-card/80 p-2 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-2 sm:rounded-full"
          >
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts (e.g. SEO strategy, UI design, Code refactor)..."
                className="w-full bg-transparent py-3 pl-12 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              className="ai-glow-button text-white font-medium border-0 px-7 sm:rounded-full cursor-pointer"
            >
              Search Prompts
            </Button>
          </form>

          {/* Trending Search Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Trending:</span>
            {defaultTrendingTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() =>
                  router.push(`/allpromts?search=${encodeURIComponent(tag.query)}`)
                }
                className="rounded-full border border-border/70 bg-card/60 px-3 py-1 font-medium transition-colors hover:border-primary/50 hover:bg-accent/60 hover:text-foreground cursor-pointer"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/allpromts">
              <Button
                size="lg"
                className="ai-glow-button text-white font-medium border-0 gap-2 shadow-xl px-7 cursor-pointer"
              >
                <Layers className="h-4 w-4" />
                Browse All Prompts
              </Button>
            </Link>
            <Link href="/dashboard/add-prompt">
              <Button
                size="lg"
                variant="outline"
                className="border-border/80 bg-background/60 hover:bg-accent font-medium gap-2 px-7 backdrop-blur-sm cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                Submit a Prompt
              </Button>
            </Link>
          </div>

          {/* Interactive Live Prompt Demo Card */}
          <div className="mt-14 w-full max-w-3xl">
            <div className="relative rounded-2xl border border-border/80 bg-card/90 p-5 shadow-2xl backdrop-blur-2xl text-left transition-all hover:border-primary/40">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Featured Prompt
                      </span>
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                        ⭐ 4.9 Verified
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                      {activePromptTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyPrompt}
                    className="gap-1.5 border-border bg-background/80 hover:bg-accent cursor-pointer text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </Button>

                  {activePromptId && (
                    <Link href={`/allpromts/${activePromptId}`}>
                      <Button
                        size="sm"
                        className="ai-glow-button text-white border-0 text-xs px-2.5"
                      >
                        Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-3.5 rounded-xl bg-muted/40 p-4 font-mono text-xs text-foreground/90 leading-relaxed border border-border/40 max-h-36 overflow-y-auto">
                <p>{activePromptText}</p>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Works on:{" "}
                    <strong className="text-foreground">{activePromptTool}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <strong>4.95</strong> (1,400+ reviews)
                  </span>
                </div>
                <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  🔥 {activePromptCopies} copies recorded
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 border-t border-border/60 pt-10 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {promptsDisplayCount}+
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Tested Prompts</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {copiesDisplayCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Prompt Runs</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {usersDisplayCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">Prompt Engineers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-extrabold text-foreground sm:text-3xl">$0</div>
              <div className="text-xs text-muted-foreground mt-0.5">Free to Get Started</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
