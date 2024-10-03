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
            className="space-y-3 p-2  md:p-8 border-2 border-gray-600 rounded-md text-neutral-300"

            components={{
                ul: (props) => <ul className="list-inside list-disc marker:text-blue-600 marker:text-lg " {...props} />,
                a: ({ href, children }) => <CustomLinkRenderer href={href || ''}>{children}</CustomLinkRenderer>,



            }}
        >
            {children}
        </ReactMarkdown>
    );
}
