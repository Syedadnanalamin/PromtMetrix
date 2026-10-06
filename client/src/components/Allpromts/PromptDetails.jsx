"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getClientSession } from "@/lib/authentication/client-session";
import { savePromts } from "@/lib/actions/promts/savePromts";
import { promtsReviews } from "@/lib/api/promts/promtsReviews";
import { saveCopycount } from "@/lib/actions/promts/saveCopycount";

// Difficulty badge color lookup
const difficultyColors = {
  beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  pro: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function PromptDetails({ details, session: serverSession, promtid }) {
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

  const isPrivate = details?.visibility?.toLowerCase() === "private";
  const isPremiumUser = user?.subscription === "premium" || user?.role === "admin";
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
    const data = {

      userId: user.id,
      promptId: promtid
    }


    const result = await saveCopycount(data);

  };

  // Handle Bookmark Toggle
  const handleToggleBookmark = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/allpromts/${details?._id}`);
      return;
    }

    if (isBookmarking) return;

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
        alert("Promt added to the bookmark list");
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
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

    const res = await promtsReviews(newRev);

    if (res?.success === true) {
      alert("Review added successfully");
    }

    setTimeout(() => {
      setReviews([newRev, ...reviews]);
      setNewComment("");
      setNewRating(5);
      setIsSubmittingReview(false);
    }, 400);
  };

  // Handle Report Submission
  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSubmitted(false);
      setReportDescription("");
    }, 1500);
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
                    <strong className="text-foreground">4.9</strong> ({reviews.length} Reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-3 min-w-[190px]">
              <Button
                onClick={handleCopyPrompt}
                className="ai-glow-button flex-1 text-white border-0 gap-2 h-11 text-sm font-semibold shadow-md cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={handleToggleBookmark}
                className="flex-1 gap-2 h-11 border-border/80 hover:bg-accent text-sm font-medium cursor-pointer"
              >
                {bookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                    <span className="text-primary font-semibold">Bookmarked</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                    <span>Bookmark</span>
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs text-muted-foreground hover:text-destructive gap-1.5 justify-center cursor-pointer"
              >
                <Flag className="h-3.5 w-3.5" />
                Report Prompt
              </Button>
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
                      <Link href="/subscribe">
                        <Button className="w-full ai-glow-button text-white border-0 font-semibold text-xs h-10 shadow-md">
                          <Sparkles className="h-4 w-4 mr-1.5" />
                          Subscribe for $5 Lifetime Access
                        </Button>
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

                <Button
                  type="submit"
                  size="sm"
                  disabled={!isLoggedIn || isSubmittingReview || !newComment.trim()}
                  className="ai-glow-button text-white border-0 text-xs gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSubmittingReview ? "Submitting..." : "Post Review"}
                </Button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev, index) => (
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
                        <span className="text-[10px] text-muted-foreground">{rev.date || "Just now"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-8">{rev.comment || rev.message}</p>
                  </div>
                ))}
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
                      className="bg-destructive text-white hover:bg-destructive/90 text-xs cursor-pointer"
                    >
                      Submit Report
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
