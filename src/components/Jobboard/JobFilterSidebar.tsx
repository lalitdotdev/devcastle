import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";
import { JobFilterValues, jobFilterSchema } from "@/lib/validators/jobFilter";
import {
    Briefcase, Filter, Globe2, MapPin,
    Search, SlidersHorizontal, Wifi,
} from "lucide-react";

import FormSubmitButton from "./FormSubmitButton";
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

// ── Shared input/select styles ────────────────────────────────────────────────
const inputClass =
    "w-full h-10 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-violet-500/60 focus:outline-none transition-colors duration-200";

const selectClass =
    "w-full h-10 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-violet-500/60 focus:outline-none transition-colors duration-200 appearance-none";

const labelClass = "block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5";

// ── Filter form ───────────────────────────────────────────────────────────────
const JobFilterForm = ({ defaultValues, distinctLocations }: JobFilterSidebarProps) => {
    const hasActiveFilters =
        !!defaultValues.q || !!defaultValues.type ||
        !!defaultValues.location || !!defaultValues.remote;

    return (
        <form action={filterJobs} key={JSON.stringify(defaultValues)} className="space-y-5">

            {/* Search */}
            <div>
                <label htmlFor="q" className={labelClass}>Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
                    <input
                        id="q"
                        name="q"
                        placeholder="Title, company, keyword…"
                        defaultValue={defaultValues.q}
                        className={`${inputClass} pl-9`}
                    />
                </div>
            </div>

            {/* Job Type */}
            <div>
                <label htmlFor="type" className={labelClass}>Job Type</label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
                    <Select
                        id="type"
                        name="type"
                        defaultValue={defaultValues.type || ""}
                        className={`${selectClass} pl-9`}
                    >
                        <option value="">All types</option>
                        {jobTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Location */}
            <div>
                <label htmlFor="location" className={labelClass}>Location</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
                    <Select
                        id="location"
                        name="location"
                        defaultValue={defaultValues.location || ""}
                        className={`${selectClass} pl-9`}
                    >
                        <option value="">All locations</option>
                        {distinctLocations.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-800/60" />

            {/* Remote toggle */}
            <label
                htmlFor="remote"
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 cursor-pointer transition-all duration-200 group"
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 shrink-0">
                        <Wifi className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">Remote only</p>
                        <p className="text-[10px] text-zinc-600">Work from anywhere</p>
                    </div>
                </div>

                {/* Custom checkbox toggle */}
                <div className="relative">
                    <input
                        id="remote"
                        name="remote"
                        type="checkbox"
                        defaultChecked={defaultValues.remote}
                        className="sr-only peer"
                    />
                    <div className="h-5 w-9 rounded-full border border-zinc-700 bg-zinc-800
                        peer-checked:bg-gradient-to-r peer-checked:from-violet-600 peer-checked:to-fuchsia-600
                        peer-checked:border-violet-500/60
                        transition-all duration-200" />
                    <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-zinc-500 
                        peer-checked:translate-x-4 peer-checked:bg-white
                        transition-all duration-200 pointer-events-none" />
                </div>
            </label>

            {/* Active filter indicator */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                    Filters active — results are filtered
                </div>
            )}

            {/* Submit */}
            <FormSubmitButton
                type="submit"
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    hover:from-violet-500 hover:to-fuchsia-500
                    text-white shadow-lg shadow-violet-900/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200"
            >
                <Filter className="h-3.5 w-3.5" />
                Apply Filters
            </FormSubmitButton>
        </form>
    );
};

// ── Sidebar wrapper ───────────────────────────────────────────────────────────
const JobFilterSidebar = ({ defaultValues, distinctLocations }: JobFilterSidebarProps) => {
    return (
        <aside className="w-full md:min-w-[260px] md:max-w-[280px] md:sticky md:top-20 h-fit">

            {/* ── Mobile: collapsible accordion ── */}
            <div className="md:hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <Accordion type="single" collapsible>
                    <AccordionItem value="filters" className="border-0">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center gap-2.5">
                                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600">
                                    <SlidersHorizontal className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-zinc-200">Filters</span>
                                {(defaultValues.q || defaultValues.type || defaultValues.location || defaultValues.remote) && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                            <JobFilterForm defaultValues={defaultValues} distinctLocations={distinctLocations} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* ── Desktop: always visible ── */}
            <div className="hidden md:block rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
                {/* Top accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/60 bg-zinc-900/60">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shrink-0">
                        <SlidersHorizontal className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-200">Filter Jobs</p>
                        <p className="text-[10px] text-zinc-600">Narrow down opportunities</p>
                    </div>
                </div>

                <div className="p-5">
                    <JobFilterForm defaultValues={defaultValues} distinctLocations={distinctLocations} />
                </div>
            </div>
        </aside>
    );
};

export default JobFilterSidebar;