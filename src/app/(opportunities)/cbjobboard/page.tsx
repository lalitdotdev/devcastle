import JobFilterSidebar from "@/components/Jobboard/JobFilterSidebar";
import JobResults from "@/components/Jobboard/JobResults";

import { db } from "@/lib/db";
import { JobFilterValues } from "@/lib/validators/jobFilter";
import { Metadata } from "next";

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
    : "All developer jobs";

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
    })} | Campusbuddy Jobs`,
  };
}

export default async function Jobboardpage({
  searchParams: { q, type, location, remote, page },
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

  return (
    <main className="max-w-5xl m-auto px-3 my-10 space-y-10 ">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
          Job Board
        </h1>
        <p className="text-lg text-red-500">Companies Actively Hiring!</p>

        <p className="text-md text-muted-foreground">
          We update this list once per week with new companies hiring remote
          positions. Please help us make it better, use the form at the bottom
          of the page to suggest great remote jobs or suggest updates to the
          current remote companies.
        </p>
      </div>
      <section className="flex flex-col md:flex-row gap-4">
        <JobFilterSidebar
          defaultValues={filterValues}
          distinctLocations={distinctLocations}
        />
        <JobResults filterValues={filterValues} />
      </section>
    </main>
  );
}
