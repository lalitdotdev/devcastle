import FeedItem from './StartupMagazineFeedItem';
// pages/feed.tsx
import React from 'react';
import { getStartupMagazineFeed } from '@/app/feed/actions/getStartupMagazineFeed';

export default async function FeedPage() {
    const feedItems = await getStartupMagazineFeed();

    return (
        <div className="container mx-auto px-4 py-8">
            {feedItems.map((item: any) => (
                <FeedItem key={item.id} {...item} />
            ))}
        </div>
    );
}
