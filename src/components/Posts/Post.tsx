"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutputContent from "../EditorOutputContent";
import UserAvatar from "../UserAvatar";
import PostVoteClient from "../post-vote/PostVoteClient";

type PartialVote = Pick<Vote, "type">;
interface PostProps {
  communityName?: string;
  commentsCount: number;

  post: Post & {
    author: User;
    votes: Vote[];
  };

  votesAmt: number;
  currentVote?: PartialVote;
}

const Post: FC<PostProps> = ({
  communityName,
  post,
  commentsCount,
  votesAmt,
  currentVote,
}) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-2 rounded-xl tracking-tight bg-[#212329] ">
      <div className=" flex justify-between  md:p-6 ">
        {/* TODO: PostReactions */}
        <div className="hidden md:block ">
          <PostVoteClient
            postId={post.id}
            initialVote={currentVote?.type}
            initialVotesAmt={votesAmt}
          />
        </div>

        <div className="w-0 flex-1 relative z-20 ">
          <div className="justify-between items-center relative z-10 ">
            <div className="flex items-center gap-3 ">
              <a href={`/user/${post.author.username}`}>
                <div className="sm:m-0 shadow-lg rounded-full overflow-hidden ">
                  <UserAvatar user={post.author} />
                  {/* Long vertical line below the avatar */}
                </div>
              </a>

              <div className="leading-tight z-10">
                <div className="flex items-center ">
                  {communityName ? (
                    <>
                      <a href={`/cb/${communityName}`}>
                        <span className="underline text-indigo-400 text-sm font-semibold underline-offset-2">
                          c/{communityName}{" "}
                        </span>
                      </a>
                    </>
                  ) : null}
                  <div className="text-gray-500 text-sm ml-2 flex">
                    Posted by{" "}
                    <a href={`/user/${post.author.username}`} className="flex">
                      <span className="px-1 text-indigo-600">•</span>
                      <h4 className=" text-indigo-500">
                        u/{post.author.username}
                      </h4>
                    </a>
                  </div>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400  hover:cursor-default ">
                  {formatTimeToNow(new Date(post.createdAt))}
                </span>
              </div>
            </div>
            {/* <a href={`/user/${post.author.username}`}>
              Posted by u/{post.author.username}
            </a>{" "} */}
          </div>
          <a href={`/cb/${communityName}/post/${post.id}`}>
            <h1 className="md:text-lg md:font-semibold py-2 ml-8 leading-6 text-gray-400">
              {post.title}
            </h1>
          </a>
          <div className="absolute h-14 top-10 w-px z-0 bg-zinc-700 bottom-0 left-5 transform -translate-x-1/2 bg-gradient-to-t from-gray-700 to-transparent"></div>
          {/* attach ref to check whether post is exhausting max-h or not and show blurry effect on preview indicating post is long   */}
          <div
            className="relative z-20 text-sm overflow-clip rounded-sm max-h-24 md:h-24 md:block h-16 text-gray-400 "
            ref={pRef}
          >
            <EditorOutputContent content={post.content} />
            {pRef.current?.clientHeight === 160 || 96 || 72 || 80 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 md:h-20 h-18 w-full bg-gradient-to-t from-gray-900 to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center z-20 text-sm pt-3 md:p-4  md:ml-5">
        <div className="md:hidden">
          <PostVoteClient
            postId={post.id}
            initialVote={currentVote?.type}
            initialVotesAmt={votesAmt}
          />
        </div>

        <Link
          href={`/cb/${communityName}/post/${post.id}`}
          className="flex items-center gap-2 justify-center text-gray-400 ml-4 "
        >
          <MessagesSquare className="h-5 w-5" /> {commentsCount}
        </Link>
      </div>
    </div>
  );
};

export default Post;
