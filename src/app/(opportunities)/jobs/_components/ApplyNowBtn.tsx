"use client"

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

interface ApplyNowButtonProps {
    applicationLink: string;
}

export default function ApplyNowButton({ applicationLink }: ApplyNowButtonProps) {
    return (
        <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
        >
            <Link
                href={applicationLink}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
                Apply for this position
            </Link>
        </motion.div>
    );
}
