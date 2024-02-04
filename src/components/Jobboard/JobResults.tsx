import { Job } from "@prisma/client";
import JobListItem from "./JobListItem";

interface JobResultsProps {
  jobs: Job[];
}

const JobResults = ({ jobs }: JobResultsProps) => {
  return (
    <div className="grow space-y-4 overflow-hidden ">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobResults;
