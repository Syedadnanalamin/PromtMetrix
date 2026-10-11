import { serverPost } from "@/lib/core/server";

export const planPurchase = async (data) => {
    try {
        const res = await serverPost("/dashboard/subscriber", data);
        return res;
    } catch (error) {
        console.error("Error in planPurchase action:", error);
        return { success: false, message: error.message };
    }
};

export default planPurchase;
