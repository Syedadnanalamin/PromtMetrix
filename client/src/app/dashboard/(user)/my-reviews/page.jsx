import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/authentication/server.session";
import MyReviews from "./MyReviews";

export const metadata = {
  title: "My Reviews | PromptMatrix Dashboard",
  description: "View, update, and manage all your submitted AI prompt ratings and reviews.",
};

const MyReviewsPage = async () => {
  const session = await getServerSession();

  // Redirect unauthenticated visitors to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <MyReviews />
    </div>
  );
};

export default MyReviewsPage;
