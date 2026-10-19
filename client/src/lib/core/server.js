import { getUserToken } from "../authentication/server.session";


const authHeader = async () => {
    const token = await getUserToken();
    if (!token) return {};
    return {
        Authorization: `Bearer ${token}`,
    };
}

export const serverGet = async (url) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`);

    return res.json();
}


export const protectedGet = async (url) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...await authHeader()
        },
    });

    return res.json();
}



export const serverPost = async (url, data) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...await authHeader()
        },
        body: JSON.stringify(data)
    });

    return res.json();
}




export const serverDelete = async (url) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...await authHeader()
        },
    });

    return res.json();
}

export const serverPut = async (url, data) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...await authHeader()
        },
        body: JSON.stringify(data)
    });

    return res.json();
}

