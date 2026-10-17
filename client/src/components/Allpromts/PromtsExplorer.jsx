"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PromtCard from "./PromtCard";

export default function PromtsExplorer({ initialPrompts = [] }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Sync state when URL query params change (e.g. from Header Searchbar)
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || searchParams.get("q");
    if (searchFromUrl !== null && searchFromUrl !== undefined) {
      setSearchTerm(searchFromUrl);
    }
    const toolFromUrl = searchParams.get("tool");
    if (toolFromUrl) {
      setSelectedTool(toolFromUrl);
    }
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Extract unique categories & AI tools dynamically from available prompts
  const categories = useMemo(() => {
    const cats = new Set(initialPrompts.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [initialPrompts]);

  const aiTools = useMemo(() => {
    const tools = new Set(initialPrompts.map((p) => p.aiTool).filter(Boolean));
    return ["all", ...Array.from(tools)];
  }, [initialPrompts]);

  const difficulties = ["all", "Beginner", "Intermediate", "Pro"];

  // Filter & sort prompts
  const filteredPrompts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return initialPrompts
      .filter((prompt) => {
        // 1. Search Query Match
        const matchTitle = prompt.title?.toLowerCase().includes(term);
        const matchDesc = prompt.description?.toLowerCase().includes(term);
        const matchTool = prompt.aiTool?.toLowerCase().includes(term);
        const matchCategory = prompt.category?.toLowerCase().includes(term);
        const matchTags = prompt.tags?.some((t) => t.toLowerCase().includes(term));

        const matchesSearch = !term || matchTitle || matchDesc || matchTool || matchCategory || matchTags;

        // 2. Category Match
        const matchesCategory =
          selectedCategory === "all" || prompt.category?.toLowerCase() === selectedCategory.toLowerCase();

        // 3. AI Tool Match
        const matchesTool =
          selectedTool === "all" || prompt.aiTool?.toLowerCase() === selectedTool.toLowerCase();

        // 4. Difficulty Match
        const matchesDifficulty =
          selectedDifficulty === "all" || prompt.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

        return matchesSearch && matchesCategory && matchesTool && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortBy === "copied") return (b.copyCount || 0) - (a.copyCount || 0);
        if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [initialPrompts, searchTerm, selectedCategory, selectedTool, selectedDifficulty, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedTool("all");
    setSelectedDifficulty("all");
    setSortBy("latest");
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedTool !== "all" || selectedDifficulty !== "all";

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar Container */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-xl shadow-xs space-y-4">
        {/* Top Row: Search input & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts by title, keywords, tags, or AI tools..."
              className="pl-10 pr-10 bg-background/70 border-border/70 h-10 rounded-xl"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 rounded-xl border border-border/70 bg-background/70 px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="copied">Sort: Most Copied</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/40 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8 rounded-lg border border-border/70 bg-background/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 capitalize cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c !== "all").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* AI Tool Filter */}
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="h-8 rounded-lg border border-border/70 bg-background/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All AI Tools</option>
            {aiTools.filter((t) => t !== "all").map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-8 rounded-lg border border-border/70 bg-background/80 px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            {difficulties.filter((d) => d !== "all").map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive gap-1 ml-auto cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filteredPrompts.length}</strong> of{" "}
          {initialPrompts.length} prompts
        </span>
      </div>

      {/* Prompts Cards Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromtCard key={prompt._id || prompt.title} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No matching prompts found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Try adjusting your search terms or filters to find what you are looking for.
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="mt-4 gap-1.5 text-xs cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
