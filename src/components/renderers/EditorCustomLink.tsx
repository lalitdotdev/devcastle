import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


const CustomLinkRenderer: React.FC<{ data: any; children?: React.ReactNode }> = ({ data, children }) => {
    const href = data.link || data.href || "";
    const meta = data.meta;
    const isInternal = href.startsWith('/') || href.startsWith('#');

    const linkContent = (
        <>
            {meta ? (
                <div className="link-card not-prose group flex flex-col sm:flex-row gap-4 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] max-w-2xl my-6">
                    {meta.image && (
                        <div className="relative w-full sm:w-48 h-32 sm:h-full min-h-[140px]">
                            <Image 
                                src={meta.image.url} 
                                alt={meta.title || ''} 
                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                fill
                                sizes="(max-width: 768px) 100vw, 192px"
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-center p-5 pe-6 flex-1 min-w-0">
                        <h3 className="line-clamp-2 text-[15px] font-semibold !text-white group-hover:!text-purple-400 transition-colors !break-all leading-snug" style={{ color: 'white' }}>
                            {meta.title || href}
                        </h3>
                        {meta.description && (
                            <p className="line-clamp-2 mt-2 text-[13px] !text-white/70 leading-relaxed break-words" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {meta.description}
                            </p>
                        )}
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-[10px] font-medium tracking-wider uppercase text-zinc-500 py-0.5 px-2 rounded-full border border-zinc-800 bg-zinc-900">
                                {new URL(href).hostname}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <span className="text-blue-400 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-200 underline underline-offset-4 decoration-current/30 hover:decoration-current transition-all duration-200 break-all">
                    {children || href}
                </span>
            )}
        </>
    );

    if (isInternal) {
        return (
            <Link href={href} className="inline-block transition-opacity hover:opacity-80">
                {linkContent}
            </Link>
        );
    }

    return (
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block transition-opacity hover:opacity-80"
        >
            {linkContent}
            <span className="sr-only">(opens in new tab)</span>
        </a>
    );
};

export default CustomLinkRenderer;
