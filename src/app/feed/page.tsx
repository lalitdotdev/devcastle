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
import { MessageSquare, Briefcase, Rocket, Plus, Users } from "lucide-react";

export function generateMetadata(): Metadata {
    return {
        title: "DevCastle — Your feed",
        description: "All the latest updates from your castles.",
    };
}

const Page = async () => {
    const session = await getAuthSession();

    const where: Prisma.JobWhereInput = { AND: [{ approved: true }] };
    const jobs = await db.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    const tabs = [
        {
            title: "Discussions",
            value: "discussions",
            icon: <MessageSquare className="h-3.5 w-3.5" />,
            content: (
                <div className="w-full">
                    {/* Section header */}
                    <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 p-4 bg-zinc-900/40 backdrop-blur-sm mb-6 group hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-xl bg-violet-500/20 blur-md group-hover:bg-violet-500/30 transition-all duration-300" />
                            <CommunityAvatar seed={"xyz"} classNames="relative w-11 h-11 rounded-xl p-2 bg-zinc-900 border border-zinc-800" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg text-zinc-100 leading-tight">
                                Discussion Feed
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5">Latest posts from your communities</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-500/20 bg-violet-500/10">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                            <span className="text-[10px] font-medium text-violet-400">Live</span>
                        </div>
                    </div>

                    <Separator className="my-5 bg-zinc-800/60" />

                    {/* @ts-expect-error server component */}
                    {session ? <CustomFeed /> : <GeneralFeed />}
                </div>
            ),
        },
        {
            title: "Opportunities",
            value: "opportunities",
            href: "/opportunities",
            icon: <Briefcase className="h-3.5 w-3.5" />,
            content: (
                <div className="w-full">
                    <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 p-4 bg-zinc-900/40 backdrop-blur-sm mb-6 group hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-md group-hover:bg-amber-500/30 transition-all duration-300" />
                            <CommunityAvatar seed={"opportunities"} classNames="relative w-11 h-11 rounded-xl p-2 bg-zinc-900 border border-zinc-800" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg text-zinc-100 leading-tight">
                                Opportunities
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5">Curated jobs and gigs for developers</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10">
                            <span className="text-[10px] font-medium text-amber-400">{jobs.length} open</span>
                        </div>
                    </div>

                    <Separator className="my-5 bg-zinc-800/60" />
                    <JobResults jobs={jobs} />
                </div>
            ),
        },
        {
            title: "Showcases",
            value: "showcases",
            icon: <Rocket className="h-3.5 w-3.5" />,
            content: (
                <div className="w-full">
                    <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 p-4 bg-zinc-900/40 backdrop-blur-sm mb-6 group hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 rounded-xl bg-rose-500/20 blur-md group-hover:bg-rose-500/30 transition-all duration-300" />
                            <CommunityAvatar seed={"showcases"} classNames="relative w-11 h-11 rounded-xl p-2 bg-zinc-900 border border-zinc-800" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg text-zinc-100 leading-tight">
                                Showcases
                            </h1>
                            <p className="text-xs text-zinc-500 mt-0.5">Products shipped by the community</p>
                        </div>
                    </div>

                    <Separator className="my-5 bg-zinc-800/60" />
                    <main className="w-full">
                        <ProductHuntFeedImporter />
                    </main>
                </div>
            ),
        },
    ];

    return (
        <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full bg-violet-600/4 blur-[140px]" />
                <div className="absolute top-1/2 -right-60 h-[500px] w-[500px] rounded-full bg-cyan-600/4 blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/4 blur-[100px]" />
            </div>

            <div className="relative mx-auto pt-10 max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-x-8 gap-y-6">
                    {/* Main content */}
                    <div className="lg:col-span-5">
                        <HomeFeedTabs tabs={tabs} />
                    </div>

                    {/* Right sidebar */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-20 space-y-4 mb-8">
                            {/* @ts-expect-error Server Component */}
                            <RightAside />

                            {/* Create Castle CTA */}
                            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/60 p-5 bg-zinc-900/40 backdrop-blur-sm group hover:border-zinc-700/80 transition-all duration-300">
                                {/* Subtle background glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative flex items-start gap-3 mb-4">
                                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shrink-0">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-sm text-zinc-100">Create your castle</h2>
                                        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                                            Your castle, your rules. Build a community around any topic.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/cb/create"
                                    className="relative flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/30"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Castle
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;