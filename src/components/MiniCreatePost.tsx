"use client";

import { Award, Feather, Link2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { FC } from "react";
import { Input } from "./ui/Input";
import { Session } from "next-auth";
import UserAvatar from "./UserAvatar";

interface MiniCreatePostProps {
    session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="overflow-hidden rounded-lg bg-zinc-900 shadow-md hover:shadow-lg transition-shadow duration-200 my-4">
            <div className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null,
                        }}
                    />

                    <div className="flex-1">
                        <Input
                            onClick={() => router.push(pathname + "/publish")}
                            readOnly
                            placeholder="Create post"
                            className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500 hover:bg-zinc-700/50 transition-colors duration-200"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push(pathname + "/publish")}
                            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors duration-200"
                        >
                            <Feather className="h-4 w-4" />
                            <span className="hidden md:inline">Write</span>
                        </button>

                        <button
                            onClick={() => router.push(pathname + "/publish")}
                            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors duration-200"
                        >
                            <Link2 className="h-4 w-4" />
                            <span className="hidden md:inline">Link</span>
                        </button>

                        <button
                            onClick={() => router.push(pathname + "/publish")}
                            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors duration-200"
                        >
                            <Award className="h-4 w-4" />
                            <span className="hidden md:inline">Award</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiniCreatePost;
