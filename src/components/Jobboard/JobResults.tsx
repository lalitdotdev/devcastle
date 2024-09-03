"use client"

import { AnimatePresence, motion } from 'framer-motion';

import { Job } from "@prisma/client";
import JobListItem from "./JobListItem";
import Link from "next/link";
import React from 'react';

interface JobResultsProps {
    jobs: Job[];
}

const JobResults = ({ jobs }: JobResultsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grow space-y-4 overflow-hidden"
        >
            <AnimatePresence>
                {jobs.map((job) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link href={`jobs/${job.slug}`} className="block">
                            <JobListItem job={job} />
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>
            {jobs.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center h-64"
                >
                    <p className="text-gray-500 text-xl font-semibold">
                        No jobs found. Try adjusting your search filters.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default JobResults;
