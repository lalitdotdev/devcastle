import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DotPattern from "@/components/ui/dotbggradient";
import EssayList from "@/components/EssaysList";
import Link from "next/link";
import UpdateButton from "../_components/UpdateEssays";
import { cn } from "@/lib/utils";
import { getEntrepreneurFeed } from "@/app/feed/actions/getEntrepreneurFeed";
import { getEssays } from "../../actions";
import { getSimonWillisonFeed } from "@/app/feed/actions/getSimonWillisonFeed";

export default async function EssaysPage() {
    let paulGrahamEssays = [] as any;
    let simonWillisonEssays = [] as any;
    let entrepreneurEssays = [] as any;

    try {
        [paulGrahamEssays, simonWillisonEssays, entrepreneurEssays] = await Promise.all([
            getEssays(),
            getSimonWillisonFeed(),
            getEntrepreneurFeed()
        ]);
    } catch (error) {
        console.error("Error fetching essays:", error);
    }

    console.log(simonWillisonEssays)
    return (
        <main className="md:px-24 mx-auto md:p-12 max-w-screen-xl">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    '[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]',
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


                    </ul>
                    <br />
                    View the latest essays and blogs from various sources to stay up-to-date with the latest trends and insights in the tech industry.
                    <br />
                    <div className="text-teal-400 border border-teal-600 p-3 max-w-fit mt-5 ">Feel free to add or suggest more sources to this list by creating a PR on the GitHub repository.</div>
                    <br />
                </div>


                {/* https://www.reddit.com/r/indiehackers/comments/qjkp7o/web_scraped_indiehackers_products_data_and/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button */}

                {/* https://www.entrepreneur.com/latest.rss */}

                {/* https://rss.feedspot.com/entrepreneur_rss_feeds/ */}
                <Tabs defaultValue="paulGraham" className="space-y-6 bg-transparent">
                    <TabsList className=" md:gap-4 md:p-4 bg-gray-800 rounded-lg ">
                        <TabsTrigger value="paulGraham">Paul Graham Essays</TabsTrigger>
                        <TabsTrigger value="simonWillison">Simon Willison&apos;s Blog</TabsTrigger>
                        <TabsTrigger value="techCrunch">TechCrunch</TabsTrigger>
                        <TabsTrigger value="entrepreneur">Entrepreneur(latest)</TabsTrigger>

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
                                    <pre className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        <code>
                                            © 1985-2022 by Paul Graham. All rights reserved.
                                        </code>
                                    </pre>
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        A collection of essays by Y Combinator co-founder Paul Graham.
                                    </p>
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        This info is scraped from Aaron Swartz&apos;s
                                        <Link
                                            href="http://www.aaronsw.com/2002/feeds/pgessays.rss"
                                            className="underline ml-1 hover:text-blue-500"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            RSS Feed
                                        </Link>.
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


                </Tabs>

                <div className="mt-12">
                    <UpdateButton />
                </div>
            </div>
        </main>
    );
}
