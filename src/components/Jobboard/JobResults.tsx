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

  return (
    <div className="grow space-y-4 overflow-hidden ">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobResults;
