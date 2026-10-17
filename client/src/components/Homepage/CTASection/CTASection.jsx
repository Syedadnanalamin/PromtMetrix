import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection({ totalPrompts = 17, totalUsers = 5 }) {
  const usersCount = totalUsers ? `${totalUsers * 100 + 400}+` : "50,000+";

  return (
    <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-tr from-primary/20 via-indigo-600/15 to-violet-600/10 p-8 sm:p-14 lg:p-16 text-center backdrop-blur-2xl shadow-2xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary mb-6 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Join {usersCount} AI Creators & Engineers
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl max-w-3xl mx-auto">
            Ready to Build <span className="ai-gradient-text">10x Faster</span> with Better Prompts?
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Access over {totalPrompts || 17}+ curated, production-tested AI prompts today. Create your free account in 30 seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="ai-glow-button text-white font-medium border-0 gap-2 px-8 shadow-xl cursor-pointer">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/allpromts">
              <Button
                size="lg"
                variant="outline"
                className="border-border/80 bg-background/60 hover:bg-accent font-medium gap-2 px-8 backdrop-blur-sm cursor-pointer"
              >
                <Layers className="h-4 w-4 text-primary" />
                Browse Prompts
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Instant 1-click clipboard copy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Commercial license included
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
