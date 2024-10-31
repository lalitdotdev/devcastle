import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import Banner from '../../../../../components/banner'
import CategoryForm from './_components/category-form'
import IconBadge from '@/components/icon-badge'
import JobLocationTypeForm from './_components/job-location-type-form'
import JobPublishActions from './_components/job-publish-actions'
import JobTypeForm from './_components/job-type-form'
import Link from 'next/link'
import React from 'react'
import ShortDescriptionForm from './_components/short-description-form'
import TitleForm from './_components/title-form'
import YearsOfExperienceForm from './_components/years-of-experience-form'
import { db } from '@/lib/db'
import { getAuthSession } from '@/lib/auth'
import { isValidObjectId } from '@/lib/utils'

interface JobDetailsPageProps {
    params: {
        jobId: string
    }
}


const JobDetailsPage = async ({ params: { jobId } }: JobDetailsPageProps) => {
    console.log(jobId)

    //  check whether the id is db object id or not
    if (!isValidObjectId(jobId)) {
        notFound()
    }
    // getting user id from session
    const session = await getAuthSession();
    const userId = session?.user.id;
    if (!userId) {
        return redirect('/');
    }

    const job = await db.job.findUnique({
        where: { id: jobId, userId },

    });

    const jobCategories = await db.jobCategory.findMany({
        orderBy: {
            name: 'asc'
        }
    })


    if (!job) {
        return redirect('/opportunities/jobs');
    }
    console.log(job)

    const requiredFields = [
        job.title, job.description, job.location, job.type, job.salary, job.companyLogoUrl, job.location, job.locationType, job.applicationEmail || job.applicationUrl, job.workMode, job.companyName, job.yearsOfExperience, job.categoryId
    ]

    const totalFields = requiredFields.length;
    const filledFields = requiredFields.filter(Boolean).length;
    const completionText = `${filledFields}/${totalFields} fields completed.`
    const isComplete = requiredFields.every(Boolean);
    console.log(jobCategories)

    return (
        <div className='container p-6 mx-auto px-24'>
            <Link href='/opportunities'>
                <div className='flex items-center gap-3 text-sm text-neutral-500'>
                    <ArrowLeft className='w-4 h-4' />
                    Back
                </div>
            </Link>

            {/* Job Details */}
            <div className='flex items-center justify-between my-4'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-semibold'>Job Setup</h1>
                    <span className='text-sm text-neutral-500'>Complete all fields {completionText}</span>
                </div>


                {/* action buttons */}
                <JobPublishActions
                    jobId={jobId}
                    disabled={false}
                    isPublished={job.isPublished}

                />

                {/* warning before publishing the job */}


                {/* <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                    className="mx-8"
                >


                    {job.description}


                </ReactMarkdown>

                <div className='flex gap-2 mt-4'>
                    <span className='text-neutral-500'>{job.location}</span>
                    <span className='text-neutral-500'>{job.type}</span>
                    <span className='text-neutral-500'>{job.salary}</span>
                </div> */}
            </div>
            {
                !job.isPublished && (
                    <Banner
                        variant={'warning'}
                        label='This job is unpublished. It will not be visible in the jobs list.'

                    />
                )
            }

            {/* container for job details */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div className=''>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl text-neutral-200'>Customize your job</h2>
                    </div>
                    {/* title form */}
                    <TitleForm initialData={job} jobId={job.id} />

                    {/* category form */}

                    <CategoryForm
                        initialData={job}
                        jobId={job.id}
                        options={jobCategories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}

                    />


                    {/* Short description form */}
                    <ShortDescriptionForm initialData={job} jobId={job.id} />

                    {/* Job type form */}
                    <JobTypeForm initialData={job} jobId={job.id} />
                    {/* Job location Type form */}

                    <JobLocationTypeForm initialData={job} jobId={job.id} />

                    {/* Years of experience form */}
                    <YearsOfExperienceForm initialData={job} jobId={job.id} />
                </div>
            </div>

        </div >
    )
}

export default JobDetailsPage
