"use client";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";

export default function Clipboard() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <CopyToClipboard text="mailfor.lalitsharma@gmail.com" onCopy={handleCopy}>
            <span className="leading-tighter text-light-gray  font-light cursor-pointer hover:underline">
                {copied ? "Copied to clipboard!" : "mailfor.lalitsharma@gmail.com"}
            </span>
        </CopyToClipboard>
    );
}
