// app/essays/EssayList.tsx
"use client"

import { Category, Essay } from "@prisma/client";

import { motion } from "framer-motion";

type EssayWithCategories = Essay & { categories: Category[] };

interface EssayListProps {
    essays: EssayWithCategories[];
}

export default function EssayList({ essays }: EssayListProps) {
    return (
        <ul className="grid gap-2 md:border-l md:px-4 border-gray-700 rounded-md ">
            {essays.map((essay, index) => (
                <motion.li
                    key={essay.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="rounded-lg overflow-hidden  hover:shadow-2xl transition-shadow duration-300 border border-gray-700"
                >
                    <div className="p-3">
                        <a
                            href={essay.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg md:font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {essay.title}
                            {essay.contentSnippet && (
                                <p className="text-sm text-gray-400 mt-2">
                                    {essay.contentSnippet}
                                </p>
                            )}
                        </a>

                        {
                            essay.pubDate && (
                                <p className="text-sm text-gray-400 mt-2">
                                    {new Date(essay.pubDate).toDateString()}
                                </p>
                            )
                        }
                        {/* <p className="text-sm text-gray-400 mt-2">
                            {new Date(essay.pubDate).toLocaleDateString()}
                        </p> */}

                        {essay.description && <p className="mt-4 text-gray-300">{essay.description}</p>}
                        {essay.categories.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {essay.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-300 rounded-full"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.li>
            ))
            }
        </ul >
    );
}
