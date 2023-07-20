import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null, // only get top level comments (not replies) for now (we will get replies later)
    },
    include: {
      author: true,
      votes: true,
      replies: {
        // get replies for each top level comment
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  // If no comments, show a message to the user to create a comment for the post

  return (
    <div className="flex flex-col gap-y-4 mt-4 ">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />
      {/* rendering top level comments*/}
      {/* // sh0w the text message if there is no top level comment in the post */}

      {comments.length === 0 && (
        <div>
          <p className="my-6 text-sm text-center text-gray-500">
            Ready to be the conversational catalyst? Be the first to dive in and
            make this thought come alive with your unique perspective!.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-y-6 mt-4 p-4 bg-transparent">
        {comments
          ?.filter(comment => !comment.replyToId)
          .map(topLevelComment => {
            // get total votes for each top level comment
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UPVOTE") return acc + 1;
                if (vote.type === "DOWNVOTE") return acc - 1;
                return acc;
              },
              0,
            );
            const topLevelCommentVote = topLevelComment.votes.find(
              vote => vote.userId === session?.user.id,
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    postId={postId}
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                  />
                </div>

                {/* TODO Rendering Replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map(reply => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UPVOTE") return acc + 1;
                      if (vote.type === "DOWNVOTE") return acc - 1;
                      return acc;
                    }, 0);
                    const replyVote = reply.votes.find(
                      vote => vote.userId === session?.user.id,
                    );
                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-gap-1 border-l border-gray-500"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
