"use server"
import { headers } from "next/headers";
import { auth } from "../auth";

export const getServerSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return session;
};

export const getUserToken = async () => {
    const session = await getServerSession();
    const token = session?.session?.token || null;
    return token;
};

