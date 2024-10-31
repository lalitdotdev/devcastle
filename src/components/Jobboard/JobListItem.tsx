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
    Tags
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/Button";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import compLogoPlaceholder from "@/assets/complogo.png";
import { formatTimeToNow } from "@/lib/utils";
import { useSession } from "next-auth/react";

// Updated interface to match Prisma types
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

// Wrapper component to handle the link and card together
export const JobListItemWrapper: React.FC<JobListItemProps> = ({ job }) => {
    return (
        <Link href={`/jobs/${job.slug}`} className="block no-underline">
            <JobListItem job={job} />
        </Link>
    );
};

// Main JobListItem component
export default function JobListItem({ job }: JobListItemProps) {
    const { data: session } = useSession();
    const isJobCreator = session?.user?.id === job.userId;

    const statusBadgeColor = job.approved
        ? "bg-green-500"
        : job.isPublished
            ? "bg-yellow-500"
            : "bg-red-500";

    const jobMetadata = [
        { Icon: Briefcase, text: job.type, tooltip: "Job Type" },
        { Icon: MapPin, text: job.locationType, tooltip: "Location Type" },
        { Icon: Globe2, text: job.location || "Worldwide", tooltip: "Location" },
        { Icon: Building2, text: job.workMode || "Not specified", tooltip: "Work Mode" },
        { Icon: GraduationCap, text: job.yearsOfExperience || "Not specified", tooltip: "Experience Required" },
    ];

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Company Logo Section */}
                    <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src={job.companyLogoUrl || compLogoPlaceholder}
                                alt={job.companyName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Main Content Section */}
                    <div className="flex-grow space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                                    {job.title}
                                </h2>
                                <h3 className="text-lg text-zinc-300 font-medium">{job.companyName}</h3>
                            </div>

                            <div className="flex gap-2">
                                <Badge variant="secondary" className={`${statusBadgeColor} text-white`}>
                                    {job.approved ? "Approved" : job.isPublished ? "Pending" : "Draft"}
                                </Badge>
                                {job.category && (
                                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                                        {job.category.name}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {job.short_description && (
                            <p className="text-zinc-400 line-clamp-2 w-fit">{job.short_description}</p>
                        )}

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {jobMetadata.map(({ Icon, text, tooltip }, index) => (
                                <Tooltip key={index}>
                                    <TooltipTrigger>
                                        <div className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm">{text}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>{tooltip}</TooltipContent>
                                </Tooltip>
                            ))}
                        </div>

                        {/* Tags Section */}
                        {job.tags && job.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Tags className="w-4 h-4 text-zinc-400" />
                                <div className="flex gap-2 flex-wrap">
                                    {job.tags.map((tag) => (
                                        <Badge key={tag.id} variant="secondary" className="bg-zinc-700">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions Section */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex gap-4">
                                {job.applicationEmail && (
                                    <Button variant="ghost" className="text-zinc-400 hover:text-blue-400">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Apply via Email
                                    </Button>
                                )}
                                {job.applicationUrl && (
                                    <Link className="text-zinc-400 hover:text-blue-400 flex justify-center items-center" href={job.applicationUrl}>
                                        <LinkIcon className="w-4 h-4 mr-2" />
                                        Apply Online
                                    </Link>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {isJobCreator && (
                                    <Link href={`/jobs/edit/${job.id}`}>
                                        <Button variant="subtle" className="border-zinc-700 hover:border-blue-500">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                )}
                                <div className="text-zinc-400 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{formatTimeToNow(job.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
