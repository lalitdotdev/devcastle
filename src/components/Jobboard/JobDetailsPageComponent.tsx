import { Banknote, Briefcase, Globe2, MapPin } from "lucide-react";

import Image from "next/image";
import { Job } from "@prisma/client";
import Link from "next/link";
import Markdown from "./Markdown";
import { formatMoney } from "@/lib/utils";

interface JobDetailsPageComponentProps {
    job: Job;
}

export default function JobDetailsPageComponent({
    job: {
        title,
        description,
        companyName,
        applicationUrl,
        type,
        locationType,
        location,
        salary,
        companyLogoUrl,
    },
}: JobDetailsPageComponentProps) {
    return (
        <section className="w-full grow space-y-5 bg-[#1B1F23] p-4 rounded-xl">
            <div className="flex items-center gap-3">
                {companyLogoUrl && (
                    <Image
                        src={companyLogoUrl}
                        alt="Company logo"
                        width={100}
                        height={100}
                        className="rounded-xl"
                    />
                )}
                <div className="border-4 border-blue-800 px-4 rounded-md w-full p-4">
                    <div className="">
                        <h1 className="md:text-3xl text-xl text-color-accentBlue font-bold  w-fit py-4  ">
                            {title}
                        </h1>

                        <p className="font-semibold p-2">
                            {applicationUrl ? (
                                <Link
                                    href={new URL(applicationUrl).origin}
                                    className="text-indigo-600  hover:text-indigo-700 underline underline-offset-4 "
                                >
                                    {companyName}
                                </Link>
                            ) : (
                                <span>{companyName}</span>
                            )}
                        </p>
                    </div>
                    <div className="text-slate-200">
                        <p className="flex items-center gap-1.5">
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
                    </div>
                </div>
            </div >
            <div>{description && <Markdown>{description}</Markdown>}</div>
        </section >
    );
}
