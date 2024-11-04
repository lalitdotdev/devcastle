import Skeleton from "@/components/ui/skeleton";

export function PostSkeleton() {
    return (
        <div className="p-3 rounded-xl ">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-3/4 mb-4" />
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
            </div>
        </div>
    );
}
