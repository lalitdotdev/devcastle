import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import PostFeed from "../Posts/PostFeed";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
    const session = await getAuthSession();

    const followedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user?.id,
        },
        include: {
            community: true,
        },
    });

    const posts = await db.post.findMany({
        where: {
            community: {
                name: {
                    in: followedCommunities.map(
                        (followedCommunity) => followedCommunity.community.id
                    ),
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            community: true,
            bookmarks: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
    });

    return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
