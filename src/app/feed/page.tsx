import CustomFeed from "@/components/Feed/CustomFeed";
import GeneralFeed from "@/components/Feed/GeneralFeed";
import { Metadata } from "next";
import RightAside from "@/components/RightAside/RightAside";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export function generateMetadata({

}: {
    searchParams: Record<string, string>;
}): Metadata {
    return {
        title: "DevCastle — Your feed",
        description: "All the latest updates from your castles.",
    };
}
const page = async () => {
    // TODO: {/* General feed ---> Logged Out
    // TODO: Custom Feed -----> Logged In */}

    const session = await getAuthSession();

    if (session?.user.role === "ADMIN") {
        // redirect(authOptions?.pages?.signIn || "/");
        // redirect("/");
    }

    const communities = await db.community.findMany({
        take: 8,
        orderBy: {
            subscribers: {
                _count: "desc",
            },
        },
    })

    // Get 5 new job postings based on the createdAt date and display them in the right aside component

    const newJobPostings = await db.job.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
    });



    //   console.log("session", session);

    // if (!session?.user) {
    //   // redirect(authOptions?.pages?.signIn || "/");
    //   redirect("/");
    // }




    // check if user is subscribed to community or not if user is logged in then show leave community button and if not then show join community button


    // return (
    //     <pre className="mt-16 text-white">
    //         {JSON.stringify(communities, null, 2)}
    //     </pre>
    // );

    return (
        <div className="mx-auto max-w-5xl pt-8">
            <h1 className="font-bold text-3xl md:text-4xl text-[#6366F1] ">
                Your feed
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                {/* Display either custom feed or general feed */}

                {/* @ts-expect-error server component */}
                {session ? <CustomFeed /> : <GeneralFeed />}
                <RightAside communities={communities} newJobPostings={newJobPostings} />


            </div>
        </div>
    );
};

export default page;
