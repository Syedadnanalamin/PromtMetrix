import { serverGet, serverDelete } from "@/lib/core/server";

export const getAllReports = async () => {
    const res = await serverGet("/dashboard/reports");
    return res;
};

export const deleteReport = async (reportId) => {
    const res = await serverDelete(`/dashboard/reports/${reportId}`);
    return res;
};
