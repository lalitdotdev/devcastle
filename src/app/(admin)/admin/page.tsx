import JobListItem from "@/components/Jobboard/JobListItem";
import H1 from "@/components/h1";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function page() {
  const session = await getAuthSession();
  const unapprovedJobs = await db.job.findMany({
    where: { approved: false },
  });

  if (session?.user.role !== "ADMIN") {
    return notFound();
  } else {
    return (
      <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
        <H1 className="text-center">Admin Dashboard</H1>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">Unapproved Jobs</h2>

          {unapprovedJobs.map((job) => (
            <Link
              key={job.id}
              href={`/admin/jobs/${job.slug}`}
              className="block"
            >
              <JobListItem job={job} />
            </Link>
          ))}
          {unapprovedJobs.length === 0 && (
            <p className="text-muted-foreground">No unapproved jobs</p>
          )}
        </section>
      </main>
    );
  }
}
