// wrapper component around all the page component

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { ReactNode } from "react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { Milestone } from "lucide-react";
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
    <div className="sm:container max-w-9xl mx-auto h-full md:pt-12">
      <div>
        {/* TODO: BTN TO TAKE BACK TO FEED */}

        <ToFeedButton />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>

          {/* info sidebar */}

          <div className="overflow-hidden hidden md:block h-fit rounded-lg border border-gray-600 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3 text-lg text-zinc-400">
                About <span className="px-1 text-indigo-600">•</span>c/
                {community?.name}
              </p>
              <div className="flex b-0">
                {" "}
                <Milestone className="h-5 w-5 text-indigo-500" />
                <p className="text-sm ml-4 text-gray-400">
                  {communityDescription}
                </p>
              </div>
              <hr className="bg-zinc-100 h-[2px]" />
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 ">
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
                    variant: "subtle",
                    className: "w-full mb-6 border border-indigo-600",
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
