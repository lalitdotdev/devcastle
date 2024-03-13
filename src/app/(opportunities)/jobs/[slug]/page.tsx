import { Button } from "@/components/ui/Button";
import JobDetailsPageComponent from "@/components/Jobboard/JobDetailsPageComponent";
import { Metadata } from "next";
import { cache } from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: { slug: string };
}

const getJob = cache(async (slug: string) => {
    const job = await db.job.findUnique({
        where: { slug },
    });

    if (!job) notFound();

    return job;
});

// generateStaticParams

export async function generateStaticParams() {
    const jobs = await db.job.findMany({
        where: {
            approved: true,
        },
        select: {
            slug: true,
        },
    });
    return jobs.map(({ slug }) => slug);
}

export async function generateMetadata({
    params: { slug },
}: PageProps): Promise<Metadata> {
    const job = await getJob(slug);

    return {
        title: job.title,
    };
}

export default async function JobDetailsPage({ params: { slug } }: PageProps) {
    const job = await getJob(slug);
    const { applicationEmail, applicationUrl } = job;
    const applicationLink = applicationEmail
        ? `mailto:${applicationEmail}`
        : applicationUrl;

    if (!applicationLink) {
        console.error("Job has no application link or email.");
        notFound();
    }

    return (
        <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
            <JobDetailsPageComponent job={job} />
            <aside>
                <Button className="border-2 border-indigo-500  bg-indigo-700 text-zinc-100 pt-2">
                    <a href={applicationLink}>Apply Now</a>
                </Button>
            </aside>
        </main>
    );
}
