import CustomFeed from "@/components/Feed/CustomFeed";
import GeneralFeed from "@/components/Feed/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

const page = async () => {
  // TODO: {/* General feed ---> Logged Out
  // TODO: Custom Feed -----> Logged In */}

  const session = await getAuthSession();

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-bold text-3xl md:text-4xl text-[#6366F1]">
        Your feed
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Display either custom feed or general feed */}

        {/* @ts-expect-error server component */}

        {session ? <CustomFeed /> : <GeneralFeed />}

        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last hidden md:block">
          <div className="px-6 py-4 text-gray-300 bg-[#262a35]">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-5 w-5 text-indigo-500" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personalized CampusBuddy feedPage. Come here to check in
                with your favorite communities.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: "w-full mt-4  mb-6",
              })}
              href="/cb/create"
            >
              Create Community
            </Link>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default page;
