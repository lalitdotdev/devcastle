import { cn, truncateText } from '@/lib/utils';

import { CodeBlock } from '../EssaysList';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from "react-markdown";
import React from 'react';
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Category {
    id: string;
    name: string;
}

export interface FeedItemProps {
    title: string;
    link: string;
    pubDate: Date;
    contentSnippet: string;
    categories: Category[];
    author: string;
    imageUrl: string;
}

const FeedItem: React.FC<FeedItemProps> = ({
    title,
    link,
    pubDate,
    contentSnippet,
    categories,
    author,
    imageUrl,
}) => {
    return (
        <div className="bg-zinc-900 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">
                <Link href={link} className="text-lg md:font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    {title}
                </Link>
            </h2>
            <p className="text-sm text-gray-400 my-2">
                Published on {pubDate.toLocaleDateString()} by {author}
            </p>
            <div className="mb-2">
                {categories.map((category) => (
                    <span
                        key={category.id}
                        className="inline-block mr-2 mb-2 px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-300 rounded-full"
                    >
                        {category.name}
                    </span>
                ))}
            </div>
            {contentSnippet && (
                <div className="text-sm text-gray-400 mt-2">
                    {/* Render truncated Markdown content */}
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            img: () => null, // Prevent rendering of images
                            code({ className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || "");
                                return match ? (
                                    <CodeBlock
                                        language={match[1]}
                                        value={String(children).replace(/\n$/, "")}
                                    />
                                ) : (

                                    <code className={cn("rounded-md bg-zinc-600 text-white p-1", className)} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {truncateText(contentSnippet, 600)}
                    </Markdown>
                </div>
            )}
            <Link href={link} className="text-teal-300 font-normal">
                Read more →
            </Link>
        </div>
    );
};

export default FeedItem;
