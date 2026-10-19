import { protectedGet, serverPut, serverDelete } from "@/lib/core/server";

export const getAllUsers = async () => {
    const res = await protectedGet("/dashboard/users");
    return res;
};

export const updateUserRole = async (userId, userType) => {
    const res = await serverPut(`/dashboard/users/${userId}/role`, { userType });
    return res;
};

export const deleteUser = async (userId) => {
    const res = await serverDelete(`/dashboard/users/${userId}`);
    return res;
};
