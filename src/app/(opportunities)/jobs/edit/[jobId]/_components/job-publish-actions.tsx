"use client"

import React, { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Trash } from 'lucide-react'

interface JobPublishActionsProps {
    jobId: string
    disabled: boolean
    isPublished: boolean
}




const JobPublishActions = ({
    jobId,
    disabled,
    isPublished
}: JobPublishActionsProps) => {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className='flex items-center gap-x-3'>
            <Button variant={"ghost"} disabled={disabled || isLoading} size={"sm"} className='border-2 border-neutral-500 text-neutral-500 ' onClick={() => setIsLoading(true)}>
                {
                    isPublished ? "Unpublish" : "Publish"
                }
            </Button>

            {/* delete button */}
            <Button variant={"destructive"} disabled={disabled || isLoading} size={"sm"} className='bg-red-500 ' onClick={() => setIsLoading(true)}>
                <Trash className='w-4 h-4' />
            </Button>
        </div>
    )
}

export default JobPublishActions
