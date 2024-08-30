import CommunityAvatar from "@/components/Avatars/CommunityAvatar";
import CustomFeed from "@/components/Feed/CustomFeed";
import GeneralFeed from "@/components/Feed/GeneralFeed";
import { HomeFeedTabs } from "@/components/ui/HomeFeedTabs";
import JobResults from "@/components/Jobboard/JobResults";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import ToolbarExpandable from "@/components/ToolbarDynamics";
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



    const where: Prisma.JobWhereInput = {
        AND: [
            { approved: true },
        ],
    };

    const jobs = await db.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });





    // bg-[#1B1F23]
    const tabs = [
        {
            title: "Feed",
            value: "feed",
            content: (
                <div className="w-full overflow-y-auto h-full ">
                    <div className="flex items-center gap-2 bg-gradient-to-br from-zinc-800 to-transparent p-4 rounded-xl md:pl-8">
                        <CommunityAvatar seed={"xyz"} classNames="w-12 h-12 rounded-xl p-2 " />
                        <h1 className="font-normal text-3xl md:text-4xl  text-gray-400">
                            Your Feed
                        </h1>
                    </div>


                    <Separator className="my-4 bg-gray-700" />
                    {/* @ts-expect-error server component */}
                    {session ? <CustomFeed /> : <GeneralFeed />}
                </div>
            )
            // content: (
            //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
            //         <p>Product Tab</p>
            //         <DummyContent />
            //     </div>
            // ),
        },
        {
            title: "Opportunities",
            value: "opportunities",
            href: "/opportunities",
            content: (
                <div className="w-full border-b border-zinc-700">
                    <div className="w-full overflow-hidden relative h-full rounded-2xl p-4 text-xl md:text-4xl font-bold mb-4 text-white border  border-purple-700 ">
                        <p>Opportunities</p>
                    </div>
                    <Separator className="mb-4 bg-gray-600" />
                    <JobResults jobs={jobs} />
                </div>
            ),

        },

        // content: (
        //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
        //         <p>Services tab</p>
        //         <DummyContent />
        //     </div>
        // ),

        {
            title: "Showcases",
            value: "showcases",
            content: (
                <div className="w-full ">
                    <div className="w-full overflow-hidden relative h-full rounded-2xl p-4 text-xl md:text-4xl font-bold mb-4 text-white border  border-purple-700 ">
                        <p className="text-red-400">Coming Soon ...</p>
                        <p className="text-sm text-gray-500 font-normal">We are working on adding services to DevCastle. Stay tuned for updates.</p>
                    </div>
                    <Separator className="mb-4 bg-gray-600" />
                    {/* <JobResults jobs={jobs} /> */}
                </div>
            ),
        }


    ];



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
        <div className=" pt-8 h-full w-full mx-auto ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 py-6 space-x-24 w-full  md:px-10 md:pl-20 ">

                <div className="w-full ">
                    <HomeFeedTabs tabs={tabs} />
                </div>


                <div className=" top-16  justify-center md:right-32 mx-auto fixed w-1/3  ">
                    <ToolbarExpandable />

                </div>
            </div>
        </div>
    );
};

export default page;
