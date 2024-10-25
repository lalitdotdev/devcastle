"use client"

import { Banknote, Briefcase, Globe2, MapPin, Tag } from "lucide-react";
import { Job, JobCategory } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";
import Markdown from "./Markdown";
import React from 'react';
import { formatMoney } from "@/lib/utils";
import { motion } from 'framer-motion';

interface JobDetailsPageComponentProps {
    job: Job & {
        category: JobCategory | null;
    };
}

export default function JobDetailsPageComponent({
    job: {
        title,
        short_description,
        description,
        companyName,
        applicationUrl,
        category,

        type,
        locationType,
        location,
        salary,
        companyLogoUrl,
    },
}: JobDetailsPageComponentProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full grow space-y-8 bg-gradient-to-br from-[#2A303C] to-[#1B1F23] md:p-6  rounded-xl shadow-2xl"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex flex-col md:flex-row items-center"
            >
                {companyLogoUrl && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Image
                            src={companyLogoUrl}
                            alt="Company logo"
                            width={150}
                            height={150}
                            className="rounded-full border-4 border-blue-500 object-contain bg-white p-2 shadow-lg"
                        />
                    </motion.div>
                )}
                <div className="flex-1 bg-[#252A34] p-6 rounded-lg shadow-inner">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                        className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4"
                    >
                        {title}
                    </motion.h1>

                    {category && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35, duration: 0.3 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <Tag size={16} className="text-blue-400" />
                            <span className="text-blue-400 bg-[#1B1F23] px-3 py-1 rounded-full text-sm">
                                {category.name}
                            </span>
                        </motion.div>
                    )}
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className=" text-gray-400 mb-6"
                    >
                        {
                            short_description
                        }
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-xl text-gray-300 mb-6"
                    >
                        {applicationUrl ? (
                            <Link
                                href={new URL(applicationUrl).origin}
                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline underline-offset-4"
                            >
                                {companyName}
                            </Link>
                        ) : (
                            <span>{companyName}</span>
                        )}
                    </motion.p>


                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="grid grid-cols-2 gap-4 text-gray-300"
                    >
                        {[
                            { Icon: Briefcase, text: type },
                            { Icon: MapPin, text: locationType },
                            { Icon: Globe2, text: location || "Worldwide" },
                            { Icon: Banknote, text: formatMoney(salary) },
                        ].map(({ Icon, text }, index) => (
                            <motion.p
                                key={index}
                                className="flex items-center gap-2 bg-[#1B1F23] p-3 rounded-md"
                                whileHover={{ scale: 1.05, backgroundColor: "#2A303C" }}
                            >
                                <Icon size={20} className="text-blue-400 shrink-0" />
                                <span className="text-sm md:text-base">{text}</span>
                            </motion.p>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className=" "
            >
                {description && (
                    <div className="">
                        <Markdown


                        >{description}</Markdown>
                    </div>
                )}
            </motion.div>
        </motion.section>
    );
}
