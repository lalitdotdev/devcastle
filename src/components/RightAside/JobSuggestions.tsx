import { Job } from '@prisma/client'
import { Briefcase, Plus } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/Button'
'

interface JobSuggestionsProps {
    newJobPostings: Job[]
}

const JobSuggestions: FC<JobSuggestionsProps> = ({ newJobPostings }) => {

    // new JobPosting is array of jobs and i want to give link to apply on that job via link or email

    return (

        <div className="hidden lg:block lg:w-80  ">
            <div className="h-fit">
                <div className=" bg-[#212329] rounded-lg p-4 mb-4 text-white  shadow-sm ">
                    {/* Want to giv background image in below div */}
                    <div className='flex flex-end px-[6px] py-[10px] h-[120px] border-lg font-semibold bg-castle-art bg-cover'>
                        <h2 className="text-lg font-bold text-zinc-300">
                            New Opportunities
                        </h2>
                    </div>
                    <Separator className=' bg-gray-500 my-4' />

                    <ul>
                        {newJobPostings.map((job) => (
                            <li key={job.id} className="mb-4 flex justify-between border-b  border-gray-500 text-sm">
                                <Link href={`/jobs/${job.slug}`}>
                                    <div className="flex items-center space-x-2 mb-2">
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
