import ApplyNowButton from "../_components/ApplyNowBtn";
import JobDetailsPageComponent from "@/components/Jobboard/JobDetailsPageComponent";
import { Metadata } from "next";
import React from 'react';
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: { slug: string };
}

async function getJob(slug: string) {
    try {
        const job = await db.job.findUnique({
            where: { slug },
        });

        if (!job) {
            console.error(`Job not found for slug: ${slug}`);
            return null;
        }

        return job;
    } catch (error) {
        console.error(`Error fetching job with slug ${slug}:`, error);
        throw error;
    }
}

export async function generateStaticParams() {
    try {
        const jobs = await db.job.findMany({
            where: {
                approved: true,
            },
            select: {
                slug: true,
            },
        });
        return jobs.map(({ slug }) => ({ slug }));
    } catch (error) {
        console.error("Error in generateStaticParams:", error);
        return [];
    }
}

export async function generateMetadata({
    params: { slug },
}: PageProps): Promise<Metadata> {
    const job = await getJob(slug);
    if (!job) return { title: "Job Not Found" };
    return { title: job.title };
}

export default async function JobDetailsPage({ params: { slug } }: PageProps) {
    const job = await getJob(slug);

    if (!job) notFound();

    const { applicationEmail, applicationUrl } = job;
    const applicationLink = applicationEmail
        ? `mailto:${applicationEmail}`
        : applicationUrl;

    if (!applicationLink) {
        console.error(`Job has no application link or email. Slug: ${slug}`);
        notFound();
    }

    return (
        <main className="m-auto my-10 flex max-w-7xl flex-col items-center gap-5 px-3  md:items-start">
            <div className="w-full ">
                <JobDetailsPageComponent job={job} />
            </div>
            <aside className="w-full md:w-1/4 sticky top-5">
                <ApplyNowButton applicationLink={applicationLink} />
            </aside>
        </main>
    );
}
