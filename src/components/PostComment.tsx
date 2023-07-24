"use client";

import { FC, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: FC<PostCommentProps> = ({
  postId,
  comment,
  currentVote,
  votesAmt,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession(); // get session from next-auth react-query hook on client side
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      // make POST request to /api/comments
      // invalidate query for comments of post we just commented on
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/community/post/comment",
        payload,
      );
      return data;
    },

    // Handle errors and successes on Client Side
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong ",
        description: "Comment was not posted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col p-2 ml-2">
      <div className="flex items-center ">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="w-6 h-6 mr-2 border-2 border-blue-500"
        />

        <div className="ml-2 flex items-center gap-x-2 ">
          <p className="text-xs font-medium text-gray-500">
            {comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-400 p-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap ">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />
        <Button
          size="xs"
          className="bg-transparent text-gray-500"
          onClick={() => {
            if (!session) {
              router.push("/sign-in");
              return;
            }
            setIsReplying(!isReplying);
          }}
        >
          <MessageSquare size={15} className="mr-2" />
          Reply
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="reply" className="mr-2">
              Your reply
            </Label>
            <div className="mt-2">
              <Textarea
                id="reply"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="What are your thoughts?"
                rows={1}
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  className="tabIndex={-1} border border-gray-600 hover:border-indigo-600  p-2 h-8 text-gray-400"
                  onClick={() => setIsReplying(false)}
                >
                  Dismiss
                </Button>
                <Button
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return;
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                    setInput("");
                    setIsReplying(false);
                  }}
                  isLoading={isLoading}
                  className="border h-8 border-indigo-600 p-2 text-indigo-600 hover:bg-indigo-600 hover:text-white "
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
