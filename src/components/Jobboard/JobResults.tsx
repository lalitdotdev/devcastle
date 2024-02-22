import { Job } from "@prisma/client";
import JobListItem from "./JobListItem";

import Link from "next/link";

interface JobResultsProps {
  jobs: Job[];
}

const JobResults = ({ jobs }: JobResultsProps) => {
  return (
    <div className="grow space-y-4 overflow-hidden ">
      {jobs.map((job) => (
        <Link href={`/jobs/${job.slug}`} key={job.id} className="block">
          <JobListItem job={job} />
        </Link>
      ))}
      {jobs.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-xl font-semibold">
            No jobs found. Try adjusting your search filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobResults;
