import { cn } from "@/lib/utils"

export default function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse transition-all rounded-md bg-slate-700", className)}
            {...props}
        />
    )
}


