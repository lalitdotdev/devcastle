import H1 from "@/components/h1";
import JobFilterSidebar from "@/components/Jobboard/JobFilterSidebar";
import { JobFilterValues } from "@/lib/validators/jobFilter";
import JobResults from "@/components/Jobboard/JobResults";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

interface PageProps {
    searchParams: {
        q?: string;
        type?: string;
        location?: string;
        remote?: string;
        page?: string;
    };
}

function getTitle({ q, type, location, remote }: JobFilterValues) {
    const titlePrefix = q
        ? `${q} jobs`
        : type
            ? `${type} developer jobs`
            : remote
                ? "Remote developer jobs"
                : "All developer Opportunities";

    const titleSuffix = location ? ` in ${location}` : "";

    return `${titlePrefix}${titleSuffix}`;
}

export function generateMetadata({
    searchParams: { q, type, location, remote },
}: PageProps): Metadata {
    return {
        title: `${getTitle({
            q,
            type,
            location,
            remote: remote === "true",
        })} | DevCastle Jobs`,
    };
}

export default async function Jobboardpage({
    searchParams: { q, type, location, remote },
}: PageProps) {
    const filterValues: JobFilterValues = {
        q,
        type,
        location,
        remote: remote === "true",
    };

    const distinctLocations = (await db.job
        .findMany({
            where: { approved: true },
            select: { location: true },
            distinct: ["location"],
        })
        .then((locations) =>
            locations.map((location) => location.location).filter(Boolean)
        )) as string[];

    const searchString = q
        ?.split(" ")
        .filter((word) => word.length > 0)
        .join(" & ");

    const searchFilter: Prisma.JobWhereInput = searchString
        ? {
            OR: [
                { title: { search: searchString } },
                { companyName: { search: searchString } },
                { type: { search: searchString } },
                { locationType: { search: searchString } },
                { location: { search: searchString } },
            ],
        }
        : {};

    // todo: add a where clause to filter out only approved jobs and only show published jobs
    const where: Prisma.JobWhereInput = {
        AND: [
            searchFilter,
            type ? { type } : {},
            location ? { location } : {},
            remote ? { locationType: "Remote" } : {},
            { approved: true },
        ],
    };

    const jobs = await db.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="max-w-5xl m-auto px-3 my-10 space-y-10 ">
            <div className="space-y-3">
                <H1 className="gradient-text animate-gradient">
                    {getTitle({
                        q,
                        type,
                        location,
                        remote: remote === "true",
                    })}
                </H1>
                <p className="text-lg text-n-14">Companies Actively Hiring!</p>

                <p className="text-md text-muted-foreground">
                    We update this list once per week with new companies hiring remote
                    positions. Please help us make it better, use the form at the bottom
                    of the page to suggest great remote jobs or suggest updates to the
                    current remote companies.
                </p>
            </div>

            <hr className="border-t border-zinc-700" />

            <section className="flex flex-col md:flex-row gap-4">
                <JobFilterSidebar
                    defaultValues={filterValues}
                    distinctLocations={distinctLocations}
                />
                <JobResults jobs={jobs} />
            </section>
        </main>
    );
}
