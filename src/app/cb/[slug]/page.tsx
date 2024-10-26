import CommunityAvatar from "@/components/Avatars/CommunityAvatar";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { Metadata } from "next";
import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/Posts/PostFeed";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        slug: string;
    };
}

export function generateMetadata({ params: { slug } }: PageProps): Metadata {
    return {
        title: `c/${slug}`,
        description: `Community ${slug}`,
    };
}
const page = async ({ params }: PageProps) => {
    const { slug } = params;
    const session = await getAuthSession();

    const community = await db.community.findFirst({
        where: {
            name: slug,
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    community: true,
                    bookmarks: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: INFINITE_SCROLLING_PAGINATION_RESULTS, // INFINITE_SCROLLING_PAGINATION_RESULTS,
            },
        },
    });

    if (!community) {
        return notFound();
    }

    return (
        <main className="container mx-auto  items-center gap-2 ">

            <div className=" flex items-center gap-2 rounded-xl border border-gray-800  bg-zinc-900/50 p-4  md:pl-8 my-4">
                <CommunityAvatar seed={community.name} classNames="w-12 h-12 rounded-xl p-2 " />
                <h1 className="font-normal text-3xl md:text-4xl  text-gray-400">
                    c/{community.name}
                </h1>
            </div>



            <MiniCreatePost session={session} />


            <PostFeed initialPosts={community.posts} communityName={community.name} />
        </main>
    );
};

export default page;
