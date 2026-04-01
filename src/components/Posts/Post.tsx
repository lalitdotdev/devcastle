"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Bookmark, Post, User, Vote } from "@prisma/client";
import {
  ArrowUpRight,
  MessageSquare,
  Share2,
  Globe2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useRef, useState } from "react";
import EditorOutputContent from "../EditorOutputContent";
import UserAvatar from "../UserAvatar";
import PostVoteClient from "../post-vote/PostVoteClient";
import BookmarkButton from "./BookMarkBtn";
import { PostData } from "@/types/types";
import SharePostModal from "../modals/contents/share-post-modal-content";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  communityName?: string;
  commentsCount?: number;
  post:
    | (Post & {
        author: User;
        votes: Vote[];
        bookmarks: Bookmark[];
      })
    | PostData;
  votesAmt?: number;
  currentVote?: PartialVote;
  index?: number;
}

// Accent cycling — deterministic per post id
const ACCENTS = [
  {
    dot: "bg-violet-400",
    bar: "from-violet-500",
    glow: "group-hover:shadow-violet-500/8",
    community: "text-violet-400 hover:text-violet-300",
  },
  {
    dot: "bg-cyan-400",
    bar: "from-cyan-500",
    glow: "group-hover:shadow-cyan-500/8",
    community: "text-cyan-400 hover:text-cyan-300",
  },
  {
    dot: "bg-fuchsia-400",
    bar: "from-fuchsia-500",
    glow: "group-hover:shadow-fuchsia-500/8",
    community: "text-fuchsia-400 hover:text-fuchsia-300",
  },
  {
    dot: "bg-amber-400",
    bar: "from-amber-500",
    glow: "group-hover:shadow-amber-500/8",
    community: "text-amber-400 hover:text-amber-300",
  },
  {
    dot: "bg-emerald-400",
    bar: "from-emerald-500",
    glow: "group-hover:shadow-emerald-500/8",
    community: "text-emerald-400 hover:text-emerald-300",
  },
  {
    dot: "bg-rose-400",
    bar: "from-rose-500",
    glow: "group-hover:shadow-rose-500/8",
    community: "text-rose-400 hover:text-rose-300",
  },
];

function accentForId(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
}

const PostCard: FC<PostProps> = ({
  communityName,
  post,
  commentsCount,
  votesAmt,
  currentVote,
  index = 0,
}) => {
  const pRef = useRef<HTMLDivElement>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const { data: session } = useSession();

  const accent = accentForId(post.id);

  const isBookmarkedByUser =
    post.bookmarks && session?.user?.id
      ? post.bookmarks.some((b) => b.userId === session.user.id)
      : false;

  return (
    <>
      <div className="group relative">
        {/* Card */}
        <div
          className={`relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm
                    hover:border-zinc-700/70 hover:bg-zinc-900/60
                    hover:shadow-xl ${accent.glow}
                    transition-all duration-300 overflow-hidden`}
        >
          {/* Left accent stripe */}
          <div
            className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full
                        bg-gradient-to-b ${accent.bar} to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />

          <div className="p-5 pl-6">
            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with connector line */}
                <div className="relative shrink-0">
                  <div className="h-8 w-8 rounded-xl overflow-hidden border border-zinc-800 ring-1 ring-zinc-800">
                    <UserAvatar user={post.author} className="h-full w-full" />
                  </div>
                </div>

                {/* Meta */}
                <div className="min-w-0">
                  {communityName && (
                    <a
                      href={`/cb/${communityName}`}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${accent.community}`}
                    >
                      <Globe2 className="h-3 w-3 shrink-0" />
                      cb/{communityName}
                    </a>
                  )}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <a
                      href={`/u/${post.author.username}`}
                      className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors truncate"
                    >
                      u/{post.author.username}
                    </a>
                    <span className="h-2.5 w-px bg-zinc-800 shrink-0" />
                    <span className="flex items-center gap-1 text-[11px] text-zinc-700 shrink-0">
                      <Clock className="h-2.5 w-2.5" />
                      {formatTimeToNow(new Date(post.createdAt))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Open post arrow — revealed on hover */}
              <a
                href={`/cb/${communityName}/post/${post.id}`}
                aria-label="Open post"
                className="shrink-0 flex items-center justify-center h-7 w-7 rounded-lg
                                    border border-zinc-800 bg-zinc-900/80
                                    text-zinc-600 hover:text-zinc-200 hover:border-zinc-600
                                    opacity-0 group-hover:opacity-100
                                    transition-all duration-200"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* ── Title + Content ── */}
            <a
              href={`/cb/${communityName}/post/${post.id}`}
              className="block group/title"
            >
              <h2
                className="text-sm font-semibold text-zinc-200 group-hover/title:text-white transition-colors leading-snug mb-2"
                style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
              >
                {post.title}
              </h2>

              {/* Content preview */}
              <div
                ref={pRef}
                className="relative max-h-24 overflow-hidden"
                style={{ isolation: "isolate" }} // ← prevents backdrop-filter compositing leak
              >
                <EditorOutputContent content={post.content} />
                {/* Fade-out */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-zinc-900/80 to-transparent" />
              </div>

              {/* Read more */}
              <span className="inline-flex items-center gap-1 mt-2 text-[11px] text-zinc-600 group-hover/title:text-zinc-400 transition-colors">
                Read more <ChevronRight className="h-3 w-3" />
              </span>
            </a>

            {/* ── Divider ── */}
            <div className="my-4 border-t border-zinc-800/60" />

            {/* ── Actions ── */}
            <div className="flex items-center justify-between gap-2">
              {/* Left: votes + comments */}
              <div className="flex items-center gap-2">
                <PostVoteClient
                  postId={post.id}
                  initialVote={currentVote?.type}
                  initialVotesAmt={votesAmt || 0}
                />

                <a
                  href={`/cb/${communityName}/post/${post.id}`}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg
                                        border border-zinc-800 bg-zinc-900/60 text-zinc-600
                                        hover:border-zinc-700 hover:text-zinc-300
                                        text-[11px] font-medium transition-all duration-200"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {commentsCount ?? 0}
                </a>
              </div>

              {/* Right: share + bookmark */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShareModalVisible(true)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg
                                        border border-zinc-800 bg-zinc-900/60 text-zinc-600
                                        hover:border-zinc-700 hover:text-zinc-300
                                        text-[11px] font-medium transition-all duration-200"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>

                <BookmarkButton
                  postId={post.id}
                  initialState={{ isBookmarkedByUser }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SharePostModal
        visible={shareModalVisible}
        setVisible={setShareModalVisible}
        currentProduct={post}
        postId={post.id}
      />
    </>
  );
};

export default PostCard;
