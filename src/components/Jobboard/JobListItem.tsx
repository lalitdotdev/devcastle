"use client"

import { Banknote, Briefcase, Clock, Edit, Globe2, MapPin } from "lucide-react";
import { formatMoney, formatTimeToNow } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/Button";
import Image from "next/image";
import { Job } from "@prisma/client";
import Link from "next/link";
import React from 'react';
import compLogoPlaceholder from "@/assets/complogo.png";
import { motion } from 'framer-motion';
import { useSession } from "next-auth/react";

interface JobListItemProps {
    job: Job;
}

export default function JobListItem({
    job: {
        id,
        title,
        userId,
        companyName,
        type,
        locationType,
        location,
        salary,
        companyLogoUrl,
        createdAt,
    },
}: JobListItemProps) {


    const { data: session, status } = useSession()
    const isJobCreator = session?.user?.id === userId
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            className="flex shadow-lg gap-3 rounded-lg p-4 border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800/50 transition-all duration-300"
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Image
                    className="rounded-lg self-center"
                    src={companyLogoUrl || compLogoPlaceholder}
                    alt={companyName}
                    width={100}
                    height={100}
                />
            </motion.div>
            <div className="flex flex-col flex-grow space-y-3">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-xl font-md text-blue-400">{title}</h2>
                    <h3 className="text-[#CCCDCE] font-semibold">{companyName}</h3>
                    {isJobCreator && (
                        <Link href={`/jobs/edit/${id}`} passHref>
                            <Button variant="subtle" className="flex items-center border-none">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Job
                            </Button>
                        </Link>
                    )}
                </motion.div>
                <motion.div
                    className="text-muted-foreground grid grid-cols-2 gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {[
                        { Icon: Briefcase, text: type },
                        { Icon: MapPin, text: locationType },
                        { Icon: Globe2, text: location || "Worldwide" },
                        { Icon: Banknote, text: formatMoney(salary) },
                        { Icon: Clock, text: formatTimeToNow(createdAt) },
                    ].map(({ Icon, text }, index) => (
                        <motion.p
                            key={index}
                            className="flex items-center gap-1.5 text-sm"
                            whileHover={{ scale: 1.05, color: "#60A5FA" }}
                        >
                            <Icon size={16} className="shrink-0" />
                            {text}
                        </motion.p>
                    ))}
                </motion.div>
            </div>
            <motion.div
                className="hidden sm:flex shrink-0 flex-col items-end justify-between"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Badge variant="secondary" className="bg-blue-500 text-white">
                    {type}
                </Badge>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={16} className="shrink-0" />
                    {formatTimeToNow(createdAt)}
                </span>
            </motion.div>
        </motion.article>
    );
}
