import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import DotPattern from "@/components/ui/dotbggradient";
import EssayList from "@/components/EssaysList";
import FeedItem from "@/components/Feed/StartupMagazineFeedItem";
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

export const metadata: Metadata = {
    title: {
        default: "Devcastle | Essay Feeds and more.",
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


    try {
        [paulGrahamEssays, simonWillisonEssays, entrepreneurEssays, githubTrendingRepos, startupMagazineFeed] = await Promise.all([
            getEssays(),
            getSimonWillisonFeed(),
            getEntrepreneurFeed()
            , fetchGithubTrending(),
            getStartupMagazineFeed(),



        ]);
    } catch (error) {
        console.error("Error fetching essays:", error);
    }

    // console.log(simonWillisonEssays)
    console.log(githubTrendingRepos)
    console.log(startupMagazineFeed)



    return (
        <main className="md:px-24 mx-auto md:p-12 ">
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
                    Essays and Blogs <span className="text-gray-400">📰</span>
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
                    View the latest essays and blogs from various sources to stay up-to-date with the latest trends and insights in the tech industry.
                    <br />
                    <div className="text-zinc-300 border border-teal-600 p-3 max-w-fit mt-5 ">Feel free to add or suggest more sources to this list by creating a PR on the GitHub repository.</div>
                    <br />
                </div>


                {/* https://www.reddit.com/r/indiehackers/comments/qjkp7o/web_scraped_indiehackers_products_data_and/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button */}

                {/* https://data.crunchbase.com/docs/using-the-api */}
                {/* https://www.entrepreneur.com/latest.rss */}

                {/* https://rss.feedspot.com/entrepreneur_rss_feeds/ */}

                {/* https://www.techstars.com/ */}
                <Tabs defaultValue="paulGraham" className="space-y-6 ">
                    <TabsList className="flex flex-nowrap overflow-x-scroll overflow-y-hidden bg-gray-800 rounded-lg p-2 md:p-4 scrollbar-hide ">
                        <TabsTrigger
                            value="paulGraham"
                            className="flex-shrink-0 px-4 py-2 text-zinc-300 rounded-md hover:scale-105"
                        >
                            Paul Graham Essays
                        </TabsTrigger>
                        <TabsTrigger
                            value="simonWillison"
                            className="flex-shrink-0 px-4 py-2 text-zinc-300 rounded-md hover:scale-105"
                        >
                            Simon Willison&apos;s Blog
                        </TabsTrigger>
                        <TabsTrigger
                            value="techCrunch"
                            className="flex-shrink-0 px-4 py-2 text-zinc-300 rounded-md hover:scale-105"
                        >
                            TechCrunch
                        </TabsTrigger>
                        <TabsTrigger
                            value="entrepreneur"
                            className="flex-shrink-0 px-4 py-2 text-zinc-300 rounded-md hover:scale-105"
                        >
                            Entrepreneur(latest)
                        </TabsTrigger>
                        <TabsTrigger
                            value="githubTrending"
                            className="flex-shrink-0 px-4 py-2 text-zinc-300 rounded-md hover:scale-105"
                        >
                            GitHub Trending
                        </TabsTrigger>
                        <TabsTrigger
                            value="startupMagazine"
                            className="flex-shrink-0 px-4 py-2 text-zinc-300 rounded-md hover:scale-105"
                        >
                            The Startup Magazine
                        </TabsTrigger>

                    </TabsList>

                    <TabsContent value="paulGraham" className="p-4 bg-gray-800 rounded-lg max-w-7xl mx-auto">
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
                            <p className="text-gray-500 ml-1">
                                Coming soon 👀 ! Stay tuned for updates on TechCrunch&apos;s latest technology news and information on startups.
                                <br />
                                <br />
                                Working on it 🛠
                            </p>

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
                                    <h1 className="text-4xl font-bold mb-8">The Startup Magazine Feed</h1>
                                    {startupMagazineFeed.map((item: any) => (
                                        <FeedItem key={item.id} {...item} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Unable to load The Startup Magazine articles at this time.</p>
                            )}
                        </section>
                    </TabsContent>


                </Tabs>

                <div className="mt-12">
                    <UpdateButton />
                </div>
            </div>
        </main>
    );
}
