import CustomLinkRenderer from "../renderers/CustomLinkRenderer";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
    children: string;
}


export default function Markdown({ children }: MarkdownProps) {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            className="space-y-3 container mx-auto"
            components={{
                ul: (props) => <ul className="list-disc marker:text-emerald-400 marker:text-lg sm:border p-10 border-gray-700 space-y-1" {...props} />,
                a: ({ href, children }) => <CustomLinkRenderer href={href || ''}>{children}</CustomLinkRenderer>,



            }}
        >
            {children}
        </ReactMarkdown>
    );
}
