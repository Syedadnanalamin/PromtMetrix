import { serverGet } from "@/lib/core/server";

export const getTopCreators = async () => {
  try {
    const data = await serverGet("/allpromts/creators/top");
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("Failed to fetch top creators:", error);
    return [];
  }
};
