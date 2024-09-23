// app/blog/page.tsx

import BlogArpitPosts from "@/components/Feed/ArpitBlogPosts";
import DotPattern from "@/components/ui/dotbggradient";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
    return (
        <main>
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    '[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]',
                )}
            />
            {/* @ts-expect-error Server Component */}
            <BlogArpitPosts />

        </main>
    );
}
