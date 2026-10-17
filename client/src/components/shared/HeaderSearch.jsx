"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  X,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  Command,
  CornerDownLeft,
  Tag,
  Layers,
  ChevronRight,
  Trash2,
  ExternalLink,
} from "lucide-react";

// Storage key for recent searches
const RECENT_SEARCHES_KEY = "promptmatrix_recent_searches";
const MAX_RECENT_SEARCHES = 5;

// Popular AI tools & quick search pills
const QUICK_AI_TOOLS = [
  { name: "ChatGPT-4o", color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30" },
  { name: "Midjourney", color: "from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30" },
  { name: "Claude 3.5", color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30" },
  { name: "Gemini 1.5", color: "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30" },
];

const QUICK_CATEGORIES = ["Development", "UI/UX Design", "Marketing", "Writing", "Business"];

// Global in-memory cache for prompts to avoid re-fetching on every focus
let cachedPrompts = null;

export default function HeaderSearch({
  variant = "header", // "header" | "modal" | "drawer"
  onClose = null,
  autoFocus = false,
  className = "",
}) {
  const router = useRouter();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMac, setIsMac] = useState(false);

  // Detect platform for keyboard shortcut display (⌘K vs Ctrl+K)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || ""));
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to read recent searches from localStorage", err);
      }
    }
  }, []);

  // Fetch prompts on demand with caching
  const loadPrompts = useCallback(async () => {
    if (cachedPrompts && cachedPrompts.length > 0) {
      setPrompts(cachedPrompts);
      return;
    }

    try {
      setIsLoading(true);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/api/allpromts`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        cachedPrompts = list;
        setPrompts(list);
      }
    } catch (err) {
      console.error("Failed to fetch prompts for search:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load prompts when user interacts with search
  const handleFocus = () => {
    setIsOpen(true);
    loadPrompts();
  };

  // Auto focus if requested (e.g. In modal)
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      loadPrompts();
    }
  }, [autoFocus, loadPrompts]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger if already inside an editable input or textarea, unless it's our own search
      const targetTag = e.target?.tagName?.toLowerCase();
      const isInput = targetTag === "input" || targetTag === "textarea" || e.target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
        setIsOpen(true);
        loadPrompts();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [loadPrompts]);

  // Handle click outside to close dropdown in header mode
  useEffect(() => {
    if (variant === "modal") return; // Modal handles close via backdrop or close button

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [variant]);

  // Save to recent searches
  const saveRecentSearch = (term) => {
    const clean = term.trim();
    if (!clean) return;

    try {
      const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(
        0,
        MAX_RECENT_SEARCHES
      );
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save recent search", err);
    }
  };

  // Remove single recent search
  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update recent searches", err);
    }
  };

  // Clear all recent searches
  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error("Failed to clear recent searches", err);
    }
  };

  // Filter prompts based on search query
  const filteredPrompts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return prompts
      .filter((prompt) => {
        // Only include public / approved if status exists
        if (prompt.status && prompt.status !== "approved") return false;
        if (prompt.visibility && prompt.visibility.toLowerCase() === "private") return false;

        const matchTitle = prompt.title?.toLowerCase().includes(q);
        const matchDesc = prompt.description?.toLowerCase().includes(q);
        const matchTool = prompt.aiTool?.toLowerCase().includes(q);
        const matchCategory = prompt.category?.toLowerCase().includes(q);
        const matchTags = Array.isArray(prompt.tags) && prompt.tags.some((t) => t?.toLowerCase().includes(q));

        return matchTitle || matchDesc || matchTool || matchCategory || matchTags;
      })
      .sort((a, b) => {
        // Prioritize exact or title match
        const aTitle = (a.title || "").toLowerCase();
        const bTitle = (b.title || "").toLowerCase();
        const aStarts = aTitle.startsWith(q);
        const bStarts = bTitle.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        const aIncludes = aTitle.includes(q);
        const bIncludes = bTitle.includes(q);
        if (aIncludes && !bIncludes) return -1;
        if (!aIncludes && bIncludes) return 1;

        return (b.copyCount || 0) - (a.copyCount || 0);
      })
      .slice(0, 5);
  }, [prompts, query]);

  // Featured / popular prompts when query is empty
  const featuredPrompts = useMemo(() => {
    return prompts
      .filter((p) => p.status === "approved" || !p.status)
      .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
      .slice(0, 3);
  }, [prompts]);

  // Navigate to prompt details
  const handleSelectPrompt = (prompt) => {
    saveRecentSearch(prompt.title);
    setIsOpen(false);
    if (onClose) onClose();
    router.push(`/allpromts/${prompt._id}`);
  };

  // Execute search navigation
  const executeSearch = (searchTerm) => {
    const term = (searchTerm ?? query).trim();
    if (!term) return;

    saveRecentSearch(term);
    setIsOpen(false);
    if (onClose) onClose();
    router.push(`/allpromts?search=${encodeURIComponent(term)}`);
  };

  // Keyboard navigation inside dropdown
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        loadPrompts();
      }
      return;
    }

    const itemsCount = filteredPrompts.length;
    // Total items: results + 1 for "view all" action (if query has text)
    const maxIndex = query.trim() ? itemsCount : -1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < itemsCount) {
        // Selected a prompt item
        handleSelectPrompt(filteredPrompts[selectedIndex]);
      } else {
        // Execute search with typed query or view all
        executeSearch();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      if (onClose) onClose();
      inputRef.current?.blur();
    }
  };

  // Highlight search text helper
  const highlightMatch = (text, highlight) => {
    if (!text || !highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-primary font-bold underline decoration-primary/40 underline-offset-2">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const isModal = variant === "modal";

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isModal ? "" : "max-w-md"} ${className}`}
    >
      {/* Search Input Bar */}
      <div
        className={`group flex items-center gap-2 rounded-full border transition-all duration-200 ${
          isOpen
            ? "border-primary/60 bg-background ring-2 ring-primary/20 shadow-md shadow-primary/5"
            : "border-border/70 bg-muted/40 hover:border-primary/40 hover:bg-muted/70"
        } px-3.5 py-1.5`}
      >
        <Search
          className={`h-4 w-4 shrink-0 transition-colors ${
            isOpen ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search prompts (e.g. ChatGPT, Midjourney, SEO)..."
          className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
          aria-label="Search prompts"
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />

        {/* Clear Button */}
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          /* Keyboard shortcut pill */
          <kbd className="hidden sm:inline-flex pointer-events-none items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-2xs">
            <span>{isMac ? "⌘" : "Ctrl"}</span>
            <span>K</span>
          </kbd>
        )}
      </div>

      {/* Floating Dropdown / Results View */}
      {isOpen && (
        <div
          className={`${
            isModal
              ? "mt-3 w-full"
              : "absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-[calc(100vw-2rem)] sm:w-[480px] lg:w-[500px]"
          } z-50 rounded-2xl border border-border/80 bg-popover/95 backdrop-blur-xl shadow-2xl p-3 text-popover-foreground animate-in fade-in-0 zoom-in-95 duration-150`}
        >
          {/* Scrollable Container */}
          <div className="max-h-[65vh] sm:max-h-[460px] overflow-y-auto space-y-4 pr-1">
            {/* Case 1: User has typed a query */}
            {query.trim() ? (
              <div>
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>
                    Results for &quot;<span className="text-foreground">{query.trim()}</span>&quot;
                  </span>
                  {filteredPrompts.length > 0 && (
                    <span className="text-primary font-mono">{filteredPrompts.length} matches</span>
                  )}
                </div>

                {isLoading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin text-primary" />
                    Searching prompts...
                  </div>
                ) : filteredPrompts.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {filteredPrompts.map((prompt, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={prompt._id}
                          onClick={() => handleSelectPrompt(prompt)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`group/item flex items-center gap-3 rounded-xl p-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-primary/10 text-primary border-l-2 border-primary pl-2"
                              : "hover:bg-accent/60"
                          }`}
                        >
                          {/* Thumbnail / Tool Icon */}
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted/60 border border-border/50">
                            {prompt.thumbnail ? (
                              <Image
                                src={prompt.thumbnail}
                                alt={prompt.title || "Prompt"}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                <Zap className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          {/* Title & Metadata */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-semibold truncate text-foreground group-hover/item:text-primary transition-colors">
                              {highlightMatch(prompt.title, query)}
                            </span>
                            <div className="mt-1 flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                              {prompt.aiTool && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                  <Zap className="h-2.5 w-2.5" />
                                  {prompt.aiTool}
                                </span>
                              )}
                              {prompt.category && (
                                <span className="inline-flex items-center gap-1 text-[11px] truncate">
                                  <Layers className="h-3 w-3 text-muted-foreground/70" />
                                  {prompt.category}
                                </span>
                              )}
                              {prompt.copyCount > 0 && (
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {prompt.copyCount} copies
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow indicator */}
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                              isSelected ? "translate-x-0.5 text-primary" : "group-hover/item:translate-x-0.5"
                            }`}
                          />
                        </div>
                      );
                    })}

                    {/* View all results footer action */}
                    <div
                      onClick={() => executeSearch()}
                      onMouseEnter={() => setSelectedIndex(filteredPrompts.length)}
                      className={`mt-2 flex items-center justify-between rounded-xl border border-primary/20 p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                        selectedIndex === filteredPrompts.length
                          ? "bg-primary text-white"
                          : "bg-primary/5 text-primary hover:bg-primary/15"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Search className="h-3.5 w-3.5" />
                        View all results for &quot;{query}&quot;
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <span>Enter</span>
                        <CornerDownLeft className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty state */
                  <div className="py-8 text-center px-4">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-2">
                      <Search className="h-5 w-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      No prompts found matching &quot;{query}&quot;
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                      Try searching with broader terms or search in the full prompt catalogue.
                    </p>
                    <button
                      type="button"
                      onClick={() => executeSearch()}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      Search all prompts catalogue
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Case 2: Query is empty - Show discovery tools & recent searches */
              <div className="space-y-4 py-1">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        Recent Searches
                      </span>
                      <button
                        type="button"
                        onClick={clearAllRecent}
                        className="text-[10px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1 mt-1">
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => executeSearch(term)}
                          className="group/tag inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/40 hover:border-primary/40 hover:bg-muted px-2.5 py-1 text-xs text-foreground transition-colors cursor-pointer"
                        >
                          <Search className="h-3 w-3 text-muted-foreground" />
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-0.5 cursor-pointer"
                            title="Remove"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular AI Tools */}
                <div>
                  <div className="px-2 pb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-primary" />
                    Browse by AI Tool
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 px-1 mt-1">
                    {QUICK_AI_TOOLS.map((tool) => (
                      <button
                        key={tool.name}
                        type="button"
                        onClick={() => executeSearch(tool.name)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border bg-gradient-to-r ${tool.color} p-2 text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer`}
                      >
                        <Zap className="h-3 w-3 shrink-0" />
                        <span className="truncate">{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Categories */}
                <div>
                  <div className="px-2 pb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-primary" />
                    Popular Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1 mt-1">
                    {QUICK_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => executeSearch(cat)}
                        className="rounded-lg border border-border/70 bg-card/60 hover:border-primary/50 hover:bg-accent/60 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured / Popular Prompts */}
                {featuredPrompts.length > 0 && (
                  <div className="border-t border-border/50 pt-3">
                    <div className="px-2 pb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      Trending Prompts
                    </div>
                    <div className="space-y-1 mt-1">
                      {featuredPrompts.map((prompt) => (
                        <div
                          key={prompt._id}
                          onClick={() => handleSelectPrompt(prompt)}
                          className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-accent/60 transition-colors cursor-pointer"
                        >
                          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-muted/60 border border-border/50">
                            {prompt.thumbnail ? (
                              <Image
                                src={prompt.thumbnail}
                                alt={prompt.title || "Prompt"}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                <Zap className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-xs font-semibold truncate text-foreground">
                              {prompt.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                              {prompt.aiTool || "AI Prompt"} • {prompt.copyCount || 0} copies
                            </span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shortcut guide footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 px-2 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">↵</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono">esc</kbd>
                Close
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
                router.push("/allpromts");
              }}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Browse all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
