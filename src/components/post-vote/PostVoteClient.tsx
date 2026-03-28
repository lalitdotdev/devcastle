"use client"

import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { FC, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

import { Button } from '../ui/Button';
import { PostVoteRequest } from '@/lib/validators/vote';
import { VoteType } from '@prisma/client';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useMutation } from '@tanstack/react-query';
import { usePrevious } from '@mantine/hooks';

interface PostVoteClientProps {
    postId: string;
    initialVotesAmt: number;
    initialVote?: VoteType | null;
    layout?: "horizontal" | "vertical";
}

const PostVoteClient: FC<PostVoteClientProps> = ({
    postId,
    initialVotesAmt,
    initialVote,
    layout = "horizontal",
}) => {
    const { loginToast } = useCustomToast();
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const prevVote = usePrevious(currentVote);

    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);

    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                voteType,
            };
            await axios.patch("/api/community/post/vote", payload);
        },
        onError: (err: any, voteType) => {
            if (voteType === "UPVOTE") setVotesAmt(prev => prev - 1);
            else setVotesAmt(prev => prev + 1);
            setCurrentVote(prevVote);

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: "Something went wrong!",
                description: "Your vote was not registered. Please try again later.",
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
        <div className="group relative w-fit">
            <div className={cn(
                "flex items-center gap-1 rounded-full bg-zinc-800/60 backdrop-blur-md p-1 border border-zinc-700/50 shadow-md",
                layout === "vertical" ? "flex-col py-2" : "flex-row px-1"
            )}>
                {/* Upvote button */}
                <Button
                    onClick={() => vote("UPVOTE")}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "transition-all duration-300 hover:scale-110 active:scale-90",
                        "p-0 h-7 w-7 rounded-full",
                        currentVote === "UPVOTE" 
                            ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse-subtle" 
                            : "text-zinc-500 hover:bg-zinc-700/50 hover:text-emerald-400"
                    )}
                    aria-label="upvote"
                >
                    <ChevronUp className="h-5 w-5" />
                </Button>

                {/* Vote count */}
                <span className={cn(
                    "min-w-[2.5rem] text-center font-bold text-xs tabular-nums transition-colors duration-300",
                    currentVote === "UPVOTE"
                        ? "text-emerald-400"
                        : currentVote === "DOWNVOTE"
                            ? "text-red-400"
                            : "text-zinc-300"
                )}>
                    {votesAmt}
                </span>

                {/* Downvote button */}
                <Button
                    onClick={() => vote("DOWNVOTE")}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "transition-all duration-300 hover:scale-110 active:scale-90",
                        "p-0 h-7 w-7 rounded-full",
                        currentVote === "DOWNVOTE" 
                            ? "bg-red-500/15 text-red-400 shadow-[0_0_15px_rgba(248,113,113,0.3)] animate-pulse-subtle" 
                            : "text-zinc-500 hover:bg-zinc-700/50 hover:text-red-400"
                    )}
                    aria-label="downvote"
                >
                    <ChevronDown className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default PostVoteClient;
