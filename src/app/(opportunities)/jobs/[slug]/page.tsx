import { ChevronLeft, Edit } from "lucide-react";

import ApplyNowButton from "../_components/ApplyNowBtn";
import { Button } from "@/components/ui/Button";
import JobDetailsPageComponent from "@/components/Jobboard/JobDetailsPageComponent";
import Link from "next/link";
import { Metadata } from "next";
import React from 'react';
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

interface PageProps {
    params: { slug: string };
}

async function getJob(slug: string) {
    try {
        const job = await db.job.findUnique({
            where: { slug },
            include: {
                category: true
            }
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
                // isPublished: true,
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

    const session = await getAuthSession();
    if (!job) notFound();

    console.log(job)

    const { applicationEmail, applicationUrl } = job;
    const applicationLink = applicationEmail
        ? `mailto:${applicationEmail}`
        : applicationUrl;

    if (!applicationLink) {
        console.error(`Job has no application link or email. Slug: ${slug}`);
        notFound();
    }


    const isJobCreator = session?.user?.id === job.userId;
    return (
        <div className="min-h-screen">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <Link href="/opportunities" className="flex items-center text-blue-600 hover:text-blue-800">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to all jobs
                    </Link>
                </div>
                <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-10">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold">{job.title}</h1>


                            {isJobCreator && (
                                <Link href={`/jobs/edit/${job.id}`} passHref>
                                    <Button variant="subtle" className="flex items-center ">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Job
                                    </Button>
                                </Link>
                            )}
                        </div>
                        <JobDetailsPageComponent job={job} />
                    </div>
                </div>
                <aside className="mt-8 w-fit">
                    <ApplyNowButton applicationLink={applicationLink} />
                </aside>
            </main>
        </div>
    );
}
