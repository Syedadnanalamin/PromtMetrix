import { serverGet } from "@/lib/core/server";

export const getAllReviews = async () => {
  try {
    const data = await serverGet("/allpromts/reviews/all");
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("Failed to fetch all reviews:", error);
    return [];
  }
};
