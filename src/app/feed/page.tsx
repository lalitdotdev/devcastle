import CommunityAvatar from "@/components/Avatars/CommunityAvatar";
import CustomFeed from "@/components/Feed/CustomFeed";
import GeneralFeed from "@/components/Feed/GeneralFeed";
import { HomeFeedTabs } from "@/components/ui/HomeFeedTabs";
import JobResults from "@/components/Jobboard/JobResults";
import Link from "next/link";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import ProductHuntFeedImporter from "@/components/Feed/ProductHuntFeedImport";
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

const Page = async () => {
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

    const tabs = [
        {
            title: "Discussions",
            value: "discussions",

            content: (
                <div className="w-full overflow-y-auto h-full">
                    <div className="w-full flex  items-center gap-4 md:rounded-lg tracking-tight z-0  rounded-lg border border-gray-800 p-4 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900 transition-colors duration-300  backdrop-blur-3xl">
                        <CommunityAvatar seed={"xyz"} classNames="w-12 h-12 rounded-xl p-2" />
                        <h1 className="font-normal text-2xl md:text-3xl text-gray-400">
                            Discussion feed
                        </h1>
                    </div>
                    <Separator className="my-4 bg-gray-700" />
                    {/* @ts-expect-error server component */}
                    {session ? <CustomFeed /> : <GeneralFeed />}
                </div>
            )
        },
        {
            title: "Opportunities",
            value: "opportunities",
            href: "/opportunities",
            content: (
                <div className="w-full border-b border-zinc-700">
                    <div className="w-full flex  items-center gap-4 md:rounded-lg tracking-tight z-0  rounded-lg border border-gray-800 p-4 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900 transition-colors duration-300  backdrop-blur-3xl">
                        <CommunityAvatar seed={"opportunities"} classNames="w-12 h-12 rounded-xl p-2" />
                        <h1 className="font-normal text-2xl md:text-3xl text-gray-400">
                            Seek latest opportunities
                        </h1>
                    </div>
                    <Separator className="my-4 bg-gray-700" />
                    <JobResults jobs={jobs} />
                </div>
            ),
        },
        {
            title: "Showcases",
            value: "showcases",
            content: (
                <main className="w-full">
                    <ProductHuntFeedImporter />
                </main>
            ),
        }
    ];

    return (
        <main className="mx-auto pt-8 max-w-[1440px]  sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-x-6 gap-y-4 sm:px-2">
                {/* Main content - 5 columns on large screens */}
                <div className="lg:col-span-5">
                    <HomeFeedTabs tabs={tabs} />
                </div>

                {/* Right sidebar - 3 columns on large screens */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-20 space-y-4 mb-8" >
                        {/* @ts-expect-error Server Component */}
                        <RightAside />

                        {/* Additional widgets can be added here */}
                        <div className="rounded-lg border border-gray-800 p-4 bg-zinc-900/50">
                            <h2 className="font-semibold text-xl mb-4 text-gray-200">Create your castle</h2>
                            <p className="text-gray-400 text-sm mb-4">
                                Your castle, your rules. Create a community for your favorite topics.
                            </p>
                            <Link href={"/cb/create"} className="w-full py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition">
                                Create Castle
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
