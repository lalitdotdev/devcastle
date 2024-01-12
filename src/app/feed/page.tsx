import CustomFeed from '@/components/Feed/CustomFeed';
import GeneralFeed from '@/components/Feed/GeneralFeed';

import { getAuthSession } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { AlertTriangle, HomeIcon } from 'lucide-react';
import Link from 'next/link';

const page = async () => {
  // TODO: {/* General feed ---> Logged Out
  // TODO: Custom Feed -----> Logged In */}

  const session = await getAuthSession();

  // if (!session?.user) {
  //   // redirect(authOptions?.pages?.signIn || "/");
  //   redirect("/");
  // }

  return (
    <div className="mx-auto max-w-5xl pt-8">
      <h1 className="font-bold text-3xl md:text-4xl text-[#6366F1] ">Your feed</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Display either custom feed or general feed */}

        {/* @ts-expect-error server component */}

        {session ? <CustomFeed /> : <GeneralFeed />}

        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last ">
          <div className="px-6 py-4 flex justify-between text-gray-300 bg-[#262a35]">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon size={30} />
              Home Feed
            </p>
            <span className="mr-4 text-[#ffc107]">
              <AlertTriangle size={30} />
            </span>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm ">
            <div className="justify-between gap-x-4 py-3">
              <div className="items-center bg-[#1a1e26] rounded-md p-4 shadow-md ">
                <div>
                  <p className="text-zinc-400  text-left">
                    Dive into creativity with <span className="font-semibold text-zinc-400">ArtNPhilosophy</span> or
                    explore opportunities in <span className="font-semibold text-zinc-500">RemoteGigs</span>. <br />✨
                    Start by searching from the bar and join the conversation!
                  </p>
                </div>
              </div>
            </div>

            <div className=" text-zinc-300 rounded-md mb-2 border ">
              <Link className={cn('flex flex-col justify-center items-center p-2')} href="/cb/create">
                <div className="flex gap-2  p-1">
                  <span className="mt-1 font-semibold">Create Community</span>
                </div>
              </Link>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default page;
