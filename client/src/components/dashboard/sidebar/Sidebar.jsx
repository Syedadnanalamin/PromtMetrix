'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getClientSession } from '@/lib/authentication/client-session';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Bookmark,
  MessageSquare,
  User,
  BarChart3,
  Users,
  ShieldAlert,
  CreditCard,
  Layers,
} from 'lucide-react';

const Links = {
  user: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Prompt", href: "/dashboard/add-prompt", icon: PlusCircle },
    { name: "My Prompts", href: "/dashboard/my-prompts", icon: FolderKanban },
    { name: "Saved Prompts", href: "/dashboard/savedpromts", icon: Bookmark },
    { name: "My Reviews", href: "/dashboard/my-reviews", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],

  creator: [
    { name: "Analytics Home", href: "/dashboard", icon: BarChart3 },
    { name: "Add Prompt", href: "/dashboard/add-prompt", icon: PlusCircle },
    { name: "My Prompts", href: "/dashboard/my-prompts", icon: FolderKanban },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],

  admin: [
    { name: "Analytics Overview", href: "/dashboard", icon: BarChart3 },
    { name: "All Users", href: "/dashboard/users", icon: Users },
    { name: "All Prompts", href: "/dashboard/all-prompts", icon: Layers },
    { name: "All Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Reported Prompts", href: "/dashboard/reports", icon: ShieldAlert },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ],
};

const Sidebar = () => {
  const pathname = usePathname();
  const userSession = getClientSession();

  // Get userType string ("user" | "creator" | "admin")
  const userType = userSession?.user?.userType || "user";

  // Access matching links array using bracket notation
  const sidebarLinks = Links[userType] || Links.user;

  return (
    <aside className="w-full md:w-64 shrink-0 rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur-xl shadow-xs md:sticky md:top-24 self-start">
      <div className="space-y-5">
        {/* User Role Badge Card */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-bold text-foreground truncate">
            {userSession?.user?.name || "User"}
          </p>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-primary/15 text-primary capitalize border border-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {userType} Account
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links Map */}
        <nav className="space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;