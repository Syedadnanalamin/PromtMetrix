"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";
import { getClientSession } from "@/lib/authentication/client-session";
import PromptHeader from "./PromptHeader";
import PromptForm from "./PromptForm";
import PromptPreviewCard from "./PromptPreviewCard";
import { PRESET_THUMBNAILS } from "./promptConstants";
import { addNewPromt } from "@/lib/actions/promts/addpromts";

export default function Addpromts({ session: propSession, isLimitReached: propIsLimitReached, promptCount: propPromptCount }) {
  const clientSession = getClientSession();
  const session = propSession || clientSession;
  const user = session?.user;
  const userType = user?.userType || "user";
  const plan = user?.plan || "free";
  const isPro = plan === "pro" || user?.isPremium;

  const isLimitReached = propIsLimitReached !== undefined
    ? propIsLimitReached
    : (userType === "user" && !isPro && (propPromptCount || 0) >= 3);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Marketing & Copywriting",
    aiTool: "ChatGPT (GPT-4o)",
    difficulty: "Beginner",
    visibility: "Public",
    thumbnail: PRESET_THUMBNAILS[0].url,
    usageInstructions: "",
  });

  // Dynamic tags state
  const [tags, setTags] = useState(["ai", "prompt", "marketing"]);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Prompt title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Short overview description is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Prompt instructions / template content is required";
    } else if (formData.content.trim().length < 15) {
      errors.content = "Prompt content should be descriptive (at least 15 characters)";
    }

    if (!formData.thumbnail.trim()) {
      errors.thumbnail = "Thumbnail URL is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      tags,
      creator: {
        name: user?.name || "Anonymous Creator",
        email: user?.email || "",
        image: user?.image || user?.photoURL || "",
        userId: user?.id || "",
      },
      copyCount: 0,
      status: "pending",
      rating: 5,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    const result = await addNewPromt(payload);

    if (result?.success) {
      setSubmittedTitle(formData.title);
      setSubmittedSuccess(true);
    }

    setIsSubmitting(false);
  };

  // Reset Handler
  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "Marketing & Copywriting",
      aiTool: "ChatGPT (GPT-4o)",
      difficulty: "Beginner",
      visibility: "Public",
      thumbnail: PRESET_THUMBNAILS[0].url,
      usageInstructions: "",
    });
    setTags(["ai", "prompt", "marketing"]);
    setFormErrors({});
    setSubmittedSuccess(false);
  };

  // If free user limit is reached, do not show the form page
  if (isLimitReached) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Crown className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Prompt Limit Reached</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You have reached your limit of 3 prompts on the Free plan. Upgrade to Pro for unlimited prompt creations!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 max-w-xs mx-auto">
            <p className="text-xs text-muted-foreground font-medium">Used Prompts</p>
            <p className="text-2xl font-extrabold text-foreground">{propPromptCount ?? 3} / 3</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <form action="/api/checkout_sessions" method="POST" className="w-full sm:w-auto">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Pro ($5 Lifetime)</span>
              </button>
            </form>

            <Link
              href="/dashboard/my-prompts"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all"
            >
              View My Prompts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Moderation Status */}
      <PromptHeader
        submittedSuccess={submittedSuccess}
        submittedTitle={submittedTitle}
        onReset={handleReset}
      />

      {/* 2. Main Studio Grid: Form (Left) & Real-time Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Subcomponent (7 cols) */}
        <div className="lg:col-span-7">
          <PromptForm
            formData={formData}
            setFormData={setFormData}
            tags={tags}
            setTags={setTags}
            formErrors={formErrors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>

        {/* Right Column: Sticky Live Preview Subcomponent (5 cols) */}
        <div className="lg:col-span-5 w-full self-start sticky top-20 md:top-24">
          <PromptPreviewCard
            formData={formData}
            tags={tags}
            userName={user?.name}
          />
        </div>
      </div>
    </div>
  );
}
