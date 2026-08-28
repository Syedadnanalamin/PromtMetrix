import { serverGet } from "@/lib/core/server";

export const getUserDashboardAnalytics = async (userId) => {

    const res = await serverGet(`/dashboard/user/analytics/${userId}`);
    return res;

}


