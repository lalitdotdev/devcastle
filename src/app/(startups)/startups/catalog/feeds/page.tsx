"use client";

import { BarChart, Lightbulb, LucideIcon, Rss } from "lucide-react";
import { Github, fetchGithubTrending } from "@/app/feed/actions/fetchGithubTrending";
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import AddFeedDialog from "@/components/Feed/UrlFeedFormDialog";
import DotPattern from "@/components/ui/dotbggradient";
import EssayList from "@/components/EssaysList";
import FeedItem from "@/components/Feed/StartupMagazineFeedItem";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "@/components/ui/skeleton";
import TrendingRepoList from "@/components/TredingRepoList";
import UniversalFeedItem from "@/components/Feed/FeedItem";
import { cn } from "@/lib/utils";
import { getEntrepreneurFeed } from "@/app/feed/actions/getEntrepreneurFeed";
import { getEssays } from "../../actions";
import { getSimonWillisonFeed } from "@/app/feed/actions/getSimonWillisonFeed";
import { getStartupMagazineFeed } from "@/app/feed/actions/getStartupMagazineFeed";
import { getTechCrunchFeed } from "@/app/feed/actions/getTechcrunchFeed";
import { motion } from "framer-motion";

// Import the loading skeleton
interface TabItem {
    value: string;
    icon?: string | LucideIcon;
    label: string;
}

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



