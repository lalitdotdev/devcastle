import CreateComment from "./CreateComment";
import { MessageCircle } from "lucide-react";
import PostComment from "./PostComment";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

interface CommentsSectionProps {
    postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
    const session = await getAuthSession();

    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    });

    return (
        <div className="flex flex-col">
            {/* Create Comment Section */}
            <div className="mb-6">
                <div className="p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm ring-1 ring-zinc-700/50 transition-all duration-200 hover:bg-zinc-800/50">
                    <CreateComment postId={postId} />
                </div>
            </div>

            {/* Empty State */}
            {comments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="bg-zinc-800/30 backdrop-blur-sm rounded-full p-3 mb-4 ring-1 ring-zinc-700/50">
                        <MessageCircle className="h-6 w-6 text-zinc-400" />
                    </div>
                    <p className="text-center text-zinc-400 max-w-md">
                        Ready to be the conversational catalyst? Be the first to dive in and
                        make this thought come alive with your unique perspective!
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments
                    ?.filter(comment => !comment.replyToId)
                    .map(topLevelComment => {
                        const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
                            (acc, vote) => {
                                if (vote.type === "UPVOTE") return acc + 1;
                                if (vote.type === "DOWNVOTE") return acc - 1;
                                return acc;
                            },
                            0
                        );

                        const topLevelCommentVote = topLevelComment.votes.find(
                            vote => vote.userId === session?.user.id
                        );

                        return (
                            <div
                                key={topLevelComment.id}
                                className="group relative transition-all duration-200"
                            >
                                {/* Top Level Comment */}
                                <div className="relative">
                                    <div className="p-4 rounded-lg bg-zinc-800/30 backdrop-blur-sm ring-1 ring-zinc-700/50 transition-all duration-200 group-hover:bg-zinc-800/50">
                                        <PostComment
                                            postId={postId}
                                            comment={topLevelComment}
                                            currentVote={topLevelCommentVote}
                                            votesAmt={topLevelCommentVotesAmt}
                                        />
                                    </div>
                                </div>

                                {/* Replies */}
                                {topLevelComment.replies.length > 0 && (
                                    <div className="mt-2 pl-4 space-y-2">
                                        {topLevelComment.replies
                                            .sort((a, b) => b.votes.length - a.votes.length)
                                            .map(reply => {
                                                const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                                                    if (vote.type === "UPVOTE") return acc + 1;
                                                    if (vote.type === "DOWNVOTE") return acc - 1;
                                                    return acc;
                                                }, 0);

                                                const replyVote = reply.votes.find(
                                                    vote => vote.userId === session?.user.id
                                                );

                                                return (
                                                    <div
                                                        key={reply.id}
                                                        className="relative pl-4 mt-2 transition-all duration-200"
                                                    >
                                                        {/* Reply Thread Line */}
                                                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-zinc-500/50 to-transparent" />

                                                        <div className="p-3 rounded-lg bg-zinc-800/20 backdrop-blur-sm ring-1 ring-zinc-700/30 transition-all duration-200 hover:bg-zinc-800/40">
                                                            <PostComment
                                                                comment={reply}
                                                                currentVote={replyVote}
                                                                votesAmt={replyVotesAmt}
                                                                postId={postId}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default CommentsSection;
