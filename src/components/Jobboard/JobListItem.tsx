"use client"

import {
    Briefcase,
    Building2,
    Clock,
    Edit,
    Globe2,
    GraduationCap,
    Link as LinkIcon,
    Mail,
    MapPin,
    Tags,
    ArrowUpRight,
    DollarSign,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import compLogoPlaceholder from "@/assets/complogo.png";
import { formatTimeToNow } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface JobListItemProps {
    job: {
        id: string;
        slug: string;
        title: string;
        type: string;
        locationType: string;
        location: string | null;
        short_description: string | null;
        description: string | null;
        salary: number;
        companyName: string;
        applicationEmail: string | null;
        applicationUrl: string | null;
        companyLogoUrl: string | null;
        userId: string;
        yearsOfExperience: string | null;
        workMode: string | null;
        isPublished: boolean;
        categoryId: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        category?: { id: string; name: string } | null;
        tags?: { id: string; name: string }[] | null;
    };
}

// ── Status badge ──────────────────────────────────────────────────────────────
const statusConfig = {
    approved: { label: "Approved", classes: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    pending:  { label: "Pending",  classes: "bg-amber-500/10 text-amber-300 border-amber-500/20"   },
    draft:    { label: "Draft",    classes: "bg-zinc-500/10 text-zinc-400 border-zinc-700"          },
};

function getStatus(job: JobListItemProps["job"]) {
    if (job.approved) return statusConfig.approved;
    if (job.isPublished) return statusConfig.pending;
    return statusConfig.draft;
}

// ── Salary formatter ──────────────────────────────────────────────────────────
function formatSalary(salary: number) {
    if (!salary) return null;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(salary);
}

// ── Wrapper (keeps JobResults link-free at the row level) ─────────────────────
export const JobListItemWrapper: React.FC<JobListItemProps> = ({ job }) => {
    return <JobListItem job={job} />;
};

// ── Main item ─────────────────────────────────────────────────────────────────
export default function JobListItem({ job }: JobListItemProps) {
    const { data: session } = useSession();
    const isJobCreator = session?.user?.id === job.userId;
    const status = getStatus(job);
    const salary = formatSalary(job.salary);

    const metaItems = [
        { Icon: Briefcase,     text: job.type,                          tooltip: "Job Type"            },
        { Icon: MapPin,        text: job.locationType,                  tooltip: "Location Type"       },
        { Icon: Globe2,        text: job.location || "Worldwide",       tooltip: "Location"            },
        { Icon: Building2,     text: job.workMode || "Not specified",   tooltip: "Work Mode"           },
        { Icon: GraduationCap, text: job.yearsOfExperience || "Open",   tooltip: "Experience Required" },
    ];

    return (
        <div className="p-5">
            <div className="flex items-start gap-4">

                {/* ── Company logo ── */}
                <div className="shrink-0 h-12 w-12 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                    <Image
                        src={job.companyLogoUrl || compLogoPlaceholder}
                        alt={job.companyName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                </div>

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0 space-y-3">

                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug truncate">
                                {job.title}
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">{job.companyName}</p>
                        </div>

                        {/* Badges */}
                        <div className="shrink-0 flex items-center gap-2">
                            <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.classes}`}>
                                {status.label}
                            </span>
                            {job.category && (
                                <span className="hidden sm:inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300">
                                    {job.category.name}
                                </span>
                            )}
                            {/* Arrow — revealed on hover from parent card */}
                            <div className="flex items-center justify-center h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-200 opacity-0 group-hover:opacity-100">
                                <ArrowUpRight className="h-3 w-3" />
                            </div>
                        </div>
                    </div>

                    {/* Short description */}
                    {job.short_description && (
                        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            {job.short_description}
                        </p>
                    )}

                    {/* Metadata chips */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {metaItems.map(({ Icon, text, tooltip }, i) => (
                            <Tooltip key={i}>
                                <TooltipTrigger asChild>
                                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-default">
                                        <Icon className="h-3 w-3 shrink-0" />
                                        {text}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs bg-zinc-900 border-zinc-800 text-zinc-300">
                                    {tooltip}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        {salary && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
                                <DollarSign className="h-3 w-3 shrink-0" />
                                {salary}
                            </span>
                        )}
                    </div>

                    {/* Tags */}
                    {job.tags && job.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <Tags className="h-3 w-3 text-zinc-700 shrink-0" />
                            {job.tags.slice(0, 5).map((tag) => (
                                <span key={tag.id} className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-500">
                                    {tag.name}
                                </span>
                            ))}
                            {job.tags.length > 5 && (
                                <span className="text-[10px] text-zinc-700">+{job.tags.length - 5}</span>
                            )}
                        </div>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                        {/* Apply actions */}
                        <div className="flex items-center gap-3">
                            {job.applicationEmail && (
                                <a
                                    href={`mailto:${job.applicationEmail}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-violet-300 transition-colors duration-200"
                                >
                                    <Mail className="h-3 w-3" />
                                    Email
                                </a>
                            )}
                            {job.applicationUrl && (
                                <a
                                    href={job.applicationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-violet-300 transition-colors duration-200"
                                >
                                    <LinkIcon className="h-3 w-3" />
                                    Apply online
                                </a>
                            )}
                        </div>

                        {/* Right: edit + time */}
                        <div className="flex items-center gap-3">
                            {isJobCreator && (
                                <Link
                                    href={`/jobs/edit/${job.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
                                >
                                    <Edit className="h-3 w-3" />
                                    Edit
                                </Link>
                            )}
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-700">
                                <Clock className="h-3 w-3" />
                                {formatTimeToNow(job.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}