export default function FeedPage() {
    const [urlCustomfeeds, setUrlCustomfeeds] = useState<FeedItem[]>(() => {
        const storedFeeds = localStorage.getItem('urlCustomFeedItems');
        return storedFeeds ? JSON.parse(storedFeeds) : [];
    });

    const [customFeedName, setCustomFeedName] = useState<string>(() => {
        return localStorage.getItem('urlCustomFeedName') || 'Custom Feed';
    });

    const [paulGrahamEssays, setPaulGrahamEssays] = useState([]);
    const [simonWillisonEssays, setSimonWillisonEssays] = useState([]);
    const [entrepreneurEssays, setEntrepreneurEssays] = useState([]);
    const [githubTrendingRepos, setGithubTrendingRepos] = useState<Github[]>([]);

    const [startupMagazineFeed, setStartupMagazineFeed] = useState([]);
    const [techCrunchFeed, setTechCrunchFeed] = useState([]);


    // Loading state
    const [isLoading, setIsLoading] = useState(true);
    const tabItems: TabItem[] = [
        { value: "techCrunch", icon: "/logo/tc.svg", label: "TechCrunch" },
        { value: "entrepreneur", icon: Lightbulb, label: "Entrepreneur" },
        { value: "startupMagazine", icon: BarChart, label: "The Startup Magazine" },
        { value: "paulGraham", icon: Rss, label: "Paul Graham Essays" },
        { value: "simonWillison", label: "Simon Willison's Blog" },
        { value: "githubTrending", icon: "/logo/github.svg", label: "GitHub Trending" },




    ];
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


            const storedFeeds = localStorage.getItem('urlCustomFeedItems');
            if (storedFeeds) {
                setUrlCustomfeeds(JSON.parse(storedFeeds));
            }

            // Fetch custom feed name from localStorage
            const storedName = localStorage.getItem('urlCustomFeedName');
            if (storedName) {
                setCustomFeedName(storedName);
            }
            setIsLoading(false); // Set loading state to false
        };

        fetchData();
    }, []);
    const handleFeedAdded = (newFeed: any, feedName: string) => {
        // console.log(newFeed, feedName);

    };
    // console.log(">>>>> urlCustomfeeds", urlCustomfeeds);
    // console.log(">> paulGrahamEssays", paulGrahamEssays);


    const tabListRef = useRef<HTMLDivElement | null>(null); // Explicitly type the ref
    const [isTabListFixed, setIsTabListFixed] = useState(false);
    const [tabListHeight, setTabListHeight] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (tabListRef.current) {
                const tabListTop = tabListRef.current.offsetTop;
                const scrollPosition = window.scrollY;
                setIsTabListFixed(scrollPosition > tabListTop);
            }
        };

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setTabListHeight(entry.contentRect.height);
            }
        });

        if (tabListRef.current) {
            resizeObserver.observe(tabListRef.current);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <main className="min-h-screen ">

            <div className="max-w-7xl mx-auto py-16">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn(
                        '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
                    )}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-12"
                >
                    <header className="">
                        <h1 className="text-5xl md:text-7xl font-extrabold mt-8 bg-clip-text text-transparent gradient-text animate-gradient font-sans">
                            Feed Reader
                        </h1>
                        <p className="text-lg text-zinc-500 max-w-2xl ">
                            Your gateway to curated content from the tech and startup world
                        </p>
                    </header>


                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                        initial="hidden"
                        animate="show"
                    >
                        {['Paul Graham Essays', 'Simon Willison\'s Blog', 'TechCrunch', 'Entrepreneur', 'GitHub Trending', 'The Startup Magazine', `${customFeedName}`].map((item) => (
                            <motion.div
                                key={item}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                className="border bg-gradient text-black rounded-lg p-2 hover:bg-gray-600 hover:text-white transition-colors duration-300"
                            >
                                {item}

                            </motion.div>


                        ))}
                    </motion.div>
                    <ScrollArea>
                        <Tabs defaultValue="urlFeed" className="w-full">
                            {/* Placeholder div to prevent content jump when tabList is fixed */}
                            {isTabListFixed && <div style={{ height: `${tabListHeight}px` }} />}



                            <div
                                ref={tabListRef}
                                className={`bg-[#1B1F23] py-2 ${isTabListFixed ? 'fixed left-0 right-0 z-10 max-w-fit mx-auto' : ''} ${isTabListFixed ? 'md:top-20 bottom-2 md:bottom-auto' : ''}`}
                            >
                                <ScrollArea className="whitespace-nowrap border-zinc-700 border rounded-full">
                                    <TabsList className="inline-flex h-10 md:h-12 items-center justify-center bg-gray-700 p-2 rounded-full">
                                        {tabItems.map(({ value, icon, label }) => (
                                            <TabsTrigger
                                                key={value}
                                                value={value}
                                                className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:bg-purple-600 hover:text-white"
                                            >
                                                {icon && (
                                                    typeof icon === 'string' ? (
                                                        <Image src={icon} width={20} height={20} alt={label} className="mr-2" />
                                                    ) : (
                                                        React.createElement(icon as React.ComponentType<{ className: string }>, { className: "mr-2 h-5 w-5" })
                                                    )
                                                )}
                                                {label}
                                            </TabsTrigger>
                                        ))}

                                        <TabsTrigger
                                            value="urlFeed"
                                            className={`inline-flex ${urlCustomfeeds?.length > 0 ? "bg-lime-600 text-white rounded-full " : "bg-gray-700 text-zinc-100"}`}
                                        >
                                            {urlCustomfeeds?.length > 0 ?
                                                <div className="flex items-center gap-2">
                                                    {customFeedName}
                                                </div> : (
                                                    <AddFeedDialog onFeedAdded={(newFeed, feedName) => handleFeedAdded(newFeed, feedName)} />
                                                )}
                                        </TabsTrigger>
                                    </TabsList>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>




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
                                            <ul key={index} className="list-none">
                                                <li className="rounded-lg shadow-md p-4 ">
                                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </li>
                                            </ul>
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
                                    {/* <h1>Fetched {urlCustomfeeds?.length} RSS Feeds from {customFeedName}</h1> */}
                                    <div className="flex p-2  bg-gray-600 text-white rounded-lg my-4 justify-between mx-auto text-lg">
                                        <Rss className="h-6 w-6" />
                                        {customFeedName}
                                    </div>




                                    {isLoading ? ( // Check if loading
                                        Array(10).fill(0).map((_, index) => (
                                            <li key={index} className="rounded-lg shadow-md p-4">
                                                <Skeleton className="h-4 w-3/4 mb-2" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </li>
                                        )) // Display the loading skeleton
                                    ) : (
                                        <>
                                            {urlCustomfeeds?.length > 0 ? (

                                                // Map over each feed item and display using the FeedItem component from the Feed folder
                                                urlCustomfeeds.map((feed) => (
                                                    <UniversalFeedItem
                                                        key={feed.id} // Assuming the ID is the permalink
                                                        title={feed.title}
                                                        link={feed.link}
                                                        pubDate={new Date(feed.pubDate)} // Convert to Date object
                                                        contentSnippet={feed.contentSnippet}
                                                        categories={feed.categories || []} // Provide a default empty array if categories are undefined
                                                        author={feed.author} // Extracting author name correctly
                                                        imageUrl={feed.imageUrl}
                                                        content={feed.content}
                                                    />
                                                ))

                                            ) : (
                                                <p className="text-gray-500">Publication or Blog(Beta)</p>


                                            )}
                                        </>
                                    )}
                                </section>
                            </TabsContent>

                        </Tabs>
                    </ScrollArea>
                </motion.div>
            </div >

        </main >
    );
}
