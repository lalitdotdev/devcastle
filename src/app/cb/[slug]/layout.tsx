import { Calendar, Crown, MessageSquare, Plus, Users } from "lucide-react";

import Link from "next/link";
import { ReactNode } from "react";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import ToFeedButton from "@/components/ToFeedButton";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const Layout = async ({
    children,
    params: { slug },
}: {
    children: ReactNode;
    params: { slug: string };
}) => {
    const session = await getAuthSession();
    const community = await db.community.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    });

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
            where: {
                community: {
                    name: slug,
                },
                user: {
                    id: session.user.id,
                },
            },
        });

    const isSubscribed = !!subscription;

    if (!community) return notFound();

    const memberCount = await db.subscription.count({
        where: {
            community: {
                name: slug,
            },
        },
    });

    return (
        <div className="min-h-screen  px-4 py-6">
            <div className="mx-auto max-w-7xl">
                <ToFeedButton />

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Main Content */}
                    <div className="col-span-2 space-y-6">
                        {children}
                    </div>

                    {/* Sidebar */}
                    <div className="order-first space-y-4 md:order-last">
                        {/* Community Info Card */}
                        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
                            {/* Header */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10" />
                                <div className="relative space-y-2 p-6">
                                    <h2 className="flex items-center gap-2 text-xl font-bold text-zinc-100">
                                        {community.name}
                                        {community.creatorId === session?.user?.id && (
                                            <Crown className="h-5 w-5 text-yellow-500" />
                                        )}
                                    </h2>
                                    <p className="text-sm text-zinc-400">{community.description}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 divide-x divide-zinc-800 border-y border-zinc-800 bg-zinc-900/30">
                                <div className="p-4 text-center">
                                    <Users className="mx-auto mb-1 h-5 w-5 text-zinc-500" />
                                    <p className="text-lg font-semibold text-zinc-100">{memberCount}</p>
                                    <p className="text-xs text-zinc-500">Members</p>
                                </div>
                                <div className="p-4 text-center">
                                    <MessageSquare className="mx-auto mb-1 h-5 w-5 text-zinc-500" />
                                    <p className="text-lg font-semibold text-zinc-100">{community.posts.length}</p>
                                    <p className="text-xs text-zinc-500">Posts</p>
                                </div>
                                <div className="p-4 text-center">
                                    <Calendar className="mx-auto mb-1 h-5 w-5 text-zinc-500" />
                                    <p className="text-xs font-medium text-zinc-100">
                                        {format(community.createdAt, "MMM yyyy")}
                                    </p>
                                    <p className="text-xs text-zinc-500">Created</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3 p-6">
                                {community.creatorId !== session?.user?.id && (
                                    <SubscribeLeaveToggle
                                        isSubscribed={isSubscribed}
                                        communityId={community.id}
                                        communityName={community.name}
                                    />
                                )}

                                {session?.user && (
                                    <Link
                                        className={buttonVariants({
                                            variant: 'outline',
                                            className: 'group relative w-full overflow-hidden border-zinc-700 bg-transparent',
                                        })}
                                        href={`/cb/${slug}/publish`}
                                    >
                                        <div className="absolute inset-0 transform bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 transition-transform duration-300 group-hover:translate-x-full" />
                                        <span className="relative flex items-center justify-center gap-2 text-white">
                                            <Plus className="h-4 w-4" />
                                            Create Post
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
