"use client";

import { Award, Feather, Link2 } from "lucide-react";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/Input";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="w-full list-none overflow-hidden rounded-md bg-transparent shadow border-2 border-indigo-600">
      <div className="h-full px-6 py-4 flex sm:justify-between gap-6">
        <div className="relative flex items-start ">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          <span className="absolute bottom-1 right-0 rounded-full h-2 w-2 md:w-3 md:h-3 bg-green-500 outline outline-2 outline-white" />
        </div>
        <Input
          onClick={() => router.push(pathname + "/publish")}
          readOnly
          placeholder="Create post"
          className="md:w-[50%]"
        />
        <div className="hidden items-center md:flex justify-between w-[40%]">
          <span
            onClick={() => router.push(pathname + "/publish")}
            className="rounded-full md:ml-12 "
          >
            <Award className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
          </span>

          <span
            onClick={() => router.push(pathname + "/publish")}
            className="rounded-full  "
          >
            <Link2 className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
          </span>
          <span
            onClick={() => router.push(pathname + "/publish")}
            className="rounded-full md:mr-12 "
          >
            <Feather className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
          </span>
        </div>
      </div>
    </li>
  );
};

export default MiniCreatePost;
