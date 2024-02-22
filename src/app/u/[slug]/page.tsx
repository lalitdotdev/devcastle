import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  Sparkles,
  Twitter,
  UserCheck2,
  UserCog2,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface pageProps {
  params: {
    slug: string;
  };
}

const socials = {
  twitter: "https://twitter.com/mrExplorist",
  github: "https://github.com/mrExplorist",
  linkedin: "https://www.linkedin.com/in/pinglalit/",
  website: "https://lalitsharma-portfolio.netlify.app/",
  instagram: "",
};

const user = {
  about:
    "I am a full stack developer with 2+ years of experience in building web applications",
  followersCount: 80,
  followingCount: 20,
  articlesCount: 2,
};

// generate metadata for the page after /cb in slug

export function generateMetadata({ params: { slug } }: pageProps): Metadata {
  return {
    title: `${slug} | Profile`,
    description: `Profile of ${slug}`,
  };
}

const Page = async ({ params }: pageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const profile = await db.user.findFirst({
    where: {
      username: slug,
    },
  });

  return (
    <div>
      <main className="mx-auto my-6 w-full px-4 sm:max-w-5xl md:max-w-6xl lg:px-8">
        <div className="dark:border-gray-600 mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <div className="text-center">
                <div className="sm:m-0 shadow-lg rounded-full overflow-hidden h-[86px] w-[86px] md:h-[100px] md:w-[100px]">
                  {profile?.image && (
                    <Image
                      src={profile?.image}
                      width={500}
                      height={500}
                      alt=""
                    />
                  )}
                </div>
              </div>

              {/*TODO: Hard Coded now will fetch from DB */}
              <div className="w-full">
                <div className="flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-between md:flex-no-wrap mb-2 md:mb-0 gap-2 md:mt-10">
                  <h2 className="items-center md:text-4xl text-2xl text-indigo-500 font-bold break-words capitalize">
                    {profile?.username}
                  </h2>

                  <div className="border p-3 border-gray-700 rounded-sm flex items-center ">
                    <Sparkles className="h-6 w-6 text-green-700 mr-4 md:block hidden" />
                    <p className="max-w-xl truncated text-sm text-gray-200 ">
                      {profile?.about}
                    </p>
                  </div>

                  {session?.user?.id === profile?.id ? (
                    <Link href="/dashboard">
                      <UserCog2 className="text-indigo-500 md:h-10 md:w-10 w-8 h-8 mb-2" />
                    </Link>
                  ) : (
                    <Button className="border-2 gap-1 px-3 py-2 text-sm font-semibold text-indigo-600 uppercase  w-min border-indigo-600">
                      <UserCheck2 />( Follow
                    </Button>
                  )}
                </div>

                <div className="flex w-full justify-center pb-4 sm:mt-0 sm:mb-0 sm:w-auto sm:justify-start gap-3 relative md:top-3  opacity-70 text-gray-500 ">
                  {socials?.twitter && (
                    <a href={socials?.twitter} target="_blank" rel="noreferrer">
                      <Twitter className="h-6 w-6 hover:text-indigo-500 ">
                        Twitter
                      </Twitter>
                    </a>
                  )}
                  {socials?.github && (
                    <a href={socials?.github} target="_blank" rel="noreferrer">
                      <Github className="h-6 w-6 hover:text-indigo-500 ">
                        Github
                      </Github>
                    </a>
                  )}
                  {socials?.website && (
                    <a href={socials?.website} target="_blank" rel="noreferrer">
                      <Globe className="h-6 w-6 hover:text-indigo-500 " />
                    </a>
                  )}

                  {socials?.linkedin && (
                    <a
                      href={socials?.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Linkedin className="h-6 w-6 hover:text-indigo-500 " />
                    </a>
                  )}

                  {socials?.instagram && (
                    <a
                      href={socials?.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Instagram className="h-5 w-5 " />
                    </a>
                  )}
                </div>
              </div>
            </div>
            {/* Show edit on profile if the  */}
          </div>

          {/* only show followers and followings for user's own profile and dont show on other's profile */}
          {session?.user.id === profile?.id && (
            <div className="flex w-full flex-wrap sm:w-auto ml-10 md:ml-24 gap-x-4 gap-y-1 py-4">
              <span className="tracking-wider cursor hover:text-indigo-500 text-gray-500  flex gap-1">
                <span className="text-gray-400 dark:text-gray-300">
                  {user.followersCount}
                </span>
                <span className="cursor-pointer">Follower</span>
              </span>
              <span className="tracking-wider text-gray-500 dark:text-gray-400  flex gap-1">
                <span className="text-gray-400 dark:text-gray-300">
                  {user.followingCount}
                </span>
                <span className="hover:text-indigo-500 cursor-pointer">
                  Following
                </span>
              </span>
              <span className="tracking-wider text-gray-500 dark:text-gray-400  flex gap-1">
                <span className="text-gray-400 dark:text-gray-300">
                  {user.articlesCount}
                </span>
                <span className="hover:text-indigo-500 cursor-pointer">
                  Articles
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Profile tabs */}
        <div>
          <Tabs defaultValue="articles" className="w-full ">
            <div className="border-b border-gray-400 md:font-semibold w-full">
              <TabsList className="grid md:w-[55%] grid-cols-4  ">
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="experience" className="mr-4">
                  Experience
                </TabsTrigger>
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="articles">Articles</TabsContent>
            <TabsContent value="posts"></TabsContent>
            <TabsContent value="experience"></TabsContent>
            <TabsContent value="repositories"></TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Page;
