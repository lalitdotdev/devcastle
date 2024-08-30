"use client"

import Link from 'next/link';
import React from 'react';

interface Job {
    id: string;
    companyName: string;
    companyDescription: string;
    jobTitle: string;
    location: string;
    tags: string[];
    postedTime: string;
}

const mockJobs: Job[] = [
    {
        id: '1',
        companyName: 'MixRank',
        companyDescription: 'Data products for sales, marketing, finance, recruiting, and more.',
        jobTitle: 'Junior Software Engineer',
        location: 'AR / Remote (AR)',
        tags: ['Full-time', 'Data science'],
        postedTime: 'about 1 hour ago'
    },
    {
        id: '2',
        companyName: 'Peakflo',
        companyDescription: 'Bill.com for SE Asia',
        jobTitle: 'ML Engineer / Data Scientist',
        location: 'IN / Remote (IN)',
        tags: ['Full-time', 'Machine learning'],
        postedTime: '2 minutes ago'
    },
    {
        id: '3',
        companyName: 'PermitFlow',
        companyDescription: 'TurboTax for Construction Permitting',
        jobTitle: 'Customer Success Manager',
        location: 'New York City, NY / Remote (US)',
        tags: ['Full-time'],
        postedTime: 'about 1 hour ago'
    },
];

const YCJobs: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 pt-10">
            <h1 className="text-3xl font-bold mb-6 gradient-text animate-gradient">Jobs at Y Combinator startups</h1>
            <p className="mb-4 text-gray-400">Many YC startups are seeing breakout growth, and are actively hiring for all roles. Find some of the top YC companies here.</p>

            <div className='flex md:flex-row flex-col gap-4'>
                <Link href="/jobs/new" className="bg-orange-500 text-white px-4 py-2 rounded w-fit">Post a Job</Link>
                <Link href="/opportunities" className=" bg-[#6B21A8] text-white px-4 py-2 rounded w-fit ">Other Opportunities</Link>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-slate-500 pt-6">YC startup jobs added recently</h2>

            <div className="space-y-4">
                {mockJobs.map((job) => (
                    <div key={job.id} className="border border-gray-600 p-4 rounded-md bg-[#212329]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-300">{job.companyName}</h3>
                                <p className="text-sm text-gray-400">{job.companyDescription}</p>
                                <p className="font-semibold mt-2 text-slate-500">{job.jobTitle}</p>
                                <p className="text-sm text-slate-500">{job.location}</p>
                                <div className="flex gap-2 mt-2">
                                    {job.tags.map((tag, index) => (
                                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded">Apply</button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{job.postedTime}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YCJobs;
