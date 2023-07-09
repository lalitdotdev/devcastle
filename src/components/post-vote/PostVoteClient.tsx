"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { cn } from "@/lib/utils";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Heart, HeartCrack } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios from "axios";

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
  postId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  // this is client component so we need to synchronize this with server
  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      // payload

      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      // updating by patch request as we don't want to send the whole post object to the server just to update the votes field in the db request body

      await axios.patch(`/api/community/post/vote`, payload);
    },
  });
  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      {/* upvote */}
      <Button
        onClick={() => vote("UPVOTE")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <Heart
          className={cn("h-5 w-5 text-zinc-700", {
            // cn helper => conditionally apply the classNames
            "text-emerald-500 fill-emerald-500": currentVote === "UPVOTE",
          })}
        />
      </Button>
      {/* score */}
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote("DOWNVOTE")}
        size="sm"
        className={cn({
          "text-emerald-500": currentVote === "DOWNVOTE",
        })}
        variant="ghost"
        aria-label="downvote"
      >
        <HeartCrack
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "DOWNVOTE",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
