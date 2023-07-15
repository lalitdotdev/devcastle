// preload the information for the post vote component on the server which is fast

import { getAuthSession } from '@/lib/auth';
import { Post, Vote, VoteType } from '@prisma/client';
import { notFound } from 'next/navigation';
import PostVoteClient from './PostVoteClient';

// preload the information for the post vote component on the server which is fast and then hydrate it on the client side
interface PostVoteServerProps {
  postId: string;
  initialVoteAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>; // getData is a function that returns a promise that resolves to a post object or null
}

// const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

const PostVoteServer = async ({
  postId,
  initialVoteAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();
  let _votesAmt: number = 0; // total votes for the post
  let _currentVote: VoteType | null | undefined = undefined; // current vote for the post by the user (if any)

  if (getData) {
    // await wait(2000);
    const post = await getData();
    if (!post) {
      return notFound();
    }
    // populate the votesAmt and currentVote variables
    // Reduce the post.votes array to calculate the total vote count
    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UPVOTE') return acc + 1;
      if (vote.type === 'DOWNVOTE') return acc - 1;
      return acc;
    }, 0);
    _currentVote = post.votes.find(
      vote => vote.userId === session?.user?.id,
    )?.type;
  } else {
    // if getData is not provided, use the initialVoteAmt and initialVote props
    _votesAmt = initialVoteAmt!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={_votesAmt}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
