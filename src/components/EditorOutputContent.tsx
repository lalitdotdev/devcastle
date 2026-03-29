"use client";

import { FC, useMemo } from "react";

import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dynamic from "next/dynamic";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Dynamically import custom renderers to avoid SSR issues
// Typed as `any` to avoid ReactNode conflict from @types/react-copy-to-clipboard's nested @types/react
const CustomCodeRenderer: any = dynamic(() => import("./renderers/CustomCodeRenderer"), { ssr: false });
const CustomImageRenderer: any = dynamic(() => import("./renderers/CustomImageRenderer"), { ssr: false });
const CustomLinkRenderer: any = dynamic(() => import("./renderers/EditorCustomLink"), { ssr: false });
const CustomAlertRenderer: any = dynamic(() => import("./renderers/CustomAlertRenderer"), { ssr: false });

const Output: any = dynamic(
    async () => (await import("editorjs-react-renderer")).default,
    { ssr: false }
);

interface EditorOutputContentProps {
    content: any;
}

// Renderers map

const MarkdownRenderer: FC<{ content: string }> = ({ content }) => (
    <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        className="break-words"
        components={{
            code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                    <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        className="rounded-lg !my-6"
                        PreTag="div"
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                    </code>
                )
            },
            a: ({ href, children }: any) => <CustomLinkRenderer href={href || ''}>{children}</CustomLinkRenderer>,
            p: ({ children }: any) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-[15px] text-muted-foreground">{children}</p>,
            h1: ({ children }: any) => <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-foreground">{children}</h1>,
            h2: ({ children }: any) => <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4 text-foreground">{children}</h2>,
            h3: ({ children }: any) => <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4 text-foreground">{children}</h3>,
            ul: ({ children }: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
            ol: ({ children }: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
            li: ({ children }: any) => <li className="text-[15px] leading-7">{children}</li>,
            blockquote: ({ children }: any) => <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">{children}</blockquote>,
        }}
    >
        {content}
    </ReactMarkdown>
);

const EditorOutputContent: FC<EditorOutputContentProps> = ({ content }) => {
    const processedContent = useMemo(() => {
        if (typeof content === "string") {
            try {
                return JSON.parse(content);
            } catch (e) {
                return {
                    blocks: [
                        {
                            type: "markdown",
                            data: { content },
                        },
                    ],
                };
            }
        }
        if (content && content.blocks && Array.isArray(content.blocks)) {
            return content;
        }
        return { blocks: [] };
    }, [content]);

    if (!processedContent || !processedContent.blocks) {
        return null;
    }

    return (
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
            <Output
                data={processedContent}
                renderers={{
                    image: CustomImageRenderer,
                    code: CustomCodeRenderer,
                    alert: CustomAlertRenderer,
                    linkTool: CustomLinkRenderer,
                    link: CustomLinkRenderer,
                    markdown: ({ data }: { data: { content: string } }) => <MarkdownRenderer content={data.content} />,
                    header: ({ data }: any) => {
                        const Tag = `h${data.level || 2}` as keyof JSX.IntrinsicElements;
                        const sizes: Record<number, string> = {
                            1: "text-3xl sm:text-4xl font-extrabold tracking-tight mb-8",
                            2: "text-2xl sm:text-3xl font-bold tracking-tight mb-6 mt-10",
                            3: "text-xl sm:text-2xl font-semibold tracking-tight mb-4 mt-8",
                            4: "text-lg sm:text-xl font-semibold tracking-tight mb-4 mt-6",
                        };
                        return (
                            <Tag className={`${sizes[data.level] || sizes[2]} text-zinc-100`}>
                                {data.text}
                            </Tag>
                        );
                    },
                    list: ({ data }: any) => {
                        const Tag = data.style === "ordered" ? "ol" : "ul";
                        return (
                            <Tag className={`my-6 ml-6 ${data.style === "ordered" ? "list-decimal" : "list-disc"} [&>li]:mt-2 text-zinc-300`}>
                                {data.items.map((item: string, i: number) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                ))}
                            </Tag>
                        );
                    },
                    quote: ({ data }: any) => (
                        <blockquote className="mt-8 mb-8 border-l-4 border-purple-500/50 pl-6 py-2 italic text-zinc-300 bg-purple-500/5 rounded-r-xl text-lg font-medium tracking-wide">
                            <p className="mb-2">&ldquo;{data.text}&rdquo;</p>
                            {data.caption && <footer className="text-sm text-zinc-500 not-italic">&mdash; {data.caption}</footer>}
                        </blockquote>
                    ),
                    table: ({ data }: any) => (
                        <div className="my-8 w-full overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                            <table className="w-full text-left text-sm text-zinc-300">
                                <tbody>
                                    {data.content.map((row: string[], rowIndex: number) => (
                                        <tr key={rowIndex} className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
                                            {row.map((cell: string, cellIndex: number) => (
                                                <td key={cellIndex} className="p-4" dangerouslySetInnerHTML={{ __html: cell }} />
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ),
                }}
            />
        </div>
    );
};

export default EditorOutputContent;
