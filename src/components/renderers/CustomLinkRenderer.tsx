import Link from 'next/link';
import React from 'react';

const CustomLinkRenderer: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
    href = '',
    children,
    ...props
}) => {
    const isExternal = href.startsWith('http') || href.startsWith('https');

    return (
        <Link
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium text-xs hover:text-white"
            {...props}
        >
            {children}
            {isExternal && (
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            )}
        </Link>
    );
};

export default CustomLinkRenderer;
