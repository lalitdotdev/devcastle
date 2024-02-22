"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
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

    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            // payload

            const payload: PostVoteRequest = {
                postId,
                voteType,
            };

            // updating by patch request as we don't want to send the whole post object to the server just to update the votes field in the db request body

            await axios.patch("/api/community/post/vote", payload);
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
        onMutate: (type: VoteType) => {
            if (currentVote === type) {
                setCurrentVote(undefined);
                if (type === "UPVOTE") setVotesAmt(prev => prev - 1);
                else if (type === "DOWNVOTE") setVotesAmt(prev => prev + 1);
            } else {
                setCurrentVote(type);
                if (type === "UPVOTE")
                    setVotesAmt(prev => prev + (currentVote ? 2 : 1));
                else if (type === "DOWNVOTE")
                    setVotesAmt(prev => prev - (currentVote ? 2 : 1));
            }
        },
    });

    return (
        <div className="flex gap-1 pr-0 w-24 bg-zinc-800 hover:bg-zinc-800/40 rounded-full p-1 sm:pb-0 items-center top-0">
            {/* upvote */}
            <Button
                onClick={() => vote("UPVOTE")}
                size="sm"
                aria-label="upvote"
                className="bg-transparent"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 text-gray-400", {
                        // cn helper => conditionally apply the classNames
                        "text-emerald-500 outline-emerald-500": currentVote === "UPVOTE",
                    })}
                />
            </Button>
            {/* score */}
            <p className="text-center py-2 font-medium text-md text-gray-400">
                {votesAmt}
            </p>

            {/* downvote */}
            <Button
                onClick={() => vote("DOWNVOTE")}
                size="sm"
                className={cn("bg-transparent", {
                    "text-emerald-500": currentVote === "DOWNVOTE",
                })}
                aria-label="downvote"
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 text-gray-400", {
                        "text-red-500 outline-red-500": currentVote === "DOWNVOTE",
                    })}
                />
            </Button>
        </div>
    );
};

export default PostVoteClient;
