import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import PostFeed from "../Posts/PostFeed";
import { db } from "@/lib/db";

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
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

export default GeneralFeed;
