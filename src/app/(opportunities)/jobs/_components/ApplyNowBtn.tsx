"use client"

import React from 'react';
import { motion } from 'framer-motion';

interface ApplyNowButtonProps {
    applicationLink: string;
}

export default function ApplyNowButton({ applicationLink }: ApplyNowButtonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
        >

            <motion.a
                href={applicationLink}
                className="relative block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg text-center text-lg shadow-lg transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
            >
                Apply Now
                <motion.span
                    className="absolute inset-0 bg-white rounded-lg opacity-25"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </motion.a>
        </motion.div>
    );
}
