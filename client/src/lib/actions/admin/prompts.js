import { serverGet, serverPut, serverDelete } from "@/lib/core/server";

export const getAllPrompts = async () => {
    const res = await serverGet("/allpromts");
    return res;
};

export const updatePromptStatus = async (promptId, status) => {
    const res = await serverPut(`/allpromts/${promptId}/status`, { status });
    return res;
};

export const deletePrompt = async (promptId) => {
    const res = await serverDelete(`/allpromts/${promptId}`);
    return res;
};
