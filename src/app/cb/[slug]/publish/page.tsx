import { Button } from "@/components/ui/Button";
import Editor from "@/components/Editor";
import { Pen } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        slug: string;
    };
}

export function generateMetadata({ params: { slug } }: PageProps) {
    return {
        title: `Create Post | ${slug}`,
        description: `Create a post in c/${slug}`,
    };
}

const CreatePostPage = async ({ params }: PageProps) => {
    const community = await db.community.findFirst({
        where: {
            name: params.slug,
        },
    });

    if (!community) {
        return notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-700">
                    <div className="flex items-center space-x-3">
                        <Pen className="h-5 w-5 text-blue-500" />
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-zinc-100">
                                Create Post
                            </h3>
                            <div className="flex items-center">
                                <span className="text-zinc-400 mx-2">in</span>
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
                                    c/{params.slug}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Section */}
                <div className="p-6">
                    <div className="space-y-6">
                        <Editor communityId={community.id} />

                        {/* Action Button */}
                        <div className="flex justify-end pt-4 border-t border-zinc-800">
                            <Button
                                type="submit"
                                form="community-post-form"
                                className="relative inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                            >
                                <span className="relative">Publish Post</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional: Add a helper text or guidelines */}
            <div className="mt-6 text-sm text-zinc-400 px-4">
                <p className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-blue-500" />
                    Share your thoughts, ideas, or questions with the community
                </p>
            </div>
        </div>
    );
};

export default CreatePostPage;
