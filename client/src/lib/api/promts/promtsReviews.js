import { serverPost } from "@/lib/core/server"


export const promtsReviews = async (data) => {
    const res = await serverPost("/allpromts/review", data)
    return res;

}