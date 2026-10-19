"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  Star,
  Flag,
  Zap,
  Layers,
  ArrowLeft,
  Lock,
  Globe,
  Sparkles,
  AlertTriangle,
  Send,
  User,
  ShieldCheck,
  Tag,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getClientSession } from "@/lib/authentication/client-session";
import { savePromts } from "@/lib/actions/promts/savePromts";
import { promtsReviews } from "@/lib/api/promts/promtsReviews";
import { saveCopycount } from "@/lib/actions/promts/saveCopycount";
import { postReportPromt, checkReportedStatus } from "@/lib/actions/promts/postReportPromt";

// Difficulty badge color lookup
const difficultyColors = {
  beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  pro: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function PromptDetails({ details, session: serverSession, promtid, initialReported = false }) {
  const router = useRouter();
  const clientSession = getClientSession();
  const session = serverSession || clientSession;
  const user = session?.user;
  const isLoggedIn = !!user;


  // States
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [copyCount, setCopyCount] = useState(details?.copyCount || 0);
  const [notification, setNotification] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      name: "David Chen",
      rating: 5,
      date: "2 days ago",
      comment: "Incredible prompt! Saved me hours of back-and-forth iteration with ChatGPT.",
    },
    {
      id: "rev-2",
      name: "Sarah Jenkins",
      rating: 5,
      date: "1 week ago",
      comment: "High consistency and great instructions. Definitely one of the best prompts in this category.",
    },
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate Content");
  const [reportDescription, setReportDescription] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [hasReported, setHasReported] = useState(initialReported);

  // Keep reported state persistent on refresh
  useEffect(() => {
    if (initialReported) {
      setHasReported(true);
      return;
    }

    const targetPromptId = promtid || details?._id;
    if (!targetPromptId) return;

    if (typeof window !== "undefined") {
      const isLocal = localStorage.getItem(`reported_${targetPromptId}`);
      if (isLocal) {
        setHasReported(true);
      }
      const isBookmarked = localStorage.getItem(`bookmarked_${targetPromptId}`);
      if (isBookmarked) {
        setBookmarked(true);
      }
    }

    const currentUserId = user?.id || user?._id;
    if (currentUserId) {
      checkReportedStatus(currentUserId, targetPromptId).then((reported) => {
        if (reported) setHasReported(true);
      });
    }
  }, [initialReported, user, promtid, details]);

  const isPrivate = details?.visibility?.toLowerCase() === "private";
  const isPremiumUser = user?.subscription === "premium" || user?.plan === "pro" || user?.isPremium || user?.role === "admin" || user?.userType === "admin";
  const isLocked = isPrivate && !isPremiumUser;
  // Handle Copy Prompt
  const handleCopyPrompt = async () => {
    if (isLocked) {
      router.push("/subscribe");
      return;
    }
    const textToCopy = details?.content || details?.description || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setCopyCount((prev) => prev + 1);
    setTimeout(() => setCopied(false), 2000);


    // saving copypromts details by posting method while clicking copy promts
    try {
      await saveCopycount({ promptId: promtid || details?._id });
    } catch (err) {
      console.error("Failed to update copy count:", err);
    }
  };

  // Auto-dismiss Google notification snackbar after 4.5 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Handle Bookmark Toggle
  const handleToggleBookmark = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/allpromts/${details?._id}`);
      return;
    }

    if (isBookmarking) return;

    const targetPromptId = promtid || details?._id;

    if (bookmarked) {
      setNotification({
        type: "info",
        title: "Already bookmarked",
        message: "This prompt is already saved in your bookmarks",
        actionText: "View Bookmarks",
        actionHref: "/dashboard/savedpromts",
      });
      return;
    }

    const data = {
      userId: user?.id || user?._id,
      userEmail: user?.email,
      promptId: details?._id,
      title: details?.title,
      category: details?.category,
      aiTool: details?.aiTool,
      aiModel: details?.aiModel,
      difficulty: details?.difficulty,
      thumbnail: details?.thumbnail,
      savedAt: new Date().toISOString(),
    };

    setIsBookmarking(true);
    try {
      const res = await savePromts(data);
      console.log("this is the res console", res);

      if (res?.success === true) {
        setBookmarked(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(`bookmarked_${targetPromptId}`, "true");
        }
        setNotification({
          type: "success",
          title: "Prompt saved to bookmarks",
          message: details?.title ? `"${details.title.slice(0, 32)}..." saved` : "Added to your saved collection",
          actionText: "View Bookmarks",
          actionHref: "/dashboard/savedpromts",
        });
      } else {
        setNotification({
          type: "error",
          title: "Bookmark failed",
          message: res?.message || "There was an error saving this prompt",
        });
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
      setNotification({
        type: "error",
        title: "Bookmark error",
        message: "Failed to connect to server. Please try again.",
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  // Handle Review Submission
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/allpromts/${details?._id}`);
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);

    const newRev = {
      id: Date.now().toString(),
      name: user?.name || "You",
      userId: user?.id,
      message: newComment,
      comment: newComment,
      rating: newRating,
      date: "Just now",
      promptId: details?._id,
    };

    try {
      const res = await promtsReviews(newRev);

      if (res?.success === true) {
        setNotification({
          type: "success",
          title: "Review submitted",
          message: "Your review has been successfully posted",
        });
      }

      setReviews([newRev, ...reviews]);
      setNewComment("");
      setNewRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle Report Submission
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReport(true);

    try {
      const data = {
        userId: user?.id || user?._id || "anonymous",
        promtId: promtid || details?._id,
        report: reportDescription ? `${reportReason}: ${reportDescription}` : reportReason,
        reason: reportReason,
        description: reportDescription,
        promptTitle: details?.title || "",
      };

      await postReportPromt(data);
      setHasReported(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(`reported_${promtid || details?._id}`, "true");
      }
      setReportSubmitted(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSubmitted(false);
        setReportDescription("");
        setIsSubmittingReport(false);
      }, 1500);
    } catch (err) {
      console.error("Error submitting report:", err);
      setIsSubmittingReport(false);
    }
  };

  const difficultyStyle =
    difficultyColors[details?.difficulty?.toLowerCase()] ||
    "bg-muted text-muted-foreground border-border";

  if (!details) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground">Prompt Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested prompt could not be loaded or does not exist.
        </p>
        <Link href="/allpromts" className="mt-6">
          <Button variant="outline" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Back to All Prompts
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Back Link */}
        <Link
          href="/allpromts"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Prompts
        </Link>

        {/* Top Hero Header Card */}
        <div className="glass-card rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
            <div className="space-y-4 flex-1">
              {/* Badges Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  <Zap className="h-3.5 w-3.5" />
                  {details.aiTool || "ChatGPT-4o"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  {details.category || "General"}
                </span>

                <span
                  className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold border ${difficultyStyle}`}
                >
                  {details.difficulty || "Intermediate"}
                </span>

                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${isPrivate
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}
                >
                  {isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                  {isPrivate ? "Premium Prompt" : "Public Prompt"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {details.title}
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {details.description}
              </p>

              {/* Stats & Creator info */}
              <div className="flex items-center gap-6 pt-2 text-xs sm:text-sm text-muted-foreground flex-wrap border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span>
                    Created by: <strong className="text-foreground">PromptMatrix Creator</strong>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>
                    <strong className="text-foreground">{copyCount}</strong> Copies
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>
                    <strong className="text-foreground">
                      {reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
                        : "5.0"}
                    </strong>{" "}
                    ({reviews.length} Reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons (Premium Glassmorphism Panel) */}
            <div className="flex flex-row lg:flex-col gap-2.5 min-w-[210px] sm:min-w-[230px] p-2.5 rounded-2xl bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border/70 shadow-xl shadow-black/5 dark:shadow-black/25">
              {/* 1. Primary Action: Copy Prompt */}
              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`relative overflow-hidden group/copy flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white transition-all duration-300 cursor-pointer active:scale-[0.98] ${copied
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-300/40"
                    : "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 ring-1 ring-white/25 hover:-translate-y-0.5"
                  }`}
              >
                {/* Shimmer light-sweep effect */}
                <span className="absolute inset-0 -translate-x-full group-hover/copy:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform ease-out pointer-events-none" />

                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-100 animate-in zoom-in-75 duration-200" />
                    <span className="tracking-wide">Prompt Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 transition-transform group-hover/copy:scale-110 duration-200" />
                    <span className="tracking-wide">Copy Prompt</span>
                  </>
                )}
              </button>

              {/* 2. Secondary Action: Bookmark */}
              <button
                type="button"
                onClick={handleToggleBookmark}
                disabled={isBookmarking}
                className={`relative overflow-hidden group/bookmark flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer active:scale-[0.98] ${bookmarked
                    ? "bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-500/15 border border-amber-500/40 text-amber-500 dark:text-amber-400 shadow-sm shadow-amber-500/20 hover:border-amber-500/60 hover:-translate-y-0.5"
                    : "bg-background/90 hover:bg-muted/80 dark:bg-card/90 text-foreground border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5"
                  }`}
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover/bookmark:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform ease-out pointer-events-none" />

                {bookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-amber-500 dark:text-amber-400 fill-amber-400/20" />
                    <span className="font-semibold tracking-wide">Bookmarked</span>
                    <Sparkles className="h-3 w-3 text-amber-400 ml-0.5 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 text-muted-foreground group-hover/bookmark:text-primary transition-colors" />
                    <span className="tracking-wide">{isBookmarking ? "Saving..." : "Bookmark"}</span>
                  </>
                )}
              </button>

              {/* 3. Tertiary Action: Report */}
              <button
                type="button"
                disabled={hasReported}
                onClick={() => !hasReported && setIsReportModalOpen(true)}
                className={`flex items-center justify-center gap-1.5 h-8.5 rounded-xl px-3 text-xs font-medium transition-all duration-200 ${hasReported
                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 font-semibold cursor-not-allowed shadow-2xs"
                    : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 cursor-pointer active:scale-95"
                  }`}
              >
                <Flag className={`h-3.5 w-3.5 ${hasReported ? "text-rose-500 fill-rose-500/30" : "transition-transform group-hover:scale-110"}`} />
                <span>{hasReported ? "Reported" : "Report Prompt"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prompt Code / Text Box */}
            <Card className="glass-card border-border/80 bg-card/80 overflow-hidden shadow-lg">
              <CardHeader className="p-5 pb-3 border-b border-border/60 bg-muted/30 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    {details.aiTool ? `${details.aiTool.toLowerCase().replace(/\s+/g, "_")}_prompt.txt` : "prompt.txt"}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyPrompt}
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </CardHeader>

              <CardContent className="p-6 relative">
                {isLocked ? (
                  /* Blurred Lock View for Private Prompts */
                  <div className="relative py-12 px-6 flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 select-none filter blur-md opacity-30 text-xs font-mono p-6 pointer-events-none">
                      You are a senior fullstack architect and AI specialist. Generate complete production-grade
                      architectures with TypeScript, strict schemas, error boundaries, caching layers, and high-performance
                      database indexing patterns. Ensure optimal token utilization.
                    </div>

                    <div className="relative z-10 max-w-md rounded-2xl border border-amber-500/30 bg-background/95 p-6 shadow-2xl backdrop-blur-xl space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 mx-auto">
                        <Lock className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Premium Prompt Locked</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          This is a private creator prompt. Unlock lifetime access to all premium prompts for only $5.
                        </p>
                      </div>
                      <Link href="/subscribe" className="block w-full">
                        <button
                          type="button"
                          className="relative overflow-hidden group/sub w-full flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-violet-600 to-indigo-600 hover:from-amber-400 hover:via-violet-500 hover:to-indigo-500 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-primary/30 ring-1 ring-white/25 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                        >
                          <span className="absolute inset-0 -translate-x-full group-hover/sub:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform ease-out pointer-events-none" />
                          <Sparkles className="h-4 w-4 text-amber-200 animate-pulse" />
                          <span>Subscribe for $5 Lifetime Access</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Full Prompt Text */
                  <pre className="text-sm font-mono text-foreground/90 whitespace-pre-wrap break-words leading-relaxed font-normal bg-background/50 p-4 rounded-xl border border-border/50 select-text">
                    {details.content || details.description || "No prompt content available."}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* How to Use Section */}
            <Card className="glass-card border-border/80 bg-card/80 p-6 shadow-md">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                How to Use this Prompt
              </h3>
              <ol className="space-y-3 text-xs sm:text-sm text-muted-foreground list-decimal list-inside">
                <li>
                  Click the <strong className="text-foreground">Copy Prompt</strong> button above.
                </li>
                <li>
                  Open your AI tool (e.g. <strong className="text-foreground">{details.aiTool || "ChatGPT"}</strong>).
                </li>
                <li>
                  Replace any bracketed placeholders like <code className="text-primary font-mono">[Insert Topic]</code> with your actual requirements.
                </li>
                <li>Press Enter to generate your tailored AI output.</li>
              </ol>
            </Card>

            {/* Community Reviews Section */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  Community Reviews ({reviews.length})
                </h3>
              </div>

              {/* Review Submission Form */}
              <form
                onSubmit={handleAddReview}
                suppressHydrationWarning
                className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4 shadow-xs"
              >
                <h4 className="text-xs font-semibold text-foreground">Leave a Review</h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-4 w-4 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    isLoggedIn
                      ? "Share your experience with this prompt..."
                      : "Please sign in to write a review..."
                  }
                  disabled={!isLoggedIn}
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-border/70 bg-background/80 p-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={!isLoggedIn || isSubmittingReview || !newComment.trim()}
                  className="relative overflow-hidden group/submit inline-flex items-center gap-2 h-10 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 ring-1 ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  <Send className="h-3.5 w-3.5 transition-transform group-hover/submit:translate-x-0.5" />
                  <span>{isSubmittingReview ? "Submitting..." : "Post Review"}</span>
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-4 text-center rounded-xl border border-dashed border-border/60">
                    No reviews yet. Be the first to leave a review!
                  </p>
                ) : (
                  reviews.map((rev, index) => (
                    <div
                      key={rev.id || rev._id || index}
                      className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                            {(rev.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-foreground">{rev.name || "Anonymous User"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: Number(rev.rating) || 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Just now")}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-8">{rev.comment || rev.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Details & Metadata */}
          <div className="space-y-6">
            {/* Thumbnail Card */}
            {details.thumbnail && (
              <div className="rounded-2xl border border-border/80 bg-card/80 overflow-hidden shadow-md">
                <div className="relative h-48 w-full">
                  <Image
                    src={details.thumbnail}
                    alt={details.title || "Thumbnail"}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Prompt Specs Card */}
            <Card className="glass-card border-border/80 bg-card/80 p-5 space-y-4 shadow-md">
              <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-3">
                Prompt Specifications
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Target AI Tool:</span>
                  <span className="font-semibold text-foreground">{details.aiTool || "ChatGPT-4o"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold text-foreground">{details.category || "General"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-semibold text-foreground capitalize">{details.difficulty || "Beginner"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibility:</span>
                  <span className="font-semibold text-foreground capitalize">{details.visibility || "Public"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Copies:</span>
                  <span className="font-semibold text-foreground">{copyCount}</span>
                </div>
              </div>
            </Card>

            {/* Tags Card */}
            {details.tags && details.tags.length > 0 && (
              <Card className="glass-card border-border/80 bg-card/80 p-5 space-y-3 shadow-md">
                <h3 className="text-sm font-bold text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {details.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-muted/80 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      <Tag className="h-3 w-3" />
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Creator Badge Card */}
            <Card className="glass-card border-border/80 bg-card/80 p-5 space-y-3 shadow-md">
              <h3 className="text-sm font-bold text-foreground">Creator Info</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                  C
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">PromptMatrix Creator</h4>
                  <p className="text-[11px] text-muted-foreground">Verified AI Engineer</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Report Prompt Modal */}
        {isReportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold text-foreground">Report Prompt</h3>
              </div>

              {reportSubmitted ? (
                <div className="text-center py-6 space-y-2">
                  <Check className="h-8 w-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">Report Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    Thank you. Our moderation team will review this prompt.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Reason for Report:
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full rounded-xl border border-border/70 bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="Inappropriate Content">Inappropriate Content</option>
                      <option value="Spam or Misleading">Spam or Misleading</option>
                      <option value="Copyright Violation">Copyright Violation</option>
                      <option value="Broken or Non-functional">Broken or Non-functional</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1">
                      Additional Details:
                    </label>
                    <textarea
                      rows={3}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      placeholder="Describe the issue..."
                      required
                      className="w-full rounded-xl border border-border/70 bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReportModalOpen(false)}
                      className="text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmittingReport}
                      className="bg-destructive text-white hover:bg-destructive/90 text-xs cursor-pointer"
                    >
                      {isSubmittingReport ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Google Material Design Notification / Snackbar */}
        {notification && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
          >
            <div className="flex items-center gap-3.5 px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-2xl bg-[#202124] text-[#e8eaed] dark:bg-[#282a2d] dark:text-[#f1f3f4] border border-[#3c4043] shadow-2xl shadow-black/50 backdrop-blur-md min-w-[290px] max-w-[92vw] sm:max-w-md">
              {/* Google Material Icon Badge */}
              <div
                className={`flex items-center justify-center h-9 w-9 rounded-full shrink-0 border ${notification.type === "error"
                    ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                    : notification.type === "info"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : "bg-[#8ab4f8]/15 text-[#8ab4f8] border-[#8ab4f8]/30"
                  }`}
              >
                {notification.type === "error" ? (
                  <AlertTriangle className="h-4.5 w-4.5 text-rose-400" />
                ) : notification.type === "info" ? (
                  <Bookmark className="h-4.5 w-4.5 text-amber-400" />
                ) : (
                  <BookmarkCheck className="h-4.5 w-4.5 text-[#8ab4f8]" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-semibold text-white tracking-tight leading-snug truncate">
                  {notification.title}
                </p>
                {notification.message && (
                  <p className="text-[11px] text-[#9aa0a6] leading-tight truncate">
                    {notification.message}
                  </p>
                )}
              </div>

              {/* Action Button (e.g. View Bookmarks) */}
              {notification.actionHref && (
                <Link
                  href={notification.actionHref}
                  onClick={() => setNotification(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8ab4f8] hover:text-[#aecbfa] hover:bg-[#8ab4f8]/10 transition-colors shrink-0 uppercase tracking-wider"
                >
                  <span>{notification.actionText || "View"}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setNotification(null)}
                aria-label="Dismiss notification"
                className="p-1 text-[#9aa0a6] hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
