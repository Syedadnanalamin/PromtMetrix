import { serverGet } from "@/lib/core/server";

export const getAllPayments = async () => {
    const res = await serverGet("/dashboard/subscribers");
    return res;
};
