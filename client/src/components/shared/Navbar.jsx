"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Compass,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  Search,
  Zap,
  Bookmark,
  ChevronDown,
  User as UserIcon,
  Settings,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getClientSession } from "@/lib/authentication/client-session";
import { authClient } from "@/lib/auth-client";
import NavLink from "@/components/Navlink/Navlink";

// Navigation items array
const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "All Prompts", href: "/allpromts", icon: Compass },

];

export default function Navbar({ session: initialSession }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const clientSession = getClientSession();
  const session = clientSession?.user ? clientSession : initialSession;
  const isLoggedIn = !!session?.user;
  const user = session?.user;


  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Logout
  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-violet-400 p-0.5 shadow-lg shadow-primary/25">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
              <Sparkles className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight">
              Prompt<span className="ai-gradient-text">Matrix</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase -mt-1">
              AI Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Mapped with active state via NavLink) */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.href} href={item.href}>
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Search Bar Trigger (Hardcoded UI) */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/70 cursor-pointer">
            <Search className="h-3.5 w-3.5" />
            <span>Search ChatGPT, Midjourney prompts...</span>
            <kbd className="pointer-events-none ml-2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section / Auth Actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium hover:bg-accent">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="ai-glow-button font-medium text-white border-0">
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Saved Prompts Icon */}
              <Link href="/dashboard/savedpromts">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground relative"
                  title="Saved Prompts"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </Link>

              {/* Sell / Add Prompt Button */}
              <Link href="/dashboard/add-prompt">
                <Button size="sm" className="ai-glow-button font-medium text-white border-0 gap-1.5 shadow-sm">
                  <PlusCircle className="h-4 w-4" />
                  Create Prompt
                </Button>
              </Link>

              {/* Profile Avatar Trigger & Dropdown Menu */}
              <div className="relative pl-1" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user?.name || "User Avatar"}
                      width={34}
                      height={34}
                      unoptimized
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/40 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs ring-2 ring-primary/40 shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                    </div>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${profileDropdownOpen ? "rotate-180 text-foreground" : ""
                      }`}
                  />
                </button>

                {/* Floating Dropdown Card */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 z-50">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 p-3 border-b border-border/60">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user?.name || "User Avatar"}
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/40"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm ring-2 ring-primary/40">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold truncate text-foreground">
                          {user?.name || "Anonymous Creator"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user?.email || "No email"}
                        </span>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                            {user?.role || "User"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        Dashboard
                      </Link>

                      <Link
                        href="/dashboard/savedpromts"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <Bookmark className="h-4 w-4 text-primary" />
                        Saved Prompts
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Profile Settings
                      </Link>
                    </div>

                    {/* Divider & Logout Button */}
                    <div className="border-t border-border/60 pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-2 pb-6 sm:hidden animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2 py-2">
            {/* User header for mobile if logged in */}
            {isLoggedIn && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/40 border border-border/60 mb-2">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user?.name || "User Avatar"}
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate">{user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                </div>
              </div>
            )}

            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}

            {isLoggedIn ? (
              <div className="my-2 border-t border-border pt-3 flex flex-col gap-2">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/savedpromts" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    Saved Prompts
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full justify-start text-destructive hover:bg-destructive/10 gap-2 mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="my-2 border-t border-border pt-4">
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center ai-glow-button text-white border-0">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
