import { serverPost, serverGet } from "@/lib/core/server";

export const postReportPromt = async (data) => {
    const res = await serverPost("/dashboard/reports", data);
    return res;
};

export const checkReportedStatus = async (userId, promptId) => {
    try {
        const res = await serverGet(`/dashboard/reports/check?userId=${userId}&promptId=${promptId}`);
        return res?.reported || false;
    } catch (e) {
        return false;
    }
};
