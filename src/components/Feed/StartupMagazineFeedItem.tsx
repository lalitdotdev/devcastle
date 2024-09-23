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
        <div className="bg-zinc-700 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">
                <Link href={link} className="text-blue-600 hover:text-blue-800">
                    {title}
                </Link>
            </h2>
            <p className="text-gray-600 mb-2">
                Published on {pubDate.toLocaleDateString()} by {author}
            </p>
            <div className="mb-2">
                {categories.map((category) => (
                    <span
                        key={category.id}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
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
                            code({ className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || "");
                                return match ? (
                                    <CodeBlock
                                        language={match[1]}
                                        value={String(children).replace(/\n$/, "")}
                                    />
                                ) : (
                                    <></>
                                    // <code className={cn("rounded-md bg-zinc-600 text-white p-1", className)} {...props}>
                                    //     {children}
                                    // </code>
                                );
                            },
                        }}
                    >
                        {truncateText(contentSnippet, 600)}
                    </Markdown>
                </div>
            )}
            <Link href={link} className="text-blue-600 hover:text-blue-800 font-semibold">
                Read more →
            </Link>
        </div>
    );
};

export default FeedItem;
