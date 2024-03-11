import { Loader } from 'lucide-react'
import React from 'react'
import Skeleton from './ui/skeleton'

const LoadingSkeleton = () => {
    return (
        <div className='w-full h-screen'>
            <Loader className='animate-spin text-indigo-600 h-8 w-8 ' />
            <div className="hidden md:flex gap-4 px-28 py-10 max-w-7xl w-full justify-center items-center ">
                <div className="space-y-8 w-full">
                    <div className="flex flex-col w-full">
                        <Skeleton className="h-18 w-60 mb-4" />
                        <div className="rounded-xl bg-[#1F1F21]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </div>
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-6 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <div className="flex items-center justify-between w-1/2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <Skeleton className="h-18 w-60 mb-4" />
                        <div className="rounded-xl bg-[#1F1F21]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div>
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </div>
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-6 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <div className="flex items-center justify-between w-1/2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    <Skeleton className="w-56 h-48" />
                    <Skeleton className="w-56 h-48" />
                </div>
            </div>
        </div>
    )
}

export default LoadingSkeleton
