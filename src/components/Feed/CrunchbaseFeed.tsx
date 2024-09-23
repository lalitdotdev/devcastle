"use client"

import { Calendar, ChevronDown, DollarSign, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { fetchCrunchbaseFeed } from '@/app/feed/actions/getCrunchbaseParams';
import { toast } from 'sonner';

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short'
    }).format(num);
};

interface CrunchbaseEntity {
    uuid: string;
    name: string;
    shortDescription: string;
    profileImageUrl: string;
    website: string;
    fundingTotal: number;
    foundedOn: string;
    employeeCount: string;
}

export default function CrunchbaseFeed() {
    const [feedData, setFeedData] = useState<CrunchbaseEntity[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const loadFeed = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCrunchbaseFeed({
                types: ['company'],
                sortColumn: 'last_funding_at',
                sortOrder: 'desc',
                limit: 10,
                page: page,
            });
            setFeedData(prev => [...prev, ...data.entities]);

        } catch (error) {
            toast.error('Failed to load Crunchbase feed data! Requires paid licensing! 😢', {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '10px',
                    fontSize: '14px',
                },

            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeed();
    }, [page]);



    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Trending Companies</h1>
            <ul className="grid gap-4 md:border-l md:px-4 border-gray-700 rounded-md">
                {feedData.map((company, index) => (
                    <li
                        key={company.uuid}
                        className="rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-700 p-4 hover:bg-gradient-to-bl from-gray-700 to-gray-800"
                        style={{
                            opacity: 0,
                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                        }}
                    >
                        <Link href={company.website} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center mb-2">
                                <Image
                                    src={company.profileImageUrl || '/placeholder-image.jpg'}
                                    alt={company.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                    width={40}
                                    height={40}
                                />
                                <div className="text-lg md:font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                                    {company.name}
                                </div>
                            </div>

                            {company.shortDescription && (
                                <div className="text-sm text-gray-400 mt-2">
                                    {company.shortDescription}
                                </div>
                            )}

                            <div className="flex flex-wrap justify-between items-center mt-4 text-sm">
                                <span className="text-teal-400 flex items-center gap-1 mb-1">
                                    <DollarSign size={16} />
                                    {company.fundingTotal ? `$${formatNumber(company.fundingTotal)}` : 'N/A'}
                                </span>
                                <span className="text-yellow-400 flex items-center gap-1 mb-1">
                                    <Calendar size={16} />
                                    {company.foundedOn || 'N/A'}
                                </span>
                                <span className="text-purple-400 flex items-center gap-1 mb-1">
                                    <Users size={16} />
                                    {company.employeeCount || 'N/A'}
                                </span>
                                <span className="text-teal-500 mt-2 w-full text-right">View on Crunchbase</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center mt-8">
                <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2 transition-colors duration-300"
                >
                    {isLoading ? 'Loading...' : 'Load More'}
                    <ChevronDown size={20} />
                </button>
            </div>
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
