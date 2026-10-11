"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  ThumbsUp,
  Clock,
  ArrowUpDown,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Check,
  Loader2,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { getClientSession } from "@/lib/authentication/client-session";
import {
  getUserReviews,
  updateUserReview,
  deleteUserReview,
} from "@/lib/actions/promts/userReviews";

// Format date helper
const formatDate = (dateInput) => {
  if (!dateInput) return "Recently";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
};

// AI tool badge styling helper
const getToolBadgeStyle = (tool = "") => {
  const t = String(tool).toLowerCase();
  if (t.includes("chatgpt") || t.includes("gpt")) {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
  if (t.includes("claude")) {
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  }
  if (t.includes("midjourney")) {
    return "bg-purple-500/10 text-purple-400 border-purple-500/30";
  }
  if (t.includes("gemini")) {
    return "bg-sky-500/10 text-sky-400 border-sky-500/30";
  }
  return "bg-primary/10 text-primary border-primary/30";
};

export default function MyReviews({ session: propSession }) {
  const clientSession = getClientSession();
  const session = propSession || clientSession;
  const user = session?.user;
  const userId = user?.id || user?._id;

  // Real-time state
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters & sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Interaction states
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Edit form state
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editComment, setEditComment] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch real-time data from MongoDB API
  const loadUserReviews = useCallback(
    async (isManualRefresh = false) => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await getUserReviews(userId);
        setReviews(Array.isArray(data) ? data : []);
        if (isManualRefresh) {
          showToast("Reviews synchronized with database!");
        }
      } catch (err) {
        console.error("Failed to load user reviews:", err);
        setError("Unable to load reviews. Please verify your connection.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    loadUserReviews();
  }, [loadUserReviews]);

  // Extract unique AI Tools for filter dropdown
  const availableTools = useMemo(() => {
    const tools = new Set();
    reviews.forEach((r) => {
      const tool = r.prompt?.aiTool || r.prompt?.aiModel || r.aiTool;
      if (tool) tools.add(tool);
    });
    return ["all", ...Array.from(tools)];
  }, [reviews]);

  // Filter & sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        const promptTitle = rev.prompt?.title || rev.promptTitle || "";
        const promptCategory = rev.prompt?.category || rev.category || "";
        const promptTool =
          rev.prompt?.aiTool || rev.prompt?.aiModel || rev.aiTool || "";
        const title = rev.title || "";
        const comment = rev.comment || rev.message || "";
        const rating = Number(rev.rating) || 5;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          promptTitle.toLowerCase().includes(q) ||
          title.toLowerCase().includes(q) ||
          comment.toLowerCase().includes(q) ||
          promptCategory.toLowerCase().includes(q) ||
          promptTool.toLowerCase().includes(q);

        const matchesRating =
          ratingFilter === "all" || rating === parseInt(ratingFilter, 10);

        const matchesTool =
          toolFilter === "all" ||
          promptTool.toLowerCase() === toolFilter.toLowerCase();

        return matchesSearch && matchesRating && matchesTool;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date || 0).getTime();
        const dateB = new Date(b.createdAt || b.date || 0).getTime();
        const ratingA = Number(a.rating) || 5;
        const ratingB = Number(b.rating) || 5;

        if (sortBy === "newest") return dateB - dateA;
        if (sortBy === "oldest") return dateA - dateB;
        if (sortBy === "highest") return ratingB - ratingA;
        if (sortBy === "lowest") return ratingA - ratingB;
        return 0;
      });
  }, [reviews, searchQuery, ratingFilter, toolFilter, sortBy]);

  // Open Edit Review Modal
  const handleOpenEdit = (review) => {
    setEditingReview(review);
    setEditRating(Number(review.rating) || 5);
    setEditTitle(
      review.title ||
        (review.message
          ? review.message.slice(0, 45) + (review.message.length > 45 ? "..." : "")
          : "")
    );
    setEditComment(review.comment || review.message || "");
  };

  // Save Edit Review to API
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingReview) return;

    const reviewId = editingReview._id || editingReview.id;
    setIsSubmittingEdit(true);

    const updatePayload = {
      rating: editRating,
      title: editTitle.trim(),
      comment: editComment.trim(),
      message: editComment.trim(),
    };

    const res = await updateUserReview(reviewId, updatePayload);
    setIsSubmittingEdit(false);

    if (res?.success) {
      setReviews((prev) =>
        prev.map((r) =>
          (r._id || r.id) === reviewId
            ? {
                ...r,
                ...updatePayload,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );
      setEditingReview(null);
      showToast("Review updated successfully!");
    } else {
      showToast(res?.message || "Failed to update review.");
    }
  };

  // Delete Review from API
  const handleDeleteReview = async (id) => {
    setIsDeletingId(id);
    const target = reviews.find((r) => (r._id || r.id) === id);

    // Optimistically update list
    setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
    setDeleteConfirmId(null);

    const res = await deleteUserReview(id);
    setIsDeletingId(null);

    if (res?.success) {
      showToast("Review deleted successfully.");
    } else {
      // Revert if API failed
      if (target) {
        setReviews((prev) => [target, ...prev]);
      }
      showToast(res?.message || "Failed to delete review.");
    }
  };

  // Computed statistics
  const totalReviewsCount = reviews.length;
  const avgRating =
    totalReviewsCount > 0
      ? (
          reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) /
          totalReviewsCount
        ).toFixed(1)
      : "5.0";
  const fiveStarCount = reviews.filter(
    (r) => (Number(r.rating) || 5) === 5
  ).length;

  const distinctPromptsCount = useMemo(() => {
    const set = new Set();
    reviews.forEach((r) => {
      if (r.promptId) set.add(r.promptId);
    });
    return set.size;
  }, [reviews]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Live Stats */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Real-Time Reviews Data</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              My <span className="ai-gradient-text">Reviews</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Track, update, and manage your genuine prompt reviews and feedback stored in MongoDB.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real-time Refresh Button */}
            <button
              type="button"
              onClick={() => loadUserReviews(true)}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh live reviews"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`}
              />
              <span>{isRefreshing ? "Syncing..." : "Sync Data"}</span>
            </button>

            <Link
              href="/allpromts"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
            >
              <Search className="h-4 w-4" />
              <span>Explore Prompts</span>
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
              <p className="text-muted-foreground font-medium">Reviews Stored</p>
              <p className="font-extrabold text-foreground text-sm">
                {isLoading ? "..." : `${totalReviewsCount} reviews`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Average Rating</p>
              <p className="font-extrabold text-foreground text-sm">
                {isLoading ? "..." : `${avgRating} / 5.0`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">5-Star Ratings</p>
              <p className="font-extrabold text-foreground text-sm">
                {isLoading ? "..." : `${fiveStarCount} perfect`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Prompts Reviewed</p>
              <p className="font-extrabold text-foreground text-sm">
                {isLoading ? "..." : `${distinctPromptsCount} unique`}
              </p>
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
            placeholder="Search reviews by prompt name, feedback, AI tool..."
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
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Rating:
            </span>
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
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Tool:
            </span>
            <select
              value={toolFilter}
              onChange={(e) => setToolFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              {availableTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool === "all" ? "All Tools" : tool}
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

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadUserReviews()}
            className="px-3 py-1 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-all text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Main Content: Loading Skeletons vs Data */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3 border-b border-border/40 pb-3">
                <div className="h-12 w-12 rounded-xl bg-muted/60 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-muted/60 rounded" />
                  <div className="h-4 w-48 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted/60 rounded" />
                <div className="h-4 w-full bg-muted/60 rounded" />
                <div className="h-3 w-3/4 bg-muted/60 rounded" />
              </div>
              <div className="h-4 w-32 bg-muted/60 rounded pt-2" />
            </div>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              {reviews.length === 0
                ? "No Reviews Submitted Yet"
                : "No matching reviews found"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {reviews.length === 0
                ? "You haven't written any reviews yet. Test prompts from the marketplace and share your experience to help the community!"
                : "Try adjusting your search criteria or resetting active filters."}
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {reviews.length === 0 ? (
              <Link
                href="/allpromts"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                <Search className="h-4 w-4" />
                <span>Explore Prompts to Review</span>
              </Link>
            ) : (
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
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* Card / Feed View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const reviewId = review._id || review.id;
            const prompt = review.prompt;
            const promptTitle =
              prompt?.title || review.promptTitle || "Prompt Template";
            const promptCategory =
              prompt?.category || review.category || "General";
            const promptTool =
              prompt?.aiModel || prompt?.aiTool || review.aiTool || "AI Prompt";
            const promptThumbnail =
              prompt?.thumbnail ||
              prompt?.image ||
              review.promptThumbnail ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
            const promptId = review.promptId || prompt?._id;

            const rating = Number(review.rating) || 5;
            const reviewMessage =
              review.comment || review.message || "No comment provided.";
            const reviewHeadline =
              review.title ||
              (review.message && review.message.length > 50
                ? review.message.slice(0, 47) + "..."
                : review.message || "User Review");

            const isDeleting = deleteConfirmId === reviewId;
            const isDeletingCurrent = isDeletingId === reviewId;

            return (
              <div
                key={reviewId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 space-y-4"
              >
                {/* Prompt Context Header */}
                <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={promptThumbnail}
                      alt={promptTitle}
                      className="h-12 w-12 rounded-xl object-cover border border-border/60 shrink-0 bg-muted"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-0.5 flex-wrap">
                        <span className="font-medium text-foreground/90">
                          {promptCategory}
                        </span>
                        <span>•</span>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getToolBadgeStyle(
                            promptTool
                          )}`}
                        >
                          <Zap className="h-2.5 w-2.5 mr-0.5" />
                          {promptTool}
                        </span>
                      </div>
                      {promptId ? (
                        <Link
                          href={`/allpromts/${promptId}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {promptTitle}
                        </Link>
                      ) : (
                        <span className="font-bold text-sm text-foreground line-clamp-1 block">
                          {promptTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1 shrink-0">
                    {promptId && (
                      <Link
                        href={`/allpromts/${promptId}`}
                        className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        title="View Public Prompt"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
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
                      onClick={() => setDeleteConfirmId(reviewId)}
                      className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-foreground ml-1.5">
                        {rating}.0
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(review.createdAt || review.date)}</span>
                    </div>
                  </div>

                  {/* Review Headline */}
                  <h4 className="text-sm font-bold text-foreground leading-snug">
                    "{reviewHeadline}"
                  </h4>

                  {/* Review Feedback Message */}
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">
                    {reviewMessage}
                  </p>
                </div>

                {/* Delete Confirmation or Footer */}
                {isDeleting ? (
                  <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-between gap-2 animate-in fade-in">
                    <span className="text-[11px] font-medium text-destructive">
                      Permanently delete this review?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isDeletingCurrent}
                        onClick={() => handleDeleteReview(reviewId)}
                        className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-[10px] font-bold hover:bg-destructive/90 transition-all flex items-center gap-1 disabled:opacity-50"
                      >
                        {isDeletingCurrent && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        <span>Yes, Delete</span>
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
                        Verified feedback stored in MongoDB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(review)}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Edit</span>
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table / List View */
        <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4 min-w-[240px]">Prompt Title</th>
                  <th className="py-3.5 px-4 min-w-[130px]">AI Tool</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Rating</th>
                  <th className="py-3.5 px-4 min-w-[300px]">Review Feedback</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Date</th>
                  <th className="py-3.5 px-4 text-right min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredReviews.map((review) => {
                  const reviewId = review._id || review.id;
                  const prompt = review.prompt;
                  const promptTitle =
                    prompt?.title || review.promptTitle || "Prompt Template";
                  const promptCategory =
                    prompt?.category || review.category || "General";
                  const promptTool =
                    prompt?.aiModel ||
                    prompt?.aiTool ||
                    review.aiTool ||
                    "AI Prompt";
                  const promptThumbnail =
                    prompt?.thumbnail ||
                    prompt?.image ||
                    review.promptThumbnail ||
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
                  const promptId = review.promptId || prompt?._id;

                  const rating = Number(review.rating) || 5;
                  const reviewMessage = review.comment || review.message || "";
                  const reviewHeadline =
                    review.title ||
                    (review.message && review.message.length > 40
                      ? review.message.slice(0, 37) + "..."
                      : review.message || "Prompt Review");

                  const isDeleting = deleteConfirmId === reviewId;

                  return (
                    <tr
                      key={reviewId}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={promptThumbnail}
                            alt={promptTitle}
                            className="h-10 w-10 rounded-lg object-cover border border-border/60 shrink-0 bg-muted"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80";
                            }}
                          />
                          <div className="max-w-[200px]">
                            {promptId ? (
                              <Link
                                href={`/allpromts/${promptId}`}
                                className="font-bold text-foreground hover:text-primary truncate block transition-colors"
                              >
                                {promptTitle}
                              </Link>
                            ) : (
                              <p className="font-bold text-foreground truncate">
                                {promptTitle}
                              </p>
                            )}
                            <span className="text-[10px] text-muted-foreground">
                              {promptCategory}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${getToolBadgeStyle(
                            promptTool
                          )}`}
                        >
                          <Zap className="h-3 w-3" />
                          {promptTool}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>{rating}.0</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-[320px]">
                        <p className="font-bold text-foreground truncate">
                          {reviewHeadline}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {reviewMessage}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                        {formatDate(review.createdAt || review.date)}
                      </td>

                      <td className="py-4 px-4 text-right">
                        {isDeleting ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(reviewId)}
                              className="px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-[10px] font-bold hover:bg-destructive/90"
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
                            {promptId && (
                              <Link
                                href={`/allpromts/${promptId}`}
                                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                                title="View Prompt"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                            )}

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
                              onClick={() => setDeleteConfirmId(reviewId)}
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
                <span className="text-xs font-semibold text-primary">
                  Real-Time Edit
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Update Your Review
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  For "
                  {editingReview.prompt?.title ||
                    editingReview.promptTitle ||
                    "Prompt"}
                  "
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
              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Star Rating
                </label>
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
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-sm text-foreground ml-2">
                    {editRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Title Headline */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Summary of your experience..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Review Message */}
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Feedback & Comments
                </label>
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
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmittingEdit && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>{isSubmittingEdit ? "Saving..." : "Save Changes"}</span>
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
