// app/page.tsx

import HackerNewsStories from "./_components/HackerNewsStories";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Top Stories and News",
    description: "Top Stories and News from Hacker News",
};

export default function TopStories() {
    return (
        <main>
            <HackerNewsStories />
        </main>
    );
}
