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
    // isBookmarked = true

}) => {
    const pRef = useRef<HTMLDivElement>(null);
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const { data: session } = useSession();
    const handleShareClick = () => {
        setShareModalVisible(true);
    };





    // todo: fix bookmarks in post undefined but storing in db



    // console.log(post.bookmarks)
    const isBookmarkedByUser = post.bookmarks && session?.user?.id
        ? post.bookmarks.some((bookmark) => bookmark.userId === session.user.id)
        : false;

    return (
        <div className="w-full  md:rounded-lg tracking-tight z-0  rounded-lg border border-gray-800 sm:p-2 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900/100 transition-colors duration-300  backdrop-blur-3xl">
            <div className="flex justify-between p-3 ">

                <div className="w-0 flex-1 relative ">
                    <div className="justify-between items-center relative z-10 ">
                        <div>
                            <div className="flex items-center gap-3 ">
                                <a href={`/user/${post.author.username}`}>
                                    <div className="sm:m-0 shadow-lg rounded-full overflow-hidden ">
                                        <UserAvatar user={post.author} />
                                        {/* Long vertical line below the avatar */}
                                    </div>
                                </a>

                                <div className="items-center p-1">
                                    {communityName ? (
                                        <>
                                            <a href={`/cb/${communityName}`}>
                                                <span className=" text-indigo-400 text-md font-semibold underline-offset-2 flex items-center">
                                                    <Globe2 className="h-4 w-4 mr-2" />
                                                    c/{communityName}{" "}
                                                </span>
                                            </a>
                                        </>
                                    ) : null}
                                    <div className="text-zinc-500 text-sm flex items-center p-1  ">
                                        <a href={`/u/${post.author.username}`} className="flex">
                                            by u/{post.author.username}
                                        </a>
                                        <span className="text-sm text-gray-500 dark:text-gray-400  hover:cursor-default ml-2 ">
                                            {formatTimeToNow(new Date(post.createdAt))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href={`/cb/${communityName}/post/${post.id}`}>
                        <h1 className="md:text-lg md:font-semibold py-2 ml-8 leading-6 text-white ">
                            {post.title}
                        </h1>

                        <div className="absolute h-[108px] top-10 w-px  bg-zinc-700  via-slate-600 bottom-0 left-5 transform -translate-x-1/2 bg-gradient-to-t from-transparent to-zinc-600"></div>

                        {/* attach ref to check whether post is exhausting max-h or not and show blurry effect on preview indicating post is long   */}
                        <div
                            className="relative overflow-clip  max-h-32 md:block text-zinc-200 p-2 backdrop-blur-3xl  to-transparent rounded-2xl "
                            ref={pRef}
                        >
                            <EditorOutputContent content={post.content} />

                        </div>
                    </a>
                </div>
            </div>
            <Separator className="bg-zinc-750" />
            <div className="flex items-center justify-between z-20 text-sm p-2 bg-none">
                <div className="flex items-center gap-4   ">
                    {/* <div className="bg-secondary text-secondary-foreground hover:bg-secondary/80  items-center gap-2 rounded-full p-1 bg-zinc-800"> */}
                    <PostVoteClient
                        postId={post.id}
                        initialVote={currentVote?.type}
                        initialVotesAmt={votesAmt || 0}
                    />

                    <Button
                        className="flex items-center gap-1 rounded-full bg-zinc-800 text-gray-400 hover:bg-zinc-800/40"
                    >
                        <MessageSquare />
                        {commentsCount}
                    </Button>
                </div>
                <div className="flex items-center gap-2 ">
                    <Button
                        onClick={handleShareClick}
                        className="flex items-center gap-1 rounded-full bg-zinc-800 text-gray-400 hover:bg-zinc-800/40"
                    >
                        <Upload size={16} />
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
