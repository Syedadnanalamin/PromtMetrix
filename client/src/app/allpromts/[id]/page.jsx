import React from "react";
import { getSinglePromt } from "@/lib/actions/promts/getsinglepromts";
import PromptDetails from "@/components/Allpromts/PromptDetails";
import { getServerSession } from "@/lib/authentication/server.session";

const Page = async ({ params }) => {
    const { id } = await params;
    const details = await getSinglePromt(id);
    const session = await getServerSession();

    return <PromptDetails details={details} session={session} />;
};

export default Page;