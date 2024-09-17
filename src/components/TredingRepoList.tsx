"use client"

// Assuming your `Github` interface is stored in types

import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";
// import { formatNumber } from "@/lib/utils";
// Utility function to format stars
import { motion } from "framer-motion";

interface Github {
    title: string;
    description: string;
    url: string;
    stars: string;
}

interface TrendingRepoListProps {
    repos: Github[];
}

export default function TrendingRepoList({ repos }: TrendingRepoListProps) {
    return (
        <ul className="grid gap-4 md:border-l md:px-4 border-gray-700 rounded-md">
            {repos.map((repo) => (
                <motion.li
                    key={repo.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-700 p-4 hover:bg-gradient-to-bl from-gray-700 to-gray-800"
                >
                    <Link href={repo.url} target="_blank" rel="noopener noreferrer">
                        <div className="text-lg md:font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            {repo.title}
                        </div>

                        {repo.description && (
                            <div className="text-sm text-gray-400 mt-2">
                                {repo.description}
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-teal-400 text-sm flex items-center justify-center gap-2"><Star />{repo.stars}</span>
                            <span className="text-teal-500 text-sm">View on GitHub</span>
                        </div>
                    </Link>
                </motion.li>
            ))}
        </ul>
    );
}
