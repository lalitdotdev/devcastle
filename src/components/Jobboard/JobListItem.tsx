import { Banknote, Briefcase, Clock, Globe2, MapPin } from "lucide-react";
import { formatMoney, formatTimeToNow } from "@/lib/utils";

import { Badge } from "../ui/badge";
import Image from "next/image";
import { Job } from "@prisma/client";
import compLogoPlaceholder from "@/assets/complogo.png";

interface JobListItemProps {
    job: Job;
}

export default function JobListItem({
    job: {
        title,
        companyName,
        type,
        locationType,
        location,
        salary,
        companyLogoUrl,
        createdAt,
    },
}: JobListItemProps) {
    return (
        // consider giving hover class to article hover: shadow-lg
        <article className="flex shadow-lg gap-3 rounded-lg p-4 hover:shadow-lg border border-zinc-700 bg-[#212329]">
            <Image
                className="rounded-lg self-center"
                src={companyLogoUrl || compLogoPlaceholder}
                alt={companyName}
                width={100}
                height={100}
            />
            <div className="flex flex-col flex-grow space-y-3">
                <div>
                    <h2 className="text-xl font-md text-color-5">{title}</h2>
                    <h3 className="text-[#CCCDCE] font-semibold">{companyName}</h3>
                </div>
                <div className="text-muted-foreground">
                    <p className="flex items-center gap-1.5 sm:hidden">
                        <Briefcase size={16} className="shrink-0" />
                        {type}
                    </p>

                    <p className="flex items-center gap-1.5">
                        <MapPin size={16} className="shrink-0" />
                        {locationType}
                    </p>
                    <p className="flex items-center gap-1.5">
                        <Globe2 size={16} className="shrink-0" />
                        {location || "Worldwide"}
                    </p>
                    <p className="flex items-center gap-1.5">
                        <Banknote size={16} className="shrink-0" />
                        {formatMoney(salary)}
                    </p>
                    <p className="flex items-center gap-1.5 sm:hidden ">
                        <Clock size={16} className="shrink-0" />
                        {formatTimeToNow(createdAt)}
                    </p>
                </div>
            </div>
            <div className="hidden sm:flex shrink-0 flex-col items-end justify-between">
                <Badge variant="secondary" className="bg-zinc-200">
                    {type}
                </Badge>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={16} className="shrink-0" />
                    {formatTimeToNow(createdAt)}
                </span>
            </div>
        </article>
    );
}
