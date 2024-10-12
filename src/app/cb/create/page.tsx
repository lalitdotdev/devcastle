"use client"

import { Castle, ChevronLeft, Sparkles, Wand2 } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { CreateCommunityPayload } from '@/lib/validators/community';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [communityName, setCommunityName] = useState('');
    const [communityDescription, setCommunityDescription] = useState('');
    const router = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateCommunityPayload = {
                name: communityName,
                description: communityDescription,
            };
            const { data } = await axios.post("/api/community", payload);
            return data;
        },
        onError: (err) => {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    return toast.error("Community already exists.", {
                        description: "Please choose a different community name.",
                    });
                }
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }
            toast.error("An error occurred.", {
                description: "Could not create community.",
            });
        },
        onSuccess: (data) => {
            router.push(`/cb/${data.name}`);
        },
    });

    return (
        <div className="pt-14 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl"
            >
                <div className="bg-gray-800 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-purple-500 border-opacity-30">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <motion.h1
                                initial={{ x: -20 }}
                                animate={{ x: 0 }}
                                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center"
                            >
                                <Castle className="mr-3 text-purple-400" size={36} />
                                Create a Castle
                            </motion.h1>
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="text-purple-300 hover:text-white hover:bg-purple-700 transition-colors duration-300"
                            >
                                <ChevronLeft size={24} />
                            </Button>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">
                                    Castle Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                                        cb/
                                    </span>
                                    <Input
                                        id="name"
                                        value={communityName}
                                        onChange={(e) => setCommunityName(e.target.value)}
                                        maxLength={21}
                                        className="pl-10 bg-purple-900 bg-opacity-50 border-purple-500 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-600 transition-all duration-300"
                                        placeholder="your-awesome-castle"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-purple-400 flex items-center">
                                    <Sparkles size={14} className="mr-1" />
                                    {21 - communityName.length} characters remaining
                                </p>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-purple-300 mb-2">
                                    Castle Description
                                </label>
                                <Input
                                    id="description"
                                    value={communityDescription}
                                    onChange={(e) => setCommunityDescription(e.target.value)}
                                    maxLength={60}
                                    className="bg-purple-900 bg-opacity-50 border-purple-500 text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-600 transition-all duration-300"
                                    placeholder="A magical realm for..."
                                />
                                <p className="mt-2 text-xs text-purple-400 flex items-center">
                                    <Sparkles size={14} className="mr-1" />
                                    {60 - communityDescription.length} characters remaining
                                </p>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-10"
                        >
                            <Button
                                onClick={() => createCommunity()}
                                disabled={isLoading || communityName.length === 0}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2" />
                                        Conjure Community
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;
