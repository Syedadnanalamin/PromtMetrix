import { serverPost } from "@/lib/core/server";

export const savePromts = async (data) => {
    return await serverPost("/dashboard/savedpromts", data);
};