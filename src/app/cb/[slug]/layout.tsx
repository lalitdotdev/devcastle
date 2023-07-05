// wrapper component around all the page component

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReactNode } from "react";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: ReactNode;
  params: { slug: string };
}) => {
  const session = getAuthSession();
  const community = await db.community.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  // Extract the community description from the fetched community object
  const communityDescription = community?.description;
  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        {/* TODO: BTN TO TAKE BACK TO FEED */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>
          {/* info sidebar */}

          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About cb/{community?.name}</p>
              <p className="text-sm rounded-lg border border-gray-200 p-2">
                {communityDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
