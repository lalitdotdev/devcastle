import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface CustomLinkRendererProps {
    href: string;
    children?: React.ReactNode;
    meta?: {
        title?: string;
        description?: string;
        image?: {
            url: string;
        };
    };
}

const CustomLinkRenderer: React.FC<CustomLinkRendererProps> = ({ href, children, meta }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#');

    const linkStyle = {
        color: '#3b82f6', // blue-500
        textDecoration: 'none',
        borderBottom: '1px solid currentColor',
        transition: 'opacity 0.2s ease-in-out',
    };

    const linkContent = (
        <>
            {meta ? (
                <div className="link-card" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', maxWidth: '400px' }}>
                    {meta.image && <Image src={meta.image.url} alt={meta.title || ''} style={{ maxWidth: '100%', height: 'auto', marginBottom: '8px' }} height={72} width={72} />}
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 'bold' }}>{meta.title || href}</h3>
                    {meta.description && <p style={{ margin: '0', fontSize: '14px', color: '#6b7280' }}>{meta.description}</p>}
                </div>
            ) : (
                <span style={linkStyle}>
                    {children || href}
                </span>
            )}
        </>
    );

    if (isInternal) {
        return <Link href={href} passHref legacyBehavior><a style={linkStyle}>{linkContent}</a></Link>;
    }

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            {linkContent}
            <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
                (opens in new tab)
            </span>
        </a>
    );
};

export default CustomLinkRenderer;
