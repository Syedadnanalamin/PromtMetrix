import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/authentication/server.session";
import Profile from "./Profile";

export const metadata = {
  title: "My Profile | PromptMatrix Dashboard",
  description: "View and manage your account information, subscription plan, and prompt contributions.",
};

const ProfilePage = async () => {
  const session = await getServerSession();

  // Redirect unauthenticated visitors to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <Profile session={session} />
    </div>
  );
};

export default ProfilePage;
