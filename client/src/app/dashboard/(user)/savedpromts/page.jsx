import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/authentication/server.session";
import SavedPromts from "./SavedPromts";

export const metadata = {
  title: "Saved Prompts | PromptMatrix Dashboard",
  description: "Browse, filter, copy, and manage your personal bookmarked AI prompts collection.",
};

const SavedPromtsPage = async () => {
  const session = await getServerSession();

  // Redirect unauthenticated visitors to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <SavedPromts session={session} />
    </div>
  );
};

export default SavedPromtsPage;