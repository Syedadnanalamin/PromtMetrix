"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  Search,
  Trash2,
  Edit3,
  Star,
  Eye,
  Zap,
  Grid3X3,
  List,
  X,
  Layers,
  ThumbsUp,
  Clock,
  ArrowUpDown,
  ExternalLink,
  PlusCircle,
  Check,
  AlertCircle,
} from "lucide-react";

// Mock user reviews dataset
const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    promptId: "p-101",
    promptTitle: "SaaS Cold Email Sequence (5-Step High Conversion)",
    promptThumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    category: "Marketing & Copywriting",
    aiTool: "ChatGPT",
    aiModel: "GPT-4o",
    rating: 5,
    title: "Game changer for our outbound pipeline!",
    comment:
      "This 5-touch cadence delivered an immediate pattern interrupt for our B2B sales team. We booked 4 qualified demos in the first week of testing. The soft CTA approach is vastly superior to pushy sales pitches.",
    createdAt: "2025-02-21",
    helpfulCount: 18,
  },
  {
    id: "rev-2",
    promptId: "p-102",
    promptTitle: "Full-Stack Next.js 16 Clean Architecture Boilerplate",
    promptThumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    category: "Coding & Development",
    aiTool: "Claude",
    aiModel: "Claude 3.5 Sonnet",
    rating: 5,
    title: "Production-ready structure with Zero Fluff",
    comment:
      "Extremely clean folder hierarchy and well-typed Server Action boilerplates. Claude scaffolded the Zod validation and Better Auth middleware seamlessly without hallucinations. Saved us easily 20+ hours of setup time.",
    createdAt: "2025-02-19",
    helpfulCount: 24,
  },
  {
    id: "rev-3",
    promptId: "p-103",
    promptTitle: "Cyberpunk Cinematic Portrait & Neon Volumetric Lighting",
    promptThumbnail:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    category: "Art & Image Generation",
    aiTool: "Midjourney",
    aiModel: "Midjourney v6",
    rating: 4,
    title: "Stunning volumetric lighting and colors",
    comment:
      "The octane render and anamorphic lens parameters produce incredible reflections in rain environments. Just had to tweak the stylized weight (--s 250) to get exact character likeness, but the prompt base is top tier.",
    createdAt: "2025-02-15",
    helpfulCount: 9,
  },
  {
    id: "rev-4",
    promptId: "p-106",
    promptTitle: "High-Ticket B2B Sales Objection Handling Matrix",
    promptThumbnail:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
    category: "Business & Sales",
    aiTool: "ChatGPT",
    aiModel: "GPT-4o",
    rating: 5,
    title: "The Empathy-Reflect framework won our negotiation",
    comment:
      "Used the exact scripts when handling a tight budget objection on an enterprise software deal. The buyer felt understood and agreed to a low-risk pilot instead of walking away. Highly recommended!",
    createdAt: "2025-02-10",
    helpfulCount: 14,
  },
];

