"use server"

import { Briefcase, Plus } from 'lucide-react'

import { Button } from '../ui/Button'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import { db } from '@/lib/db'

const JobSuggestions = async () => {

    // new JobPosting is array of jobs and i want to give link to apply on that job via link or email
    const newJobPostings = await db.job.findMany({
        take: 10,
        orderBy: {
            createdAt: "desc",
        },
    });

    return (

        <div className="hidden lg:block w-full  ">
            <div className=" top-0 overflow-y-scroll h-3/4">
                <div className=" rounded-lg p-4 mb-4  shadow-sm ">
                    {/* Want to giv background image in below div */}

                    <Separator className=' bg-gray-700 my-4' />

                    <ul className="flex flex-col space-y-4">
                        {newJobPostings.map((job) => (
                            <li key={job.id} className="mb-4 flex justify-between  text-sm text-gray-100 ">
                                <Link href={`/jobs/${job.slug}`}>
                                    <div className="flex items-center space-x-2 mb-2 ">
                                        {/* <a className="flex items-center space-x-2"> */}
                                        {/* <Image
                                            src={job.name}
                                            alt={job.name}
                                            className="w-8 h-8 rounded-full"
                                        /> */}
                                        <Briefcase size={24} className="text-indigo-600" />


                                        <span>{job?.title}</span>

                                        {/* job member count here */}


                                        {/* </a> */}
                                    </div>
                                </Link>

                                {/* if applicationEmail is there then give mailto link else give applicationUrl */}


                                {job.applicationUrl && (
                                    <div>
                                        <Link href={job.applicationUrl}>
                                            <Button
                                                className="text-xs ml-2 rounded-xl h-5 text-gray-500 hover:text-indigo-500"
                                                variant='link'
                                            >
                                                Apply
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex mt-4">
                        <Link href="/jobs/new">
                            <Button
                                className="w-full text-xs rounded-xl h-6 px-2  transition-all bg-indigo-700 ease-in-out text-white gap-1"
                            >
                                <Plus size={16} strokeWidth={4} />
                                Create a Job Posting
                            </Button>
                        </Link>
                    </div>
                </div>


            </div>

        </div >
    )
}

export default JobSuggestions
