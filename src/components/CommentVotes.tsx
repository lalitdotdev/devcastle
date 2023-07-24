"use client";

import { Button } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Heart, HeartCrack } from "lucide-react";
import { FC, useEffect, useState } from "react";

type PartialVote = Pick<CommentVote, "type">;
interface CommentVoteProps {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: PartialVote;
}

const CommentVote: FC<CommentVoteProps> = ({
  commentId,
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

      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      // updating by patch request as we don't want to send the whole post object to the server just to update the votes field in the db request body

      await axios.patch("/api/community/post/comment/vote", payload);
    },

    // error handling
    onError: (err: any, voteType) => {
      if (voteType === "UPVOTE") setVotesAmt(prev => prev - 1);
      else setVotesAmt(prev => prev + 1);

      // reset the current vote to previous vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong!",
        description: "Your vote was not registered , Please try again later.",
        variant: "destructive",
      });
    },
    onMutate: type => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UPVOTE") setVotesAmt(prev => prev - 1);
        else if (type === "DOWNVOTE") setVotesAmt(prev => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === "UPVOTE")
          setVotesAmt(prev => prev + (currentVote ? 2 : 1));
        else if (type === "DOWNVOTE")
          setVotesAmt(prev => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      {/* upvote */}
      <Button
        onClick={() => vote("UPVOTE")}
        size="sm"
        aria-label="upvote"
        className="bg-transparent"
      >
        <Heart
          className={cn("h-5 w-5 text-zinc-500", {
            // cn helper => conditionally apply the classNames
            "text-emerald-500 border-emerald-500":
              currentVote?.type === "UPVOTE",
          })}
        />
      </Button>
      {/* score */}
      <p className="text-center py-2 font-medium text-sm text-gray-400 w-3">
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote("DOWNVOTE")}
        size="sm"
        className={cn("bg-transparent", {
          "text-emerald-500": currentVote?.type === "DOWNVOTE",
        })}
        aria-label="downvote"
      >
        <HeartCrack
          className={cn("h-5 w-5 text-zinc-500", {
            "text-red-500 border-red-500": currentVote?.type === "DOWNVOTE",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVote;
