import { jobTypes } from "@/lib/job-types";
import { JobFilterValues, jobFilterSchema } from "@/lib/validators/jobFilter";

import { redirect } from "next/navigation";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import Select from "./Select";
import { Button } from "../ui/Button";

async function filterJobs(formData: FormData) {
  "use server";

  //   throw new Error("Some error occured in filtering jobs!");

  const values = Object.fromEntries(formData.entries());

  const { q, type, location, remote } = jobFilterSchema.parse(values);

  const searchParams = new URLSearchParams({
    ...(q && { q: q.trim() }),
    ...(type && { type }),
    ...(location && { location }),
    ...(remote && { remote: "true" }),
  });

  redirect(`cbjobboard/?${searchParams.toString()}`);
}

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
  distinctLocations: string[];
}

const JobFilterSidebar = ({
  defaultValues,
  distinctLocations,
}: JobFilterSidebarProps) => {
  return (
    <aside className="sticky top-0 md:top-24 h-fit rounded-lg  bg-[#1B1F23] p-4 md:w-[340px]">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title, company, etc."
              defaultValue={defaultValues.q}
              className="focus:ring-1 focus:ring-indigo-600"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              name="type"
              defaultValue={defaultValues.type || ""}
              className="bg-[#1B1F23]"
            >
              <option value="">All types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select
              id="location"
              name="location"
              defaultValue={defaultValues.location || ""}
              className="bg-[#1B1F23]"
            >
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-blue"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote jobs</Label>
          </div>

          {/* Loader when applying filter and then show button */}

          <Button
            type="submit"
            className="text-red-500 w-full border-2 border-red-600"
          >
            Filter jobs
          </Button>
        </div>
      </form>
    </aside>
  );
};

export default JobFilterSidebar;
