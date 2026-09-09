import { serverPost } from "@/lib/core/server"

export const saveCopycount = async (data) => {

    const res = await serverPost("/allpromts/copycount", data)
    return res;

}