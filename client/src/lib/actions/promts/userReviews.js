import { serverGet, serverPut, serverDelete } from "@/lib/core/server";

export const getUserReviews = async (userId) => {
    try {
        if (!userId) return [];
        const result = await serverGet(`/allpromts/reviews/byuser/${userId}`);
        return Array.isArray(result) ? result : [];
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        return [];
    }
};

export const updateUserReview = async (reviewId, data) => {
    try {
        const result = await serverPut(`/allpromts/reviews/${reviewId}`, data);
        return result;
    } catch (error) {
        console.error("Error updating review:", error);
        return { success: false, message: error.message };
    }
};

export const deleteUserReview = async (reviewId) => {
    try {
        const result = await serverDelete(`/allpromts/reviews/${reviewId}`);
        return result;
    } catch (error) {
        console.error("Error deleting review:", error);
        return { success: false, message: error.message };
    }
};
