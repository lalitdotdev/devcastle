"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { cn } from "@/lib/utils";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Heart, HeartCrack } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../ui/Button";

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

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      {/* upvote */}
      <Button
        // onClick={() => vote("UPVOTE")}
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
        // onClick={() => vote('DOWN')}
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