export default function MyReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Interaction feedback states
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [lastRemovedReview, setLastRemovedReview] = useState(null);

  // Edit form state
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");

  const availableTools = useMemo(() => {
    const tools = new Set(reviews.map((r) => r.aiTool));
    return ["all", ...Array.from(tools)];
  }, [reviews]);

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        const matchesSearch =
          rev.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rev.aiTool.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRating =
          ratingFilter === "all" || rev.rating === parseInt(ratingFilter, 10);

        const matchesTool = toolFilter === "all" || rev.aiTool === toolFilter;

        return matchesSearch && matchesRating && matchesTool;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "highest") {
          return b.rating - a.rating;
        }
        if (sortBy === "lowest") {
          return a.rating - b.rating;
        }
        if (sortBy === "helpful") {
          return b.helpfulCount - a.helpfulCount;
        }
        return 0;
      });
  }, [reviews, searchQuery, ratingFilter, toolFilter, sortBy]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Edit Review Modal
  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditTitle(review.title);
    setEditComment(review.comment);
  };

  // Save Edit Review
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingReview) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingReview.id
          ? {
              ...r,
              rating: editRating,
              title: editTitle.trim(),
              comment: editComment.trim(),
            }
          : r
      )
    );

    setEditingReview(null);
    showToast("Review updated successfully!");
  };

  // Delete Review
  const handleDeleteReview = (id) => {
    const target = reviews.find((r) => r.id === id);
    if (target) {
      setLastRemovedReview(target);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setDeleteConfirmId(null);
      showToast("Review deleted.");
    }
  };

  // Undo Delete
  const handleUndoDelete = () => {
    if (lastRemovedReview) {
      setReviews((prev) => [lastRemovedReview, ...prev]);
      setLastRemovedReview(null);
      setToastMessage(null);
    }
  };

  // Aggregate stats
  const totalReviewsCount = reviews.length;
  const avgRating =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviewsCount).toFixed(1)
      : "0.0";
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const totalHelpful = reviews.reduce((acc, curr) => acc + curr.helpfulCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Stats Overview */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Community Feedback</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              My <span className="ai-gradient-text">Reviews</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Track and manage all community ratings, feedback, and helpful insights you've shared on AI prompt templates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/allpromts"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-98"
            >
              <Search className="h-4 w-4" />
              <span>Explore & Review Prompts</span>
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Reviews Submitted</p>
              <p className="font-extrabold text-foreground text-sm">{totalReviewsCount} reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Average Rating</p>
              <p className="font-extrabold text-foreground text-sm">{avgRating} / 5.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">5-Star Ratings</p>
              <p className="font-extrabold text-foreground text-sm">{fiveStarCount} perfect</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ThumbsUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Helpful Impact</p>
              <p className="font-extrabold text-foreground text-sm">{totalHelpful} upvotes</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & View Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews by prompt, title, feedback keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Rating Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars (★★★★★)</option>
              <option value="4">4 Stars (★★★★☆)</option>
              <option value="3">3 Stars (★★★☆☆)</option>
              <option value="2">2 Stars (★★☆☆☆)</option>
              <option value="1">1 Star (★☆☆☆☆)</option>
            </select>
          </div>

          {/* Tool Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Tool:</span>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              {availableTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool === "all" ? "All AI Tools" : tool}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-0.5 ml-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card Feed View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(searchQuery || ratingFilter !== "all" || toolFilter !== "all") && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
              Search: "{searchQuery}"
              <button type="button" onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3 hover:text-foreground" />
              </button>
            </span>
          )}
          {ratingFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              {ratingFilter} Stars
              <button type="button" onClick={() => setRatingFilter("all")}>
                <X className="h-3 w-3 hover:text-foreground" />
              </button>
            </span>
          )}
          {toolFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Tool: {toolFilter}
              <button type="button" onClick={() => setToolFilter("all")}>
                <X className="h-3 w-3 hover:text-foreground" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setRatingFilter("all");
              setToolFilter("all");
            }}
            className="text-xs font-semibold text-primary hover:underline ml-1"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 3. Main Content Area */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {searchQuery || ratingFilter !== "all" || toolFilter !== "all"
                ? "No matching reviews found"
                : "No Reviews Given Yet"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {searchQuery || ratingFilter !== "all" || toolFilter !== "all"
                ? "Try adjusting your search criteria or resetting filters."
                : "Try out AI prompts from the marketplace and share your thoughts to help creators and the community!"}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {searchQuery || ratingFilter !== "all" || toolFilter !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setRatingFilter("all");
                  setToolFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                href="/allpromts"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                <Search className="h-4 w-4" />
                <span>Explore Prompts to Review</span>
              </Link>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* Card / Feed View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const isDeleting = deleteConfirmId === review.id;

            return (
              <div
                key={review.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 space-y-4"
              >
                {/* Review Header: Prompt Context Banner */}
                <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={review.promptThumbnail}
                      alt={review.promptTitle}
                      className="h-12 w-12 rounded-xl object-cover border border-border/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-0.5">
                        <span className="font-medium text-foreground/90">{review.category}</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">
                          {review.aiModel || review.aiTool}
                        </span>
                      </div>
                      <Link
                        href={`/allpromts/${review.promptId}`}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
                      >
                        {review.promptTitle}
                      </Link>
                    </div>
                  </div>

                  {/* Actions Dropdown / Icon Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/allpromts/${review.promptId}`}
                      className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      title="View Public Prompt"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(review)}
                      className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      title="Edit Review"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(review.id)}
                      className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-2.5">
                  {/* Star Rating Display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted border-muted"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-foreground ml-1.5">
                        {review.rating}.0
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{review.createdAt}</span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h4 className="text-sm font-bold text-foreground leading-snug">
                    "{review.title}"
                  </h4>

                  {/* Review Comment */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Delete Confirmation or Footer Info */}
                {isDeleting ? (
                  <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-between gap-2 animate-in fade-in">
                    <span className="text-[11px] font-medium text-destructive">
                      Permanently delete this review?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-[10px] font-bold hover:bg-destructive/90 transition-all"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground text-[10px]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                      <span>
                        <strong className="text-foreground">{review.helpfulCount}</strong> people found this helpful
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(review)}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Update</span>
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Layout View */
        <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Prompt Title</th>
                  <th className="py-3.5 px-4">AI Tool</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Headline & Feedback</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredReviews.map((review) => {
                  const isDeleting = deleteConfirmId === review.id;

                  return (
                    <tr key={review.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.promptThumbnail}
                            alt={review.promptTitle}
                            className="h-10 w-10 rounded-lg object-cover border border-border/60 shrink-0"
                          />
                          <div className="max-w-[200px]">
                            <p className="font-bold text-foreground truncate">{review.promptTitle}</p>
                            <span className="text-[10px] text-muted-foreground">{review.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <Zap className="h-3 w-3" />
                          {review.aiModel || review.aiTool}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{review.rating}.0</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-[300px]">
                        <p className="font-bold text-foreground truncate">{review.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{review.comment}</p>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                        {review.createdAt}
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isDeleting ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review.id)}
                              className="px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-md border border-border hover:bg-muted text-muted-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/allpromts/${review.promptId}`}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                              title="View Prompt"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(review)}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                              title="Edit Review"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(review.id)}
                              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-primary">Edit Feedback</span>
                <h3 className="text-lg font-bold text-foreground">Update Your Review</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  For "{editingReview.promptTitle}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Star Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= editRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-foreground ml-2">
                    {editRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Headline */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Review Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Summary of your experience..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Review Detailed Feedback */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Detailed Comments</label>
                <textarea
                  required
                  rows={4}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="What worked well? How did this prompt help your workflow?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
                />
              </div>

              <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-4 py-3 text-xs text-foreground shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold">{toastMessage}</span>

          {lastRemovedReview && (
            <button
              type="button"
              onClick={handleUndoDelete}
              className="ml-2 font-bold text-primary hover:underline"
            >
              Undo
            </button>
          )}

          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
