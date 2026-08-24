"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Crown,
  Zap,
  Sparkles,
  Camera,
  CheckCircle2,
  ArrowUpRight,
  Lock,
  Bookmark,
  MessageSquare,
  FolderKanban,
  Edit3,
  Save,
  X,
  Calendar,
  Copy,
  Check,
  ChevronRight,
  Bell,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function Profile({ session }) {
  const user = session?.user;
  const isPremiumUser = user?.isPremium || false;

  // Profile editable state
  const [name, setName] = useState(user?.name || "Prompt Explorer");
  const [email] = useState(user?.email || "user@promptmatrix.com");
  const [photoURL, setPhotoURL] = useState(
    user?.image ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
  );
  const [bio, setBio] = useState(
    "AI prompt engineer and SaaS builder exploring high-converting workflows for ChatGPT, Claude 3.5 Sonnet, and Midjourney v6."
  );
  const [primaryAiTool, setPrimaryAiTool] = useState("ChatGPT (GPT-4o)");
  const [interests, setInterests] = useState([
    "Copywriting",
    "Clean Code Architecture",
    "Autonomous Agents",
    "3D Asset Design",
  ]);
  const [newInterestInput, setNewInterestInput] = useState("");

  // UI tabs & states
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "edit" | "subscription" | "security"
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Security form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification toggles
  const [notifications, setNotifications] = useState({
    promptApproved: true,
    weeklyDigest: true,
    newReviews: true,
    marketingUpdates: false,
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCopyUserId = () => {
    const userId = user?.id || user?._id || "usr_pm_9482749102";
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    showToast("User ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile settings updated successfully!");
      setActiveTab("overview");
    }, 600);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match!");
      return;
    }
    showToast("Password updated securely!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    if (!interests.includes(newInterestInput.trim())) {
      setInterests([...interests, newInterestInput.trim()]);
    }
    setNewInterestInput("");
  };

  const handleRemoveInterest = (item) => {
    setInterests(interests.filter((i) => i !== item));
  };

  // Mock profile metrics
  const totalSubmissions = 2;
  const maxFreePrompts = 3;
  const totalBookmarks = 6;
  const totalReviews = 4;
  const memberSince = "February 2025";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Profile Summary Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="relative group shrink-0">
              <img
                src={photoURL}
                alt={name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-2 ring-primary/40 shadow-lg"
              />
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-transform active:scale-95"
                title="Change Photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {name}
                </h1>

                {/* Subscription Badge */}
                {isPremiumUser ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-400">
                    <Crown className="h-3.5 w-3.5" /> Pro Tier Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-3 py-0.5 text-xs font-semibold text-foreground">
                    <Zap className="h-3.5 w-3.5 text-primary" /> Free Tier Account
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>{email}</span>
                <span className="text-muted-foreground/60">•</span>
                <Calendar className="h-3.5 w-3.5" />
                <span>Member since {memberSince}</span>
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded-md border border-border/60">
                  ID: {user?.id?.slice(0, 10) || "usr_pm_9482"}...
                </span>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="hover:text-foreground text-primary font-medium"
                >
                  {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {!isPremiumUser && (
              <Link
                href="/payment"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 transition-all active:scale-98"
              >
                <Crown className="h-4 w-4" />
                <span>Upgrade to Pro ($5)</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-all shadow-xs"
            >
              <Edit3 className="h-4 w-4 text-muted-foreground" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Counter Grid */}
        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <Link
            href="/dashboard/my-prompts"
            className="flex items-center gap-2.5 group hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Submissions</p>
              <p className="font-extrabold text-foreground text-sm">
                {totalSubmissions} / {isPremiumUser ? "∞" : `${maxFreePrompts} Free`}
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/savedpromts"
            className="flex items-center gap-2.5 group hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Saved Prompts</p>
              <p className="font-extrabold text-foreground text-sm">{totalBookmarks} saved</p>
            </div>
          </Link>

          <Link
            href="/dashboard/my-reviews"
            className="flex items-center gap-2.5 group hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">My Reviews</p>
              <p className="font-extrabold text-foreground text-sm">{totalReviews} written</p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Account Role</p>
              <p className="font-extrabold text-foreground text-sm capitalize">
                {user?.role || "User"} Account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>Account Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === "edit"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subscription")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === "subscription"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Crown className="h-3.5 w-3.5" />
          <span>Subscription & Plan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap ${
            activeTab === "security"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Security & Notifications</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bio & Core Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>About & Bio</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Edit Bio
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{bio}</p>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                  AI Focus & Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium"
                    >
                      <Tag className="h-2.5 w-2.5" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Details Card */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Account Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                  <p className="text-muted-foreground font-medium">Full Name</p>
                  <p className="font-bold text-foreground text-sm">{name}</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                  <p className="text-muted-foreground font-medium">Email Address</p>
                  <p className="font-bold text-foreground text-sm truncate">{email}</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                  <p className="text-muted-foreground font-medium">Preferred AI Tool</p>
                  <p className="font-bold text-primary text-sm">{primaryAiTool}</p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                  <p className="text-muted-foreground font-medium">Account Status</p>
                  <p className="font-bold text-emerald-400 text-sm flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upgrade Box or Plan Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {!isPremiumUser ? (
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-500/10 via-card to-card p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Crown className="h-4 w-4" />
                  <span>Free Tier Limit Notice</span>
                </div>
                <h3 className="text-base font-extrabold text-foreground">
                  Upgrade to PromptMatrix Pro ($5 Lifetime)
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Free accounts are capped at <strong>3 prompt submissions</strong>. Unlock unlimited public/private prompts, VIP templates, and your verified Pro badge.
                </p>

                <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-foreground">$5</span>
                    <span className="text-xs text-muted-foreground"> / One-time</span>
                  </div>
                  <Link
                    href="/payment"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    <span>Upgrade Now</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/10 via-card to-card p-6 backdrop-blur-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Active Pro Membership</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Unlimited Creator Privileges</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your account has unlimited prompt publishing slots and instant access to all private community templates.
                </p>
              </div>
            )}

            {/* Quick Links Card */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-6 backdrop-blur-xl shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Quick Shortcuts
              </h4>
              <div className="space-y-2 text-xs">
                <Link
                  href="/dashboard/add-prompt"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted hover:border-primary/40 transition-all group"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Submit a New Prompt Template
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/dashboard/savedpromts"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted hover:border-primary/40 transition-all group"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    View Saved Prompts Library
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE */}
      {activeTab === "edit" && (
        <div className="rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-6 text-xs max-w-2xl">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-base font-bold text-foreground">Edit Profile Information</h3>
              <p className="text-xs text-muted-foreground">
                Update your public name, avatar photo, bio description, and AI interests.
              </p>
            </div>

            {/* Photo URL Input */}
            <div className="space-y-2">
              <label className="font-bold text-foreground block">Profile Photo URL</label>
              <div className="flex items-center gap-4">
                <img
                  src={photoURL}
                  alt={name}
                  className="h-12 w-12 rounded-xl object-cover border border-border"
                />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Preferred AI Tool */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">Preferred Primary AI Tool</label>
              <select
                value={primaryAiTool}
                onChange={(e) => setPrimaryAiTool(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
              >
                <option value="ChatGPT (GPT-4o)">ChatGPT (GPT-4o)</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="Midjourney v6">Midjourney v6</option>
                <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                <option value="DALL-E 3">DALL-E 3</option>
              </select>
            </div>

            {/* Bio Input */}
            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">Bio / Summary</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
              />
            </div>

            {/* Interests Tag Manager */}
            <div className="space-y-2">
              <label className="font-bold text-foreground block">AI Focus Areas & Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterestInput}
                  onChange={(e) => setNewInterestInput(e.target.value)}
                  placeholder="e.g. Sales, Python Boilerplate..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {interests.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(item)}
                      className="hover:text-destructive text-muted-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="px-4 py-2.5 rounded-xl border border-border bg-background font-semibold text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTION */}
      {activeTab === "subscription" && (
        <div className="rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xs space-y-6">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-foreground">Subscription & Membership Plan</h3>
            <p className="text-xs text-muted-foreground">
              Manage your tier access, limits, and unlock private prompt architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free Tier Card */}
            <div
              className={`rounded-2xl border p-6 space-y-4 ${
                !isPremiumUser
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/30"
                  : "border-border/60 bg-muted/20 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-sm">Free Community Tier</span>
                {!isPremiumUser && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
                    Current Active Plan
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-foreground">$0</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>Submit up to 3 AI Prompts</span>
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  <span>Access all public community prompts</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span>Cannot view locked Private/VIP templates</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan Card */}
            <div
              className={`rounded-2xl border p-6 space-y-4 ${
                isPremiumUser
                  ? "border-amber-500/40 bg-amber-500/10 ring-1 ring-amber-500/30"
                  : "border-amber-500/30 bg-linear-to-br from-amber-500/15 via-card to-card shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">
                  <Crown className="h-4 w-4" />
                  <span>PromptMatrix Pro</span>
                </div>
                {isPremiumUser && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Current Active Plan
                  </span>
                )}
              </div>
              <div>
                <span className="text-2xl font-extrabold text-foreground">$5</span>
                <span className="text-xs text-muted-foreground"> / One-time Lifetime</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Unlimited Prompt Submissions (No caps)</span>
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Unlock all locked Private VIP AI Prompts</span>
                </li>
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                  <span>Verified Pro Member badge across marketplace</span>
                </li>
              </ul>

              {!isPremiumUser && (
                <div className="pt-2">
                  <Link
                    href="/payment"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    <span>Upgrade for $5 via Stripe</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & NOTIFICATIONS */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Password Card */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xs space-y-5">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>Change Password</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Ensure your account is using a strong, unique password.
              </p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary font-bold text-xs text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-2xl border border-border/80 bg-card/80 p-6 sm:p-8 backdrop-blur-xl shadow-xs space-y-5">
            <div className="border-b border-border/60 pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span>Notification Preferences</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Control which email updates you receive from PromptMatrix.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                <div>
                  <p className="font-bold text-foreground">Prompt Moderation Status</p>
                  <p className="text-[11px] text-muted-foreground">
                    Get notified when submitted prompts are approved or reviewed.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.promptApproved}
                  onChange={(e) =>
                    setNotifications({ ...notifications, promptApproved: e.target.checked })
                  }
                  className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                <div>
                  <p className="font-bold text-foreground">New Prompt Reviews</p>
                  <p className="text-[11px] text-muted-foreground">
                    Notify me when community members leave feedback on my prompts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.newReviews}
                  onChange={(e) =>
                    setNotifications({ ...notifications, newReviews: e.target.checked })
                  }
                  className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                <div>
                  <p className="font-bold text-foreground">Weekly Trending Digest</p>
                  <p className="text-[11px] text-muted-foreground">
                    Weekly highlights of top-copied ChatGPT and Midjourney prompts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyDigest}
                  onChange={(e) =>
                    setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                  }
                  className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Toast Notification */}
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
