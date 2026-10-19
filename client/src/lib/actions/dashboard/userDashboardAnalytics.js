import { protectedGet } from "@/lib/core/server";

export const getUserDashboardAnalytics = async (userId) => {

    const res = await protectedGet(`/dashboard/user/analytics/${userId}`);
    return res;

}


