import { ArrowUpCircle, BarChart, Github, Lightbulb, Rss } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import AddFeedDialog from "@/components/Feed/UrlFeedFormDialog";
import DotPattern from "@/components/ui/dotbggradient";
import EssayList from "@/components/EssaysList";
import FeedItem from "@/components/Feed/StartupMagazineFeedItem";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import TrendingRepoList from "@/components/TredingRepoList";
import UpdateButton from "../_components/UpdateEssays";
import { cn } from "@/lib/utils";
import { fetchGithubTrending } from "@/app/feed/actions/fetchGithubTrending";
import { getEntrepreneurFeed } from "@/app/feed/actions/getEntrepreneurFeed";
import { getEssays } from "../../actions";
import { getSimonWillisonFeed } from "@/app/feed/actions/getSimonWillisonFeed";
import { getStartupMagazineFeed } from "@/app/feed/actions/getStartupMagazineFeed";
import { getTechCrunchFeed } from "@/app/feed/actions/getTechcrunchFeed";

export const metadata: Metadata = {
    title: {
        default: "Feed Reader | Devcastle",
        template: "%s | Devcastle",
    },
    description: "Essays feeds and more.",
};
export default async function EssaysPage() {
    let paulGrahamEssays = [] as any;
    let simonWillisonEssays = [] as any;
    let entrepreneurEssays = [] as any;
    let githubTrendingRepos = [] as any;
    let startupMagazineFeed = [] as any;
    let techCrunchFeed = [] as any;


    try {
        [paulGrahamEssays, simonWillisonEssays, entrepreneurEssays, githubTrendingRepos, startupMagazineFeed, techCrunchFeed] = await Promise.all([
            getEssays(),
            getSimonWillisonFeed(),
            getEntrepreneurFeed()
            , fetchGithubTrending(),
            getStartupMagazineFeed(),
            getTechCrunchFeed()



        ]);
    } catch (error) {
        console.error("Error fetching essays:", error);
    }

    // console.log(simonWillisonEssays)
    console.log(githubTrendingRepos)
    console.log(startupMagazineFeed)
    console.log(techCrunchFeed)



    return (
        <main className="mx-auto md:p-12 ">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    '[mask-image:radial-gradient(200px_circle_at_center,zinc-300,transparent)]',
                )}
            />
            <div className="space-y-8">
                <h1 className="md:text-6xl text-4xl font-bold my-4 rounded-xl gradient-text animate-gradient">
                    Feed Reader <span className="text-gray-400">📰</span>
                </h1>


                {/* I want to add a list of sources here and should show list style */}
                <div className="text-gray-400 text-sm ">
                    <ul className="list-disc ml-6 flex md:flex-row flex-col md:space-x-10">
                        <li>Paul Graham Essays</li>
                        <li>Simon Willison&apos;s Blog</li>
                        <li>TechCrunch</li>
                        <li>Entrepreneur</li>
                        <li>GitHub Trending</li>
                        <li>The Startup Magazine</li>

                    </ul>
                    <br />

                    <div className="text-zinc-300 border border-teal-600 p-3 max-w-fit mt-5 ">Feel free to add or suggest more sources to this list by creating a PR on the GitHub repository.</div>
                    <br />
                </div>


                {/* https://www.reddit.com/r/indiehackers/comments/qjkp7o/web_scraped_indiehackers_products_data_and/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button */}

                {/* https://data.crunchbase.com/docs/using-the-api */}
                {/* https://www.entrepreneur.com/latest.rss */}

                {/* https://rss.feedspot.com/entrepreneur_rssbun_feeds/ */}

                {/* https://www.techstars.com/ */}
                <Tabs defaultValue="paulGraham" className="w-full">
                    <ScrollArea className="w-full whitespace-nowrap rounded-md ">
                        <TabsList className="inline-flex h-12 items-center justify-center rounded-none bg-gray-800 ">
                            <TabsTrigger
                                value="techCrunch"
                                className=" inline-flex"
                            >
                                <Image src="/logo/tc.svg" width={20} height={20} alt="TechCrunch" className="mr-2" />
                                TechCrunch
                            </TabsTrigger>
                            <TabsTrigger
                                value="entrepreneur"
                                className=" inline-flex"
                            >
                                <Lightbulb className="mr-2 h-4 w-4 text-lime-300" />
                                Entrepreneur(latest)
                            </TabsTrigger>
                            <TabsTrigger
                                value="startupMagazine"
                                className=" inline-flex"
                            >
                                <BarChart className="mr-2 h-4 w-4 text-teal-400" />
                                The Startup Magazine
                            </TabsTrigger>
                            <TabsTrigger
                                value="paulGraham"
                                className=" inline-flex"
                            >
                                <Rss className="mr-2 h-4 w-4 text-zinc-100" />
                                Paul Graham Essays
                            </TabsTrigger>
                            <TabsTrigger
                                value="simonWillison"
                                className=" inline-flex"
                            >
                                Simon Willison&apos;s Blog
                            </TabsTrigger>
                            <TabsTrigger
                                value="githubTrending"
                                className=" inline-flex"
                            >
                                <Image src="/logo/github.svg" width={18} height={18} alt="GitHub" className="mr-2" />
                                GitHub Trending
                            </TabsTrigger>
                            <TabsTrigger
                                value="addFeed"
                                className=" inline-flex"
                            >
                                <AddFeedDialog />
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <TabsContent value="paulGraham" className="p-4 bg-gray-800 rounded-lg  mx-auto">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://www.paulgraham.com/bio.html"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        © 1985-2022 by Paul Graham. All rights reserved.
                                    </p>


                                </Link>
                            </div>
                            {paulGrahamEssays.length > 0 ? (
                                <EssayList essays={paulGrahamEssays} />
                            ) : (
                                <p className="text-gray-500">Unable to load Paul Graham essays at this time.</p>
                            )}
                        </section>
                    </TabsContent>

                    <TabsContent value="simonWillison" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://simonwillison.net/"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        Recent entries from Simon Willison&apos;s weblog.
                                    </p>
                                </Link>
                            </div>
                            {simonWillisonEssays.length > 0 ? (
                                <EssayList essays={simonWillisonEssays} />
                            ) : (
                                <p className="text-gray-500">Unable to load Simon Willison&apos;s blog posts at this time.</p>
                            )}
                        </section>
                    </TabsContent>

                    <TabsContent value="techCrunch" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://techcrunch.com/"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        The latest technology news and information on startups.
                                    </p>
                                </Link>
                            </div>
                            {techCrunchFeed.length > 0 ? (
                                <div className="container mx-auto px-4 py-8">
                                    {techCrunchFeed.map((item: any) => (
                                        <FeedItem key={item.id} {...item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Unable to load The Startup Magazine articles at this time.</p>
                            )}
                        </section>
                    </TabsContent>

                    <TabsContent value="entrepreneur" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://www.entrepreneur.com/"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        The latest news, expert advice, and growth strategies for small business owners.
                                    </p>
                                </Link>
                            </div>
                            {entrepreneurEssays.length > 0 ? (
                                <EssayList essays={entrepreneurEssays} />
                            ) : (
                                <p className="text-gray-500">Unable to load Entrepreneur articles at this time.</p>
                            )}
                        </section>
                    </TabsContent>
                    <TabsContent value="githubTrending" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://github.com/trending"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        GitHub Trending Repositories
                                    </p>
                                </Link>
                            </div>
                            {githubTrendingRepos.length > 0 ? (
                                <TrendingRepoList repos={githubTrendingRepos} />

                            ) : (
                                <p className="text-gray-500">Unable to load GitHub Trending Repositories at this time.</p>
                            )}
                        </section>


                    </TabsContent>

                    <TabsContent value="startupMagazine" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://thestartupmag.com/"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        The latest news and insights from The Startup Magazine.
                                    </p>
                                </Link>
                            </div>
                            {startupMagazineFeed.length > 0 ? (
                                <div className="container mx-auto px-4 py-8">
                                    {startupMagazineFeed.map((item: any) => (
                                        <FeedItem key={item.id} {...item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Unable to load The Startup Magazine articles at this time.</p>
                            )}
                        </section>
                    </TabsContent>

                    {/* TODO: Add the tab for the feed URL */}









                </Tabs>

                <div className="mt-12">
                    <UpdateButton />
                </div>
            </div>
        </main>
    );
}
