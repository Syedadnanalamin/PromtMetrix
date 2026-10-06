import { serverGet } from "@/lib/core/server";

const getPromtbyuser = async (id) => {

    const result = await serverGet(`/allpromts/byuser/${id}`);
    return result;
}

export default getPromtbyuser;