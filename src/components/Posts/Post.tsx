"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Bookmark, Post, User, Vote } from "@prisma/client";
import { Globe2, MessageSquare, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useRef, useState } from "react";
import EditorOutputContent from "../EditorOutputContent";
import UserAvatar from "../UserAvatar";
import PostVoteClient from "../post-vote/PostVoteClient";
import { Button } from "../ui/Button";
import { Separator } from "../ui/separator";
import BookmarkButton from "./BookMarkBtn";
import { PostData } from "@/types/types";
import SharePostModal from "../modals/contents/share-post-modal-content";

type PartialVote = Pick<Vote, "type">;
interface PostProps {
    communityName?: string;
    commentsCount?: number;
    post: Post & {
        author: User;
        votes: Vote[];
        bookmarks: Bookmark[];
    } | PostData;
    votesAmt?: number;
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
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const { data: session } = useSession();

    const isBookmarkedByUser = post.bookmarks && session?.user?.id
        ? post.bookmarks.some((bookmark) => bookmark.userId === session.user.id)
        : false;

    return (
        <div className="group relative w-full transform transition-all duration-300 hover:scale-[1.01]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-black/40 p-4 backdrop-blur-xl">
                {/* Header Section */}
                <div className="mb-4 flex items-start gap-4">
                    <div className="relative">
                        <div className="relative z-10 overflow-hidden rounded-full ring-2 ring-purple-500/20">
                            <UserAvatar user={post.author} />
                        </div>
                        <div className="absolute left-1/2 top-12 h-full w-px -translate-x-1/2 bg-gradient-to-b from-purple-500/20 to-transparent" />
                    </div>

                    <div className="flex-1">
                        {communityName && (
                            <a href={`/cb/${communityName}`} className="group/link mb-1 flex items-center gap-2">
                                <Globe2 className="h-4 w-4 text-indigo-400" />
                                <span className="text-sm font-medium text-indigo-400 transition-colors group-hover/link:text-indigo-300">
                                    c/{communityName}
                                </span>
                            </a>
                        )}

                        <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <a href={`/u/${post.author.username}`} className="hover:text-zinc-300">
                                u/{post.author.username}
                            </a>
                            <span>•</span>
                            <span className="hover:cursor-default">
                                {formatTimeToNow(new Date(post.createdAt))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <a href={`/cb/${communityName}/post/${post.id}`} className="block">
                    <h1 className="mb-3 text-xl font-semibold text-white transition-colors hover:text-purple-400">
                        {post.title}
                    </h1>

                    <div ref={pRef} className="relative max-h-32 overflow-hidden">
                        <div className="prose prose-invert max-w-none text-sm text-zinc-300">
                            <EditorOutputContent content={post.content} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                </a>

                <Separator className="my-4 bg-gray-800" />

                {/* Actions Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PostVoteClient
                            postId={post.id}
                            initialVote={currentVote?.type}
                            initialVotesAmt={votesAmt || 0}
                        />

                        <Button className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
                            <MessageSquare className="h-4 w-4" />
                            {commentsCount}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setShareModalVisible(true)}
                            className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                        >
                            <Upload className="h-4 w-4" />
                            Share
                        </Button>

                        <BookmarkButton
                            postId={post.id}
                            initialState={{
                                isBookmarkedByUser: isBookmarkedByUser
                            }}
                        />
                    </div>
                </div>
            </div>

            <SharePostModal
                visible={shareModalVisible}
                setVisible={setShareModalVisible}
                currentProduct={post}
                postId={post.id}
            />
        </div>
    );
};

export default Post;
