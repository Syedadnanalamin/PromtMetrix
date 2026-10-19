import React from "react";
import { getSinglePromt } from "@/lib/actions/promts/getsinglepromts";
import PromptDetails from "@/components/Allpromts/PromptDetails";
import { getServerSession } from "@/lib/authentication/server.session";
import { checkReportedStatus } from "@/lib/actions/promts/postReportPromt";
import { redirect } from "next/navigation";




const Page = async ({ params }) => {


    const { id } = await params;
    const details = await getSinglePromt(id);
    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    }
    const userId = session?.user?.id || session?.user?._id;
    const isReported = userId && id ? await checkReportedStatus(userId, id) : false;

    return <PromptDetails details={details} session={session} promtid={id} initialReported={isReported} />;
};

export default Page;