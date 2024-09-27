import { cn, truncateText } from '@/lib/utils';

import { CodeBlock } from '../EssaysList';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import React from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface Category {
    id: string;
    name: string;
}

export interface UniversalFeedItemProps {
    title: string;
    link?: string;
    pubDate: Date;
    contentSnippet: string;
    categories?: Category[];
    author?: string;
    imageUrl?: string;
    content?: string; // Optional full content
}

const UniversalFeedItem: React.FC<UniversalFeedItemProps> = ({
    title,
    link,
    pubDate,
    contentSnippet,
    categories = [],
    author,
    imageUrl,
    content,
}) => {
    return (
        <div className="transition-shadow duration-300 border border-gray-700 p-4 hover:bg-gradient-to-bl from-gray-700 to-gray-800 shadow-md rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">
                {link ? (
                    <Link href={link} className="text-lg md:font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        {title}
                    </Link>
                ) : (
                    title
                )}
            </h2>
            <p className="text-sm text-gray-400 my-2">
                Published on {pubDate?.toLocaleDateString()} {author && `by ${author}`}
            </p>
            {imageUrl && (
                <div className="mb-4">
                    <Image src={imageUrl} alt={title} className="w-full rounded-md" width={600} height={400} />
                </div>
            )}
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
            {link && (
                <Link href={link} className="text-teal-300 font-normal">
                    Read more →
                </Link>
            )}
        </div>
    );
};

export default UniversalFeedItem;
