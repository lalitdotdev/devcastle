"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";

const ToFeedButton = () => {
  const pathname = usePathname();

  // if path is /r/mycom, turn into /
  // if path is /r/mycom/post/cligad6jf0003uhest4qqkeco, turn into /r/mycom

  const communityPath = getCommunityPath(pathname);

  return (
    <a href={communityPath} className="flex text-gray-400 items-center text-sm">
      <ChevronLeft className="h-4 w-4 mr-1 text-blue-400" />
      {communityPath === "/" ? "Back to community" : "Back to feed"}
    </a>
  );
};

const getCommunityPath = (pathname: string) => {
  const splitPath = pathname.split("/");

  if (splitPath.length === 3) return "/feed";
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`;
  // default path, in case pathname does not match expected format
  else return "/";
};

export default ToFeedButton;
