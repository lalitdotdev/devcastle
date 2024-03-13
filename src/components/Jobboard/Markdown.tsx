import ReactMarkdown from "react-markdown";

interface MarkdownProps {
    children: string;
}

export default function Markdown({ children }: MarkdownProps) {
    return (
        <ReactMarkdown
            className="space-y-3 p-2  md:p-8 border-2 border-gray-600 rounded-md text-neutral-300"
            components={{
                ul: (props) => <ul className="list-inside list-disc marker:text-blue-600 marker:text-lg " {...props} />,
                a: (props) => (
                    <a className="text-green-500 underline" target="_blank" {...props} />
                ),

            }}
        >
            {children}
        </ReactMarkdown>
    );
}
