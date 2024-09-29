"use client"

import React, { useEffect, useState } from 'react';

import Skeleton from '@/components/ui/skeleton';
import { motion } from "framer-motion"

interface Story {
    id: number;
    title: string;
    url: string;
    by: string;
    time: number;
    score: number;
}

const HackerNewsStories: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('https://hacker-news.firebaseio.com/v0/beststories.json');
                const storyIds = await response.json();

                const storyPromises = storyIds.slice(0, 50).map((id: number) =>
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
                );

                const fetchedStories = await Promise.all(storyPromises);
                setStories(fetchedStories);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stories:', error);
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    return (
        <div className="max-w-7xl mx-auto mt-12 p-1 md:p-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 py-6 text-slate-300">Top Hacker News Stories</h1>
            <p className="text-sm text-gray-500 mb-4 py-6">
                These are the top stories from the Hacker News section. You can find more stories on the <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors duration-300">Hacker News</a> website.
            </p>
            <ul className="space-y-8 border-l border-gray-700 p-1 rounded-md md:px-8">
                {loading ? (
                    Array(10).fill(0).map((_, index) => (
                        <li key={index} className="rounded-lg shadow-md p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                        </li>
                    ))
                ) : (
                    stories.map((story, index) => (
                        <motion.li
                            key={story.id}
                            className=" rounded-lg shadow-sm p-2 md:p-4 hover:shadow-md transition-shadow duration-300 border border-gray-800"
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
                    ))
                )}
            </ul>
        </div>
    );
};

export default HackerNewsStories;
