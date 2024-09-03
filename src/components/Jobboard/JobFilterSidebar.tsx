import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { JobFilterValues, jobFilterSchema } from "@/lib/validators/jobFilter";

import { Filter } from "lucide-react";
import FormSubmitButton from "./FormSubmitButton";
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import React from 'react';
import Select from "./Select";
import { jobTypes } from "@/lib/job-types";
import { redirect } from "next/navigation";

async function filterJobs(formData: FormData) {
    "use server";

    const values = Object.fromEntries(formData.entries());
    const { q, type, location, remote } = jobFilterSchema.parse(values);

    const searchParams = new URLSearchParams({
        ...(q && { q: q.trim() }),
        ...(type && { type }),
        ...(location && { location }),
        ...(remote && { remote: "true" }),
    });

    redirect(`opportunities/?${searchParams.toString()}`);
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
        <aside className="w-full md:w-[340px] md:sticky md:top-24 h-fit rounded-lg bg-gradient-to-br from-[#282C35] to-[#1E2128] p-4 md:p-6 shadow-xl">
            <Accordion type="single" collapsible className="w-full md:hidden">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-blue-400 ">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter Jobs
                    </AccordionTrigger>
                    <AccordionContent>
                        <JobFilterForm defaultValues={defaultValues} distinctLocations={distinctLocations} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="hidden md:block">
                <JobFilterForm defaultValues={defaultValues} distinctLocations={distinctLocations} />
            </div>
        </aside>
    );
};

const JobFilterForm = ({ defaultValues, distinctLocations }: JobFilterSidebarProps) => {
    return (
        <form action={filterJobs} key={JSON.stringify(defaultValues)} className="space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="q" className="text-blue-400">Search</Label>
                    <Input
                        id="q"
                        name="q"
                        placeholder="Title, company, etc."
                        defaultValue={defaultValues.q}
                        className="bg-[#1E2128] border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type" className="text-blue-400">Type</Label>
                    <Select
                        id="type"
                        name="type"
                        defaultValue={defaultValues.type || ""}
                        className="bg-[#1E2128] border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All types</option>
                        {jobTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-blue-400">Location</Label>
                    <Select
                        id="location"
                        name="location"
                        defaultValue={defaultValues.location || ""}
                        className="bg-[#1E2128] border-blue-500 focus:ring-2 focus:ring-blue-500"
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
                        className="w-5 h-5 rounded accent-blue-500"
                        defaultChecked={defaultValues.remote}
                    />
                    <Label htmlFor="remote" className="text-blue-400">Remote jobs</Label>
                </div>
            </div>
            <FormSubmitButton type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-300">
                Filter jobs
            </FormSubmitButton>
        </form>
    );
};

export default JobFilterSidebar;
