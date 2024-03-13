// wrapper component around all the page component

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { ReactNode } from "react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

import ToFeedButton from "@/components/ToFeedButton";


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

    // Check subscription

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

    // No of members
    const memberCount = await db.subscription.count({
        where: {
            community: {
                name: slug,
            },
        },
    });

    // Extract the community description from the fetched community object
    const communityDescription = community?.description;
    return (
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div>
                {/* TODO: BTN TO TAKE BACK TO FEED */}

                <ToFeedButton />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

                    {/* info sidebar */}

                    <div className="overflow-hidden h-fit rounded-sm border-2 border-gray-600 order-first md:order-last tracking-tight">
                        <div className="md:p-4 p-3 md:border-b-2  border-gray-600 md:rounded-lg  ">
                            <div className="flex p-1 gap-2 ">
                                <div className="font-md text-center text-lg text-zinc-400 flex">
                                    <p className=" text-indigo-500 font-semibold">
                                        {community?.name}
                                    </p>
                                </div>

                            </div>

                            <div className="flex p-1 gap-2">
                                <p className="text-sm  text-gray-400">{communityDescription}</p>
                            </div>
                        </div>
                        <dl className=" divide-y divide-gray-100 px-6 py-4 text-sm  ">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-400">
                                    <time dateTime={community?.createdAt.toDateString()}>
                                        {format(community?.createdAt, "MMMM d, yyyy")}
                                    </time>
                                </dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3 text-gray-400">
                                <dt className="text-gray-500">Members</dt>
                                <dd className="flex items-start gap-x-2">{memberCount}</dd>
                            </div>
                            <div className="flex justify-between gap-x-4 py-3 text-gray-400">
                                <dt className="text-gray-500">Posts</dt>
                                <dd className="text-gray-400">{community.posts.length}</dd>
                            </div>
                            {community.creatorId === session?.user?.id ? (
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">You created this community</dt>
                                </div>
                            ) : null}

                            {community.creatorId !== session?.user?.id ? (
                                <SubscribeLeaveToggle
                                    isSubscribed={isSubscribed}
                                    communityId={community.id}
                                    communityName={community.name}
                                />
                            ) : null}

                            {/* create Button for creating post */}

                            {/* only allow for logged in user to post in the community */}
                            {session?.user && (
                                <Link
                                    className={buttonVariants({
                                        className: 'w-full mb-6 bg-transparent hover:bg-indigo-500 text-white',
                                    })}
                                    href={`cb/${slug}/publish`}
                                >
                                    Create Post
                                </Link>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
