"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check, Eye, Zap, Tag, Layers, Sparkles, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { saveCopycount } from "@/lib/actions/promts/saveCopycount";

// Difficulty badge color lookup object
const difficultyColors = {
  beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  pro: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function PromtCard({ prompt }) {
  const [copied, setCopied] = useState(false);
  const [copyCount, setCopyCount] = useState(prompt?.copyCount ?? 0);

  useEffect(() => {
    setCopyCount(prompt?.copyCount ?? 0);
  }, [prompt?.copyCount]);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const textToCopy = prompt?.content || prompt?.description || prompt?.title || "";
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setCopyCount((prev) => prev + 1);
      setTimeout(() => setCopied(false), 2000);

      await saveCopycount({ promptId: prompt?._id });
    } catch (err) {
      console.error("Failed to copy prompt or increment copy count:", err);
    }
  };

  const difficultyStyle =
    difficultyColors[prompt?.difficulty?.toLowerCase()] ||
    "bg-muted text-muted-foreground border-border";

  const isPrivate = prompt?.visibility?.toLowerCase() === "private";

  return (
    <Card className="glass-card group flex flex-col justify-between overflow-hidden border-border/70 bg-card/80 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40">
      <div>
        {/* Thumbnail Image */}
        {prompt?.thumbnail ? (
          <div className="relative h-44 w-full overflow-hidden bg-muted/40">
            <Image
              src={prompt.thumbnail}
              alt={prompt.title || "Prompt Thumbnail"}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

            {/* AI Tool Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-background/85 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-md shadow-sm border border-border/50">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>{prompt.aiTool || "AI Tool"}</span>
            </div>

            {/* Visibility Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold text-white shadow-xs ${
                  isPrivate ? "bg-amber-500/90" : "bg-emerald-600/90"
                }`}
              >
                {isPrivate ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                {isPrivate ? "Private" : "Public"}
              </span>
            </div>
          </div>
        ) : null}

        <CardHeader className="p-5 pb-2">
          {/* Category & Difficulty Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              {prompt?.category || "General"}
            </span>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${difficultyStyle}`}>
              {prompt?.difficulty || "Beginner"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {prompt?.title || "Untitled Prompt"}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {prompt?.description || "No description provided."}
          </p>

          {/* Tags */}
          {prompt?.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {prompt.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardHeader>
      </div>

      <div>
        {/* Copy count & status footer */}
        <CardContent className="px-5 py-2">
          <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-[11px]">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <strong className="text-foreground">{copyCount}</strong> copies
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
              {prompt?.status || "approved"}
            </span>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="p-5 pt-3 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="flex-1 gap-1.5 text-xs font-medium border-border/80 hover:bg-accent cursor-pointer"
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

          <Link href={`/allpromts/${prompt?._id}`} className="flex-1">
            <Button
              size="sm"
              className="w-full gap-1.5 text-xs font-medium ai-glow-button text-white border-0 shadow-sm cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
