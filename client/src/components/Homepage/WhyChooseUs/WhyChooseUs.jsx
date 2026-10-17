import React from "react";
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  Coins,
  Cpu,
  Sparkles,
  Users,
} from "lucide-react";

export default function WhyChooseUs({ totalPrompts = 17 }) {
  const features = [
    {
      icon: CheckCircle2,
      title: "100% Battle-Tested Quality",
      description:
        "Every prompt on PromptMatrix undergoes rigorous testing across multiple iterations to guarantee zero hallucinations and production-grade outputs.",
      badge: "Verified Outputs",
    },
    {
      icon: Cpu,
      title: "Multi-Model Compatibility",
      description:
        "Precision-tuned prompts designed specifically for ChatGPT-4o, Claude 3.5 Sonnet, Midjourney v6, Flux.1, and Google Gemini Pro.",
      badge: "5+ AI Engines",
    },
    {
      icon: Zap,
      title: "Instant 1-Click Copy & Paste",
      description:
        "Copy system prompts, variables, negative prompt weights, and parameter presets in a single click with formatted syntax.",
      badge: "Zero Friction",
    },
    {
      icon: Coins,
      title: "Creator Monetization & Royalties",
      description:
        "Prompt engineers earn up to 85% revenue share on premium prompt sales with instant Stripe payouts and transparent analytics.",
      badge: "Earn Money",
    },
    {
      icon: Users,
      title: "Vibrant Prompt Community",
      description:
        `Read genuine developer reviews, copy counts, performance ratings, and explore over ${totalPrompts || 17}+ curated workflows.`,
      badge: `${totalPrompts || 17}+ Assets`,
    },
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Reliability",
      description:
        "Built with Next.js 16, Better-Auth security, role-based access control (RBAC), and MongoDB aggregation pipeline architecture.",
      badge: "Secure Platform",
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Why Choose PromptMatrix
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Engineered for <span className="ai-gradient-text">Real Results</span>, Not Generic Templates
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Stop wasting hours tweaking vague prompts. PromptMatrix connects you directly to production-ready prompt engineering assets.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card group relative rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/20 via-indigo-500/20 to-violet-500/20 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground group-hover:text-foreground">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
