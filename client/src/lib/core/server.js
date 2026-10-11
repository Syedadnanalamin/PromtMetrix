export const serverGet = async (url) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`);

    return res.json();
}




export const serverPost = async (url, data) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();
}




export const serverDelete = async (url) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });

    return res.json();
}

export const serverPut = async (url, data) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api${url}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();
}

