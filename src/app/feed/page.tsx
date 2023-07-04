import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl text-[#6366F1]">
        Your feed
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Feed */}
        {/* community info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personalised CampusBuddy feedpage. Come here to check in
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
    </>
  );
};

export default page;
