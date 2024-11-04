"use client"

import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
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
        <div className="group relative">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm p-2 transition-all duration-300 hover:from-zinc-700/90 hover:to-zinc-800/90 shadow-lg hover:shadow-xl">
                {/* Upvote button */}
                <Button
                    onClick={() => vote("UPVOTE")}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "transition-all duration-200 hover:scale-110 active:scale-95",
                        "p-0 h-8 w-8 rounded-lg",
                        "bg-transparent hover:bg-zinc-700/50"
                    )}
                    aria-label="upvote"
                >
                    <ArrowBigUp
                        className={cn(
                            "h-6 w-6 transition-colors duration-200",
                            currentVote === "UPVOTE"
                                ? "text-emerald-400 group-hover:text-emerald-300"
                                : "text-zinc-400 group-hover:text-zinc-300"
                        )}
                    />
                </Button>

                {/* Vote count */}
                <span className={cn(
                    "min-w-12 text-center px-2 py-1 rounded-lg font-medium text-sm transition-colors duration-200",
                    "bg-zinc-800/50 group-hover:bg-zinc-700/50",
                    currentVote === "UPVOTE"
                        ? "text-emerald-400 group-hover:text-emerald-300"
                        : currentVote === "DOWNVOTE"
                            ? "text-red-400 group-hover:text-red-300"
                            : "text-zinc-300 group-hover:text-zinc-200"
                )}>
                    {votesAmt}
                </span>

                {/* Downvote button */}
                <Button
                    onClick={() => vote("DOWNVOTE")}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "transition-all duration-200 hover:scale-110 active:scale-95",
                        "p-0 h-8 w-8 rounded-lg",
                        "bg-transparent hover:bg-zinc-700/50"
                    )}
                    aria-label="downvote"
                >
                    <ArrowBigDown
                        className={cn(
                            "h-6 w-6 transition-colors duration-200",
                            currentVote === "DOWNVOTE"
                                ? "text-red-400 group-hover:text-red-300"
                                : "text-zinc-400 group-hover:text-zinc-300"
                        )}
                    />
                </Button>
            </div>
        </div>
    );
};

export default PostVoteClient;
