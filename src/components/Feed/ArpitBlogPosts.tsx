import { ArrowRight, Calendar } from 'lucide-react';

import React from 'react';
import { scrapeArpitBhayaniBlogPosts } from '@/app/feed/actions/getArpitBhayaniBlog';

export default async function BlogPosts() {
    const blogPosts = await scrapeArpitBhayaniBlogPosts();

    return (
        <div className="container min-h-screen bg-gradient-to-br  text-gray-100 min-w-7xl">
            <div className="py-16  sm:px-6 lg:px-8 w-full">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 py-6 text-slate-300">
                    Arpit Bhayani&apos;s Blog Posts
                </h1>
                <p className="text-sm  text-zinc-400 mx-auto mb-12">
                    Arpit is a software engineer and engineering leader passionate about{' '}
                    <span className="font-semibold text-teal-300">
                        System Architecture, Database Internals, Language Internals, and Advanced Algorithms.
                    </span>
                </p>

                <div className="space-y-3">
                    {blogPosts.map((post, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl  flex flex-col">
                            <div className="p-3 md:p-6 flex-grow">
                                <div className="flex items-center text-gray-400 text-sm mb-4">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{post.date}</span>
                                </div>
                                <h2 className="text-xl font-bold mb-4 line-clamp-2 hover:text-teal-300 transition-colors duration-200">
                                    <a
                                        href={`https://arpitbhayani.me${post.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline transition-all hover:scale-105"
                                    >
                                        {post.title}
                                    </a>
                                </h2>
                            </div>
                            <div className="px-6 pb-4">
                                <a
                                    href={`https://arpitbhayani.me${post.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                >
                                    Read more
                                    <ArrowRight size={16} className="ml-2" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-400">
                        All blog posts are written by Arpit Bhayani. Find more on his website.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        © {new Date().getFullYear()} Arpit Bhayani. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
