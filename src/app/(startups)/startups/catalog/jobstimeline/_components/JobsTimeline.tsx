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
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastItemId, setLastItemId] = useState<number | null>(null);

    const fetchStories = async (startAfter: number | null = null) => {
        setLoading(true);
        try {
            let url = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
            if (startAfter) {
                url = `https://hacker-news.firebaseio.com/v0/jobstories.json?orderBy="$key"&startAt="${startAfter}"&limitToFirst=31`;
            }
            const response = await fetch(url);
            const storyIds = await response.json();

            const storyPromises = storyIds.slice(0, 62).map((id: number) =>
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
            );

            const fetchedStories = await Promise.all(storyPromises);
            if (startAfter) {
                setStories(prevStories => [...prevStories, ...fetchedStories]);
            } else {
                setStories(fetchedStories);
            }
            setLastItemId(storyIds[storyIds.length - 1]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stories:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const loadMore = () => {
        if (lastItemId) {
            fetchStories(lastItemId);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 p-1 md:p-3">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 py-6 text-slate-300">Top Jobs Timeline Stories</h1>
            <p className="text-sm text-gray-500 mb-4 py-6">
                Get a glimpse of the top stories from the Jobs Timeline section. You can find more stories on the <a href="https://news.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Jobs Timeline</a> website.
                <br /> <br />
                Note: The Jobs Timeline section is a curated list of the top stories from the Hacker News section. It is not a comprehensive list of all the jobs stories.
            </p>
            <ul className="space-y-8 border-l p-1 border-gray-700 md:px-4 rounded-md">
                {stories.map((story, index) => (
                    <motion.li
                        key={story.id}
                        className="rounded-lg shadow-sm p-2 md:p-4 hover:shadow-md transition-shadow duration-300 border-l border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <a
                            href={story.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300"
                        >
                            {story.title}
                        </a>
                        <p className="text-sm text-gray-600 mt-2">
                            By: <span className="font-medium">{story.by}</span> |
                            Score: <span className="font-medium">{story.score}</span> |
                            Time: <span className="font-medium">{new Date(story.time * 1000).toLocaleString()}</span>
                        </p>
                    </motion.li>
                ))}
            </ul>
            {loading && (
                <div className="space-y-4 mt-8">
                    {Array(5).fill(0).map((_, index) => (
                        <div key={index} className="rounded-lg shadow-md p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />

                        </div>
                    ))}
                </div>
            )}
            {lastItemId && (
                <div className="mt-8 text-center">
                    <Button
                        onClick={loadMore}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default JobsTimelineStories;
