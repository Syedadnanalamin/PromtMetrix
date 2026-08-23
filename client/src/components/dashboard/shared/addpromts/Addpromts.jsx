"use client";

import React, { useState } from "react";
import { getClientSession } from "@/lib/authentication/client-session";
import PromptHeader from "./PromptHeader";
import PromptForm from "./PromptForm";
import PromptPreviewCard from "./PromptPreviewCard";
import { PRESET_THUMBNAILS } from "./promptConstants";
import { addNewPromt } from "@/lib/actions/promts/addpromts";

export default function Addpromts() {
  const session = getClientSession();
  const user = session?.user;

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

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTitle(formData.title);
      setSubmittedSuccess(true);
    }, 900);
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
