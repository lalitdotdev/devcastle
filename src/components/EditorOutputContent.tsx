"use client";

import { FC, useMemo } from "react";

import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import dynamic from "next/dynamic";
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Dynamically import custom renderers to avoid SSR issues
const CustomCodeRenderer = dynamic(() => import("./renderers/CustomCodeRenderer"), { ssr: false });
const CustomImageRenderer = dynamic(() => import("./renderers/CustomImageRenderer"), { ssr: false });
const CustomLinkRenderer = dynamic(() => import("./renderers/EditorCustomLink"), { ssr: false });
const CustomAlertRenderer = dynamic(() => import("./renderers/CustomAlertRenderer"), { ssr: false });

const Output = dynamic(
    async () => (await import("editorjs-react-renderer")).default,
    { ssr: false }
);

interface EditorOutputContentProps {
    content: any;
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
    alert: CustomAlertRenderer,
    linkTool: CustomLinkRenderer,
};

const style = {
    paragraph: {
        fontSize: "0.95rem",
        lineHeight: "1.25rem",
        color: "#BFC3CAFF",
        fontWeight: 400,
        fontFamily: "Arial, sans-serif",
        letterSpacing: "-0.01em",
        marginTop: "1rem",
        marginBottom: "1rem",
    },
};

const MarkdownRenderer: FC<{ content: string }> = ({ content }) => (
    <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
            code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                    <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                )
            },
            a: ({ href, children }) => <CustomLinkRenderer href={href || ''}>{children}</CustomLinkRenderer>,
        }}
        className="text-sm"
    >
        {content}
    </ReactMarkdown>
);

const EditorOutputContent: FC<EditorOutputContentProps> = ({ content }) => {
    const processedContent = useMemo(() => {
        if (typeof content === 'string') {
            return { blocks: [{ type: 'markdown', data: { content } }] };
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
        <Output
            data={processedContent}
            style={style}
            className="text-sm"
            renderers={{
                ...renderers,
                markdown: ({ data }: { data: { content: string } }) => <MarkdownRenderer content={data.content} />,
                linkTool: ({ data }: { data: any }) => <CustomLinkRenderer href={data.link}>{data.meta?.title || data.link}</CustomLinkRenderer>,
                alert: ({ data }: { data: any }) => <CustomAlertRenderer type={data.type} message={data.message} />,

            }}
        />
    );
};

export default EditorOutputContent;
