import {
    QueryKey,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { Bookmark } from "lucide-react";
import { BookmarkInfo } from "@/types/types";
import { cn } from "@/lib/utils";
import kyInstance from "@/lib/ky";
import { toast } from 'sonner'

interface BookmarkButtonProps {
    postId: string;
    initialState: BookmarkInfo;
}

export default function BookmarkButton({
    postId,
    initialState,
}: BookmarkButtonProps) {


    const queryClient = useQueryClient();

    const queryKey: QueryKey = ["bookmark-info", postId];

    const { data } = useQuery({
        queryKey,
        queryFn: () =>
            kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
        initialData: initialState,
        staleTime: Infinity,
    });

    const { mutate, isLoading } = useMutation({
        mutationFn: () =>
            data.isBookmarkedByUser
                ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
                : kyInstance.post(`/api/posts/${postId}/bookmark`),
        onMutate: async () => {
            toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);
            await queryClient.cancelQueries({ queryKey });

            const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

            queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
                isBookmarkedByUser: !previousState?.isBookmarkedByUser,
            }));

            return { previousState };
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        },
    });

    return (
        <button onClick={() => mutate()} className="flex items-center gap-2 p-2 rounded-full bg-zinc-800">
            <Bookmark
                size={20}
                className={cn(
                    "size-3 text-gray-300",
                    data.isBookmarkedByUser && "fill-slate-100 text-primary",
                )}
            />
        </button>
    );
}
