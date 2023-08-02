import CommentsSection from "@/components/CommentsSection";
import EditorOutputContent from "@/components/EditorOutputContent";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CachedPost } from "../../../../../types/redis";

interface PageProps {
  params: {
    postId: string;
  };
}

// for each post page, we want to force the following: dynamic, no-cache (fetchCache) to ensure that the page is always rendered on the client side and that the page is always dynamic (not static) and that the page is never cached (no-cache) because we want to hard reload post info each time the page is loaded (not cached)

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: PageProps) => {
  // get post info from redis cache (cached post info is stored in redis cache as a hash) and then render the page with the post info from redis cache
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`,
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;
  // if post info is not in redis cache, then fetch post info from prisma db and then render the page with the post info from prisma db (and then store the post info in redis cache)

  if (!cachedPost) {
    post = await db.post.findUnique({
      where: { id: params.postId },
      include: { votes: true, author: true },
    });
  }

  if (!post && !cachedPost) {
    return notFound();
  }
  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between ">
        {/* return postVoteShell while getData is being executed  */}
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component*/}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>
        {/* rendering actual post content */}
        <div className="sm:w-0 w-full flex-1  p-4 rounded-sm bg-[#21242d]">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by{" "}
            <span className="text-blue-500">
              u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            </span>
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-zinc-300">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutputContent content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-blue-500 align-center" />
            }
          >
            {/* @ts-expect-error server component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20 ">
      {/* upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* score */}
      <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="h-3 w-3 animate-spin" />
      </div>

      {/* downvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default page;
