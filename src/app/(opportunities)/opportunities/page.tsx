import JobFilterSidebar from "@/components/Jobboard/JobFilterSidebar";
import { JobFilterValues } from "@/lib/validators/jobFilter";
import JobResults from "@/components/Jobboard/JobResults";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
    Briefcase, MapPin, Wifi, Search,
    TrendingUp, Sparkles,
} from "lucide-react";

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
    const prefix = q
        ? `${q} jobs`
        : type
            ? `${type} developer jobs`
            : remote
                ? "Remote developer jobs"
                : "All developer opportunities";

    const suffix = location ? ` in ${location}` : "";
    return `${prefix}${suffix}`;
}

export function generateMetadata({
    searchParams: { q, type, location, remote },
}: PageProps): Metadata {
    return {
        title: `${getTitle({ q, type, location, remote: remote === "true" })} | DevCastle`,
    };
}

// ── Active filter pills ───────────────────────────────────────────────────────
function ActiveFilters({ q, type, location, remote }: JobFilterValues) {
    const filters = [
        q        && { icon: Search,   label: q,           color: "border-violet-500/20 bg-violet-500/10 text-violet-300"  },
        type     && { icon: Briefcase, label: type,        color: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"        },
        location && { icon: MapPin,   label: location,    color: "border-amber-500/20 bg-amber-500/10 text-amber-300"     },
        remote   && { icon: Wifi,     label: "Remote",    color: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"},
    ].filter(Boolean) as { icon: any; label: string; color: string }[];

    if (filters.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Active:</span>
            {filters.map(({ icon: Icon, label, color }) => (
                <span
                    key={label}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border ${color}`}
                >
                    <Icon className="h-3 w-3 shrink-0" />
                    {label}
                </span>
            ))}
        </div>
    );
}

export default async function JobboardPage({
    searchParams: { q, type, location, remote },
}: PageProps) {
    const filterValues: JobFilterValues = {
        q,
        type,
        location,
        remote: remote === "true",
    };

    const isFiltered = !!(q || type || location || remote);

    // ── Data fetching ─────────────────────────────────────────────────────────
    const distinctLocations = await db.job
        .findMany({ where: { approved: true }, select: { location: true }, distinct: ["location"] })
        .then((rows) => rows.map((r) => r.location).filter(Boolean) as string[]);

    const searchString = q
        ?.split(" ")
        .filter((w) => w.length > 0)
        .join(" & ");

    const searchFilter: Prisma.JobWhereInput = searchString
        ? {
            OR: [
                { title:        { search: searchString } },
                { companyName:  { search: searchString } },
                { type:         { search: searchString } },
                { locationType: { search: searchString } },
                { location:     { search: searchString } },
            ],
        }
        : {};

    const where: Prisma.JobWhereInput = {
        AND: [
            searchFilter,
            type     ? { type }                        : {},
            location ? { location }                    : {},
            remote   ? { locationType: "Remote" }      : {},
            { approved: true },
        ],
    };

    const jobs = await db.job.findMany({ where, orderBy: { createdAt: "desc" } });

    const title = getTitle({ q, type, location, remote: remote === "true" });

    return (
        <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
                <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[120px]" />
                <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-violet-600/4 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* ── Page header ── */}
                <div className="mb-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {jobs.length} opportunit{jobs.length !== 1 ? "ies" : "y"} available
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] mb-4">
                        <span className="text-zinc-100">
                            {isFiltered ? title.split(" ").slice(0, -1).join(" ") : "Developer"}
                        </span>
                        {" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            {isFiltered ? title.split(" ").slice(-1)[0] : "Opportunities"}
                        </span>
                    </h1>

                    <p className="text-zinc-500 leading-relaxed max-w-xl mb-6">
                        {isFiltered
                            ? `Showing filtered results for your search. Adjust the filters to explore more.`
                            : "Curated developer jobs from the best companies. Find your next role, contract, or remote opportunity."}
                    </p>

                    {/* Active filter pills */}
                    <ActiveFilters {...filterValues} />

                    {/* Stats row */}
                    {!isFiltered && (
                        <div className="flex flex-wrap items-center gap-6 mt-6">
                            {[
                                { icon: Briefcase,   label: "Full-time & contract" },
                                { icon: Wifi,        label: "Remote friendly"       },
                                { icon: TrendingUp,  label: "Updated daily"         },
                                { icon: Sparkles,    label: "Vetted companies"      },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-1.5 text-xs text-zinc-600">
                                    <Icon className="h-3.5 w-3.5" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Divider ── */}
                <div className="border-t border-zinc-800/60 mb-8" />

                {/* ── Main layout ── */}
                <section className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Sidebar */}
                    <JobFilterSidebar
                        defaultValues={filterValues}
                        distinctLocations={distinctLocations}
                    />

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        {/* Results header */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                    Results
                                </span>
                            </div>
                            <span className="text-[11px] text-zinc-700 tabular-nums">
                                {jobs.length} job{jobs.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <JobResults jobs={jobs} />
                    </div>
                </section>
            </div>
        </main>
    );
}