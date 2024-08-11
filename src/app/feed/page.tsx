import CustomFeed from "@/components/Feed/CustomFeed";
import { DynamicIslandDemo } from "@/components/DynamicIslandDemo";
import GeneralFeed from "@/components/Feed/GeneralFeed";
import { HomeFeedTabs } from "@/components/ui/HomeFeedTabs";
import Image from "next/image";
import JobResults from "@/components/Jobboard/JobResults";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import RightAside from "@/components/RightAside/RightAside";
import { Separator } from "@/components/ui/separator";
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

const DummyContent = () => {
    return (
        <Image
            src="/linear.webp"
            alt="dummy image"
            width="1000"
            height="1000"
            className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
        />
    );
};


const page = async () => {
    // TODO: {/* General feed ---> Logged Out
    // TODO: Custom Feed -----> Logged In */}

    const session = await getAuthSession();

    if (session?.user.role === "ADMIN") {
        // redirect(authOptions?.pages?.signIn || "/");
        // redirect("/");
    }

    const communities = await db.community.findMany({
        take: 7,
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
                <div className="w-full ">
                    <div className="w-full overflow-hidden relative h-full rounded-2xl p-4 text-xl md:text-4xl font-bold mb-4 text-white border  border-purple-700 ">
                        <p>Your Feed</p>
                    </div>
                    <Separator className="mb-4 bg-gray-600" />
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
            title: "Services",
            value: "services",
            content: (
                <div className="w-full ">
                    <div className="w-full overflow-hidden relative h-full rounded-2xl p-4 text-xl md:text-4xl font-bold mb-4 text-white border  border-purple-700 ">
                        <p>Services</p>
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
        <div className=" pt-8 h-full w-full mx-auto">


            {/* <h1 className="font-bold text-3xl md:text-4xl  " style={{
                background: "linear-gradient(135deg, #542daf, #ff9100)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}>
                Your feed
            </h1> */}



            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 py-6 space-y-8 space-x-24 w-full ">
                {/* Display either custom feed or general feed */}
                {/* <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex max-w-5xl mx-auto w-full  items-start justify-start my-40"> */}
                {/* <div className="py-0 perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start ">
                    <HomeFeedTabs tabs={tabs} />
                </div> */}
                {/* </div> */}


                <div className="w-full ">

                    <HomeFeedTabs tabs={tabs} />

                </div>

                <RightAside communities={communities} newJobPostings={newJobPostings} />

            </div>
        </div>
    );
};

export default page;
