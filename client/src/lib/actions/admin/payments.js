import { protectedGet } from "@/lib/core/server";

export const getAllPayments = async () => {
    const res = await protectedGet("/dashboard/subscribers");
    return res;
};
