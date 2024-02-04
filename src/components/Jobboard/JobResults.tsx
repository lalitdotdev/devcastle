import { Prisma } from "@prisma/client";
import JobListItem from "./JobListItem";
import { JobFilterValues } from "../../lib/validators/jobFilter";

interface JobResultsProps {
  filterValues: JobFilterValues;
}

const JobResults = ({
  filterValues: { q, type, location, remote },
}: JobResultsProps) => {
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

  return (
    <div className="grow space-y-4 overflow-hidden ">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobResults;
