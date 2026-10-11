import { serverGet } from "@/lib/core/server";

export const getAdminDashboardAnalytics = async () => {
    const res = await serverGet("/dashboard/admin/analytics");
    return res;
};
