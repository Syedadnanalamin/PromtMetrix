"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Shield,
  Crown,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { updateUserRole, deleteUser } from "@/lib/actions/admin/users";

export default function AllUsers({ session, initialUsers = [] }) {
  const currentAdminId = session?.user?.id || session?.user?._id;

  const [usersList, setUsersList] = useState(Array.isArray(initialUsers) ? initialUsers : []);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Summary counts
  const totalUsers = usersList.length;
  const regularUsersCount = usersList.filter((u) => (u.userType || "user") === "user").length;
  const creatorsCount = usersList.filter((u) => u.userType === "creator").length;
  const adminsCount = usersList.filter((u) => u.userType === "admin").length;
  const proCount = usersList.filter((u) => u.plan === "pro" || u.isPremium).length;

  // Filtered users
  const filteredUsers = useMemo(() => {
    let result = [...usersList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => (u.userType || "user") === roleFilter);
    }

    if (planFilter !== "all") {
      if (planFilter === "pro") {
        result = result.filter((u) => u.plan === "pro" || u.isPremium);
      } else if (planFilter === "free") {
        result = result.filter((u) => u.plan !== "pro" && !u.isPremium);
      }
    }

    return result;
  }, [usersList, searchQuery, roleFilter, planFilter]);

  // Handle Role Change
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res?.success !== false) {
        setUsersList((prev) =>
          prev.map((u) => ((u._id || u.id) === userId ? { ...u, userType: newRole } : u))
        );
        showToast(`User role updated to ${newRole}`);
      } else {
        showToast("Failed to update role", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating user role", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    try {
      const res = await deleteUser(userId);
      if (res?.success !== false) {
        setUsersList((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        showToast("User deleted successfully");
      } else {
        showToast("Failed to delete user", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting user", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-xl text-xs font-semibold ${
              toastMessage.type === "error"
                ? "bg-destructive/90 text-destructive-foreground border-destructive/50"
                : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
            }`}
          >
            {toastMessage.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 backdrop-blur-xl shadow-xs">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" />
            <span>User Management & RBAC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            All Platform <span className="ai-gradient-text">Users</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            View all registered users, manage permissions (User / Creator / Admin), and monitor subscription tiers.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Total:</span>
            <span className="font-extrabold text-foreground">{totalUsers}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Regular Users:</span>
            <span className="font-bold text-foreground">{regularUsersCount}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Creators:</span>
            <span className="font-bold text-primary">{creatorsCount}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-medium">Admins:</span>
            <span className="font-bold text-emerald-400">{adminsCount}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1.5">
            <Crown className="h-3 w-3 text-amber-400" />
            <span className="text-muted-foreground font-medium">Pro Members:</span>
            <span className="font-bold text-amber-400">{proCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/80 bg-card/80 py-2.5 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none backdrop-blur-md"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-card/80 py-2.5 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="creator">Creators</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="rounded-xl border border-border/80 bg-card/80 py-2.5 px-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Plans</option>
            <option value="pro">Pro ($5)</option>
            <option value="free">Free Tier</option>
          </select>
        </div>
      </div>

      {/* 3. Users Table Card */}
      <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-muted/50 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No users found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery || roleFilter !== "all" || planFilter !== "all"
                ? "No accounts match your search filters."
                : "No registered users in the database yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Plan / Tier</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUsers.map((u) => {
                  const uId = u._id?.toString() || u.id;
                  const isCurrentAdmin = uId === currentAdminId;
                  const isPro = u.plan === "pro" || u.isPremium;
                  const userInitial = (u.name || u.email || "U").charAt(0).toUpperCase();

                  const createdFormatted = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <tr key={uId} className="hover:bg-muted/20 transition-colors">
                      {/* Name + Email + Avatar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name || "User"}
                              className="h-9 w-9 rounded-full object-cover border border-border/60 shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary/30 to-violet-500/30 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0">
                              {userInitial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate flex items-center gap-1.5">
                              {u.name || "Unnamed User"}
                              {isCurrentAdmin && (
                                <span className="text-[10px] text-primary font-normal bg-primary/10 px-1.5 py-0.2 rounded border border-primary/20">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={u.userType || "user"}
                          disabled={updatingId === uId || isCurrentAdmin}
                          onChange={(e) => handleRoleChange(uId, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none transition-colors cursor-pointer ${
                            (u.userType || "user") === "admin"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : u.userType === "creator"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-muted/50 text-foreground border-border"
                          }`}
                        >
                          <option value="user" className="bg-card text-foreground">User</option>
                          <option value="creator" className="bg-card text-foreground">Creator</option>
                          <option value="admin" className="bg-card text-foreground">Admin</option>
                        </select>
                      </td>

                      {/* Plan / Tier */}
                      <td className="py-4 px-4">
                        {isPro ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                            <Crown className="h-3 w-3" /> Pro ($5)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/40 border border-border px-2.5 py-0.5 rounded-full">
                            Free Tier
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 text-muted-foreground">{createdFormatted}</td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        {deleteConfirmId === uId ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-[11px] text-destructive font-semibold">Delete?</span>
                            <button
                              onClick={() => handleDeleteUser(uId)}
                              className="px-2 py-1 rounded-md text-[10px] font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded-md text-[10px] font-semibold border border-border text-foreground hover:bg-accent transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(uId)}
                            disabled={isCurrentAdmin}
                            title={isCurrentAdmin ? "Cannot delete own admin account" : "Delete user"}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isCurrentAdmin
                                ? "opacity-30 cursor-not-allowed border-border/40 text-muted-foreground"
                                : "border-border/60 text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10 cursor-pointer"
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
