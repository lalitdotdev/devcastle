import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/Posts/PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Metadata } from "next";
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
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14 text-gray-400">
        c/{community.name}
      </h1>
      <MiniCreatePost session={session} />
      {/* TODO: Community posts in user feed */}

      <PostFeed initialPosts={community.posts} communityName={community.name} />
    </>
  );
};

export default page;
