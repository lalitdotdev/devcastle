"use client"

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import Skeleton from '@/components/ui/skeleton';
import { motion } from "framer-motion";

interface Story {
    id: number;
    title: string;
    url: string;
    by: string;
    time: number;
    score: number;
}

const JobsTimelineStories: React.FC = () => {
    const [allStoryIds, setAllStoryIds] = useState<number[]>([]);
    const [stories, setStories] = useState<Story[]>([]);
    const [loadingIds, setLoadingIds] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const pageSize = 25;

    const fetchNextBatch = React.useCallback(async (ids: number[], currentOffset: number) => {
        setLoadingMore(true);
        try {
            const nextBatchIds = ids.slice(currentOffset, currentOffset + pageSize);
            const storyPromises = nextBatchIds.map((id: number) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
            );

            const fetchedStories = await Promise.all(storyPromises);
            setStories(prevStories => [...prevStories, ...fetchedStories]);
            setOffset(currentOffset + pageSize);
        } catch (error) {
            console.error('Error fetching story batch:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [pageSize]);

    const fetchAllIds = React.useCallback(async () => {
        setLoadingIds(true);
        try {
            const response = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json');
            const storyIds = await response.json();
            setAllStoryIds(storyIds);

            // Fetch initial batch
            await fetchNextBatch(storyIds, 0);
        } catch (error) {
            console.error('Error fetching story IDs:', error);
        } finally {
            setLoadingIds(false);
        }
    }, [fetchNextBatch]);

    useEffect(() => {
        fetchAllIds();
    }, [fetchAllIds]);

    const loadMore = () => {
        if (allStoryIds.length > offset) {
            fetchNextBatch(allStoryIds, offset);
        }
    };

    const hasMore = allStoryIds.length > offset;

    return (
        <div className="max-w-7xl mx-auto mt-12 p-1 md:p-3">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 py-6 text-slate-300">Top Jobs Timeline Stories</h1>
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl mb-8">
                <p className="text-sm text-gray-400">
                    Get a glimpse of the top stories from the Jobs Timeline section. You can find more stories on the <a href="https://news.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 underline transition-colors duration-300">Jobs Timeline</a> website.
                    <br /> <br />
                    Note: The Jobs Timeline section is a curated list of the top stories from the Hacker News section. It is not a comprehensive list of all the jobs stories.
                </p>
            </div>

            <ul className="space-y-6 border-l-2 border-slate-800 ml-4 md:ml-6 pl-6 md:pl-10">
                {stories.map((story, index) => (
                    <motion.li
                        key={`${story.id}-${index}`}
                        className="relative"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (index % pageSize) * 0.05 }}
                    >
                        <div className="absolute -left-[43px] md:-left-[59px] mt-1.5 h-4 w-4 rounded-full bg-slate-800 border-2 border-blue-500" />
                        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:bg-slate-800/40 transition-all duration-300">
                            <a
                                href={story.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors duration-300"
                            >
                                {story.title}
                            </a>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 mt-3">
                                <span className="flex items-center gap-1">
                                    <span className="text-slate-500 italic">By</span> {story.by}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                <span className="flex items-center gap-1">
                                    <span className="text-slate-500">Score</span> {story.score}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-700" />
                                <span className="flex items-center gap-1">
                                    <span className="text-slate-500">Posted</span> {new Date(story.time * 1000).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </motion.li>
                ))}
            </ul>

            {(loadingIds || loadingMore) && (
                <div className="space-y-4 mt-8 ml-4 md:ml-6 pl-6 md:pl-10">
                    {Array(3).fill(0).map((_, index) => (
                        <div key={index} className="bg-slate-900/20 border border-slate-800/50 rounded-xl p-5 animate-pulse">
                            <Skeleton className="h-5 w-2/3 mb-4 bg-slate-800" />
                            <Skeleton className="h-3 w-1/3 bg-slate-800" />
                        </div>
                    ))}
                </div>
            )}

            {!loadingIds && hasMore && (
                <div className="mt-12 text-center pb-12">
                    <Button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 px-10 rounded-full text-lg shadow-xl shadow-blue-900/20 transition-all hover:scale-105"
                    >
                        {loadingMore ? 'Loading More Stories...' : 'Load More Jobs'}
                    </Button>
                </div>
            )}

            {!loadingIds && !hasMore && stories.length > 0 && (
                <p className="mt-12 text-center text-slate-500 py-12 italic">
                    You&apos;ve reached the end of the timeline.
                </p>
            )}
        </div>
    );
};

export default JobsTimelineStories;
