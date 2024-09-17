"use client";

import { Category, Essay } from "@prisma/client";

import Link from "next/link";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "@/lib/utils";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

// Type for essay with categories
type EssayWithCategories = Essay & { categories: Category[] };

interface EssayListProps {
    essays: EssayWithCategories[];
}

interface CodeBlockProps {
    language: string;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    return (
        <SyntaxHighlighter
            style={materialDark}
            language={language}
            PreTag="div"

        >
            {value}
        </SyntaxHighlighter>
    );
};

// Utility to truncate long text
const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

export default function EssayList({ essays }: EssayListProps) {
    return (
        <ul className="grid gap-4 md:border-l md:px-4 border-gray-700 rounded-md">
            {essays.map((essay) => (
                <motion.li
                    key={essay.id + essay.title + essay.link}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-700 p-4 hover:bg-gradient-to-bl from-gray-700 to-gray-800"
                >
                    <Link href={essay.link} target="_blank" rel="noopener noreferrer">
                        <div className="text-lg md:font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            {essay.title}
                        </div>

                        {essay.contentSnippet && (
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
                                                <code className={cn("rounded-md bg-zinc-600 text-white p-1", className)} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {truncateText(essay.contentSnippet, 600)}
                                </Markdown>
                            </div>
                        )}

                        {essay.pubDate && (
                            <p className="text-sm text-gray-400 mt-2">
                                {new Date(essay.pubDate).toDateString()}
                            </p>
                        )}

                        {essay.description && (
                            <p className="mt-4 text-gray-300">
                                {truncateText(essay.description, 300)}
                            </p>
                        )}

                        {/* Display Categories */}
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
                    </Link>
                </motion.li>
            ))}
        </ul>
    );
}
