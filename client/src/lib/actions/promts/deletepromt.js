'use server';

import { serverDelete } from "@/lib/core/server";
import { revalidatePath } from "next/cache";

export const deletePromt = async (id) => {
    try {
        const result = await serverDelete(`/allpromts/${id}`);
        revalidatePath("/dashboard/my-prompts");
        revalidatePath("/allpromts");
        return result;
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return { success: false, message: error.message };
    }
};
