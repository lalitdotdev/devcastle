// app/page.tsx

import JobsTimelineStories from "./_components/JobsTimeline";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jobs Timeline Stories",
    description: "Latest job stories from Hacker News",
};

export default function JobsTimelinePage() {
    return (
        <main>
            <JobsTimelineStories />
        </main>
    );
}
