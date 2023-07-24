"use client";

import { FC, useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  // logic for posting a comment goes here ...
  // we will use the useMutation hook from react-query to make a POST request to api/community/post/comment and then invalidate the query for the comments of the post we just commented on.

  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: comment, isLoading } = useMutation({
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
        title: "There was a problem , ",
        description: "Could not create comment to post, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment ">
        Comment as{" "}
        <span className="text-blue-700">{session?.user.username}</span>
      </Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Comment your thoughts?"
          rows={1}
        />

        <div className="mt-2 flex justify-end">
          <Button
            onClick={() => comment({ postId, text: input, replyToId })}
            isLoading={isLoading}
            disabled={input.length === 0}
            className="border bg-transparent border-indigo-600"
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
