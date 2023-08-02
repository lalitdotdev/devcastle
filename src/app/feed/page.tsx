import CustomFeed from "@/components/Feed/CustomFeed";
import GeneralFeed from "@/components/Feed/GeneralFeed";
import Recommendations from "@/components/Recommendations";
import { buttonVariants } from "@/components/ui/Button";

import { getAuthSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

const page = async () => {
  // TODO: {/* General feed ---> Logged Out
  // TODO: Custom Feed -----> Logged In */}

  const session = await getAuthSession();

  // if (!session?.user) {
  //   // redirect(authOptions?.pages?.signIn || "/");
  //   redirect("/");
  // }

  return (
    <div className="mx-auto max-w-6xl pt-8">
      <h1 className="font-bold text-3xl md:text-4xl text-[#6366F1] ">
        Your feed
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Display either custom feed or general feed */}

        {/* @ts-expect-error server component */}

        {session ? <CustomFeed /> : <GeneralFeed />}
        <div className="gap-y-4">
          <div className="overflow-hidden p-4 h-fit rounded-lg border-2 border-gray-600 order-first md:order-last hidden md:block">
            <div className="px-6 py-4 text-gray-300 bg-[#262a35]">
              <p className="font-semibold py-3 flex items-center gap-1.5">
                <HomeIcon className="h-5 w-5" />
                Home
              </p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Your personalized CampusBuddy feedPage. Come here to check in
                  with your favorite communities.
                </p>
              </div>

              <div className="border border-indigo-600 text-gray-400 rounded-md mb-2">
                <Link
                  className={cn(
                    "flex flex-col justify-center items-center p-2",
                  )}
                  href="/cb/create"
                >
                  Create Community
                </Link>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
