'use server'
import { serverPost } from "@/lib/core/server"
import { revalidatePath } from "next/cache";

export const addNewPromt = async (data) => {

    const result = await serverPost("/allpromts/add-prompt", data)
    revalidatePath("/allpromts");
    return result;
}