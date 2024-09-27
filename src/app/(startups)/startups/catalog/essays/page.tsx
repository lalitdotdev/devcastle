"use client";

import { BarChart, Lightbulb, Rss } from "lucide-react";
import { Github, fetchGithubTrending } from "@/app/feed/actions/fetchGithubTrending";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useEffect, useState } from 'react';

import AddFeedDialog from "@/components/Feed/UrlFeedFormDialog";
import DotPattern from "@/components/ui/dotbggradient";
import EssayList from "@/components/EssaysList";
import FeedItem from "@/components/Feed/StartupMagazineFeedItem";
import Image from "next/image";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Skeleton from "@/components/ui/skeleton";
import TrendingRepoList from "@/components/TredingRepoList";
import UniversalFeedItem from "@/components/Feed/FeedItem";
import UpdateButton from "../_components/UpdateEssays";
import { cn } from "@/lib/utils";
import { getEntrepreneurFeed } from "@/app/feed/actions/getEntrepreneurFeed";
import { getEssays } from "../../actions";
import { getSimonWillisonFeed } from "@/app/feed/actions/getSimonWillisonFeed";
import { getStartupMagazineFeed } from "@/app/feed/actions/getStartupMagazineFeed";
import { getTechCrunchFeed } from "@/app/feed/actions/getTechcrunchFeed";

// Import the loading skeleton

export interface FeedItem {
    id: string; // Unique identifier for the feed item, either guid or link
    title: string; // Title of the feed item
    link?: string; // URL link to the feed item
    pubDate: Date; // Publication date
    contentSnippet: string; // Snippet or summary of the content
    categories: { id: string; name: string }[]; // Array of categories
    content: string; // Full content, if available
    author?: string; // Author of the feed item, if applicable
    imageUrl?: string; // Image URL, if available
}

export default function EssaysPage() {
    const [urlCustomfeeds, setUrlCustomfeeds] = useState<FeedItem[]>([]); // Manage feeds state
    const [paulGrahamEssays, setPaulGrahamEssays] = useState([]);
    const [simonWillisonEssays, setSimonWillisonEssays] = useState([]);
    const [entrepreneurEssays, setEntrepreneurEssays] = useState([]);
    const [githubTrendingRepos, setGithubTrendingRepos] = useState<Github[]>([]);

    const [startupMagazineFeed, setStartupMagazineFeed] = useState([]);
    const [techCrunchFeed, setTechCrunchFeed] = useState([]);

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all the essay data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading state to true
            const essaysData = await getEssays();
            const simonData = await getSimonWillisonFeed();
            const entrepreneurData = await getEntrepreneurFeed();
            const githubData = await fetchGithubTrending();
            const startupData = await getStartupMagazineFeed();
            const techCrunchData = await getTechCrunchFeed();

            setPaulGrahamEssays(essaysData as any);
            setSimonWillisonEssays(simonData);
            setEntrepreneurEssays(entrepreneurData as any);
            setGithubTrendingRepos(githubData);
            setStartupMagazineFeed(startupData);
            setTechCrunchFeed(techCrunchData);
            setIsLoading(false); // Set loading state to false
        };

        fetchData();
    }, []);

    console.log(urlCustomfeeds)


    // Function to handle adding a new feed
    const handleFeedAdded = (newFeed: any) => {
        setUrlCustomfeeds((prevFeeds) => {
            // Ensure newFeed.items exists and is an array
            const feedItems = Array.isArray(newFeed.items) ? newFeed.items : [];

            const formattedItems = feedItems.map((item: any) => ({
                id: item.guid || item.link,
                title: item.title,
                link: item.link,
                pubDate: new Date(item.pubDate),
                contentSnippet: item.contentSnippet || item.description,
                categories: item.categories ? item.categories.map((cat: string) => ({ id: cat, name: cat })) : [],
                content: item.content,
                author: item.author,
                imageUrl: item.enclosure?.url || '',
            }));

            const updatedFeeds = [...prevFeeds, ...formattedItems];
            console.log(updatedFeeds); // Log the updated feeds
            return updatedFeeds;
        });
    };

    console.log(urlCustomfeeds)

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
                                value="urlFeed"
                                className=" inline-flex"
                            >
                                <AddFeedDialog onFeedAdded={handleFeedAdded} />
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    <TabsContent value="paulGraham" className="p-4 bg-gray-800 rounded-lg mx-auto">
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
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : paulGrahamEssays.length > 0 ? (
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
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : simonWillisonEssays.length > 0 ? (
                                <EssayList essays={simonWillisonEssays} />
                            ) : (
                                <p className="text-gray-500">Unable to load Simon Willison essays at this time.</p>
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
                                        Latest articles from Entrepreneur.
                                    </p>
                                </Link>
                            </div>
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : entrepreneurEssays.length > 0 ? (
                                <EssayList essays={entrepreneurEssays} />
                            ) : (
                                <p className="text-gray-500">Unable to load Entrepreneur articles at this time.</p>
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
                                        Latest news from TechCrunch.
                                    </p>
                                </Link>
                            </div>
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : techCrunchFeed.length > 0 ? (
                                <EssayList essays={techCrunchFeed} />
                            ) : (
                                <p className="text-gray-500">Unable to load TechCrunch articles at this time.</p>
                            )}
                        </section>
                    </TabsContent>

                    <TabsContent value="startupMagazine" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            <div className="flex flex-col gap-6 py-8">
                                <Link
                                    href="https://thestartupmagazine.com/"
                                    className="group p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                        Articles from The Startup Magazine.
                                    </p>
                                </Link>
                            </div>
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : startupMagazineFeed.length > 0 ? (
                                <EssayList essays={startupMagazineFeed} />
                            ) : (
                                <p className="text-gray-500">Unable to load Startup Magazine articles at this time.</p>
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
                                        Trending repositories on GitHub.
                                    </p>
                                </Link>
                            </div>
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : githubTrendingRepos.length > 0 ? (
                                <TrendingRepoList repos={githubTrendingRepos} />
                            ) : (
                                <p className="text-gray-500">Unable to load GitHub trending repositories at this time.</p>
                            )}
                        </section>
                    </TabsContent>

                    <TabsContent value="urlFeed" className="p-4 bg-gray-800 rounded-lg">
                        <section>
                            {isLoading ? ( // Check if loading
                                Array(10).fill(0).map((_, index) => (
                                    <li key={index} className="rounded-lg shadow-md p-4">
                                        <Skeleton className="h-4 w-3/4 mb-2" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </li>
                                )) // Display the loading skeleton
                            ) : urlCustomfeeds.length > 0 ? (
                                // map over each feed item and display using the FeedItem component from the Feed folder
                                urlCustomfeeds.map((feed) => (
                                    <UniversalFeedItem key={feed.id} {...feed} />
                                ))
                            ) : (
                                <p className="text-gray-500">Unable to load feed.</p>
                            )}
                        </section>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
