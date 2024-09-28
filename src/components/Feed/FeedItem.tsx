import { getAuthorName, truncateText } from '@/lib/utils';

import CustomLinkRenderer from '../renderers/CustomLinkRenderer';
import Link from 'next/link';
import Markdown from 'react-markdown';
import React from 'react';
import { motion } from 'framer-motion';
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
    content?: string;
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-700 mb-4  "
        >
            <div className="p-6 flex flex-col md:flex-row gap-6">

                <div className="md:w-3/4">
                    <h2 className="text-2xl font-bold mb-3 text-gray-100">
                        {link ? (
                            <Link href={link} className="text-lg md:font-semibold text-white hover:text-blue-300 transition-colors">
                                {title}
                            </Link>
                        ) : (
                            title
                        )}
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Published on {pubDate?.toLocaleDateString()} {getAuthorName(author) && `by ${getAuthorName(author)}`}
                    </p>
                    {content ? (
                        <div className="mb-4">
                            <Markdown
                                className="prose prose-sm max-w-none text-zinc-200 text-sm "
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    img: () => null,
                                    a: CustomLinkRenderer, // Use our custom link component
                                }}
                            >
                                {truncateText(content, 700)}
                            </Markdown>
                        </div>
                    ) : <div className="mb-4">
                        <Markdown
                            className="prose prose-sm max-w-none text-zinc-200"
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                img: () => null,
                                a: CustomLinkRenderer, // Use our custom link component
                            }}
                        >
                            {truncateText(contentSnippet, 700)}
                        </Markdown>
                    </div>}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors duration-200 hover:bg-blue-700"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UniversalFeedItem;
