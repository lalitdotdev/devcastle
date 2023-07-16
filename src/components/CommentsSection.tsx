import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import PostComment from './PostComment';
import CreateComment from './CreateComment';

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

  return (
    <div className="flex flex-col gap-y-4 mt-4 ">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      {/* rendering top level comments*/}
      <div className="flex flex-col gap-y-6 mt-4 bg-zinc-50 p-4">
        {comments
          ?.filter(comment => !comment.replyToId)
          .map(topLevelComment => {
            // get total votes for each top level comment
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UPVOTE') return acc + 1;
                if (vote.type === 'DOWNVOTE') return acc - 1;
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
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentsSection;
