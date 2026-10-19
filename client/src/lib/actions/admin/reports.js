import { protectedGet, serverDelete, serverPost } from "@/lib/core/server";

export const getAllReports = async () => {
    const res = await protectedGet("/dashboard/reports");
    return res;
};

export const deleteReport = async (reportId) => {
    const res = await serverDelete(`/dashboard/reports/${reportId}`);
    return res;
};

export const postReportPrompt = async (data) => {
    const res = await serverPost("/dashboard/reports", data);
    return res;
};
