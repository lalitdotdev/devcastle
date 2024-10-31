"use client"

import { Banknote, Building2, Clock, Globe2, MapPin, Tag } from "lucide-react";
import { Job, JobCategory } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";
import Markdown from "./Markdown";
import { formatMoney } from "@/lib/utils";
import { motion } from 'framer-motion';

interface JobDetailsPageComponentProps {
    job: Job & {
        category: JobCategory | null;
    };
}

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const JobDetailsPageComponent = ({
    job: {
        title,
        short_description,
        description,
        companyName,
        applicationUrl,
        category,
        yearsOfExperience,
        type,
        locationType,
        location,
        salary,
        companyLogoUrl,
    },
}: JobDetailsPageComponentProps) => {
    const jobDetails = [
        { Icon: Building2, text: type, label: "Job Type" },
        { Icon: MapPin, text: locationType, label: "Work Model" },
        { Icon: Globe2, text: location || "Worldwide", label: "Location" },
        { Icon: Banknote, text: formatMoney(salary), label: "Salary" },
        { Icon: Clock, text: yearsOfExperience, label: "Experience" },
    ];

    return (
        <div className="">
            <motion.section
                {...fadeInUp}
                className="space-y-8 bg-gradient-to-br  rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                        {companyLogoUrl && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="shrink-0"
                            >
                                <Image
                                    src={companyLogoUrl}
                                    alt={`${companyName} logo`}
                                    width={120}
                                    height={120}
                                    className="rounded-xl border-2 border-white/20 bg-white p-2 shadow-xl"
                                />
                            </motion.div>
                        )}

                        <div className="flex-1 text-center md:text-left">
                            <motion.h1
                                className="text-3xl md:text-4xl font-bold text-white mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {title}
                            </motion.h1>

                            <motion.div
                                className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {category && (
                                    <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-white flex items-center gap-2">
                                        <Tag size={14} />
                                        {category.name}
                                    </span>
                                )}
                                <Link
                                    href={applicationUrl ? new URL(applicationUrl).origin : '#'}
                                    className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm text-white hover:bg-white/20 transition-colors"
                                >
                                    {companyName}
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 pb-6 space-y-8">
                    {/* Job Overview */}
                    <motion.div
                        className="bg-gray-800/50 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Job Overview</h2>
                        <p className="text-gray-300 leading-relaxed">{short_description}</p>
                    </motion.div>

                    {/* Job Details Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {jobDetails.map(({ Icon, text, label }, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-700/30 transition-colors"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Icon size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">{label}</p>
                                        <p className="text-white font-medium">{text}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Job Description */}
                    {description && (
                        <motion.div
                            className="bg-gray-800/50 rounded-xl p-6 prose prose-invert max-w-none"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h2 className="text-xl font-semibold text-white mb-4">Job Description</h2>
                            <div className="text-gray-300">
                                <Markdown>{description}</Markdown>
                            </div>
                        </motion.div>
                    )}


                </div>
            </motion.section>
        </div>
    );
};

export default JobDetailsPageComponent;
