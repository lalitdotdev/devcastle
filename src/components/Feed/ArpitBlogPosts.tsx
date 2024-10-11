import { ArrowRight, BookOpen, Calendar } from 'lucide-react';

import React from 'react';
import { scrapeArpitBhayaniBlogPosts } from '@/app/feed/actions/getArpitBhayaniBlog';

export default async function BlogPosts() {
    const blogPosts = await scrapeArpitBhayaniBlogPosts();

    return (
        <div className="min-h-screen  text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className=" mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-cyan-400 animate-gradient">
                        Arpit Bhayani&apos;s Insights
                    </h1>
                    <p className="text-lg text-zinc-400 ">
                        Explore the world of{' '}
                        <span className="font-semibold text-teal-300">
                            System Architecture, Database Internals, Language Internals, and Advanced Algorithms
                        </span>{' '}
                        through the eyes of a passionate software engineer and engineering leader.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogPosts.map((post, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                            <div className="p-6 flex-grow">
                                <div className="flex items-center text-teal-400 text-sm mb-4">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{post.date}</span>
                                </div>
                                <h2 className="text-xl font-bold mb-4 line-clamp-2 hover:text-teal-300 transition-colors duration-200">
                                    <a
                                        href={`https://arpitbhayani.me${post.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {post.title}
                                    </a>
                                </h2>
                            </div>
                            <div className="px-6 py-4 bg-gray-700 bg-opacity-50">
                                <a
                                    href={`https://arpitbhayani.me${post.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-200 group"
                                >
                                    <span className="mr-2">Read article</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a
                        href="https://arpitbhayani.me/blogs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-500 transition-colors duration-200"
                    >
                        <BookOpen size={20} className="mr-2" />
                        Explore All Articles
                    </a>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-400">
                        All blog posts are written by Arpit Bhayani. Discover more on his website.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        © {new Date().getFullYear()} Arpit Bhayani. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
