import { Loader } from 'lucide-react';
import Skeleton from './ui/skeleton';

const LoadingSkeleton = () => {
    return (
        <div className='container w-full max-w-7xl'>
            {/* Loader */}
            {/* <div className="flex justify-center items-center py-10">
                <Loader className='animate-spin text-indigo-600 h-8 w-8' />
            </div> */}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto pt-14">
                {/* Tabs Skeleton */}
                <div>
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <Skeleton className="h-12 w-full rounded-full mb-4 p-6" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-20 w-full rounded-xl" />

                        </div>
                    </div>

                    {/* Main Content Placeholder */}
                    <div className="flex flex-col space-y-4 mt-8">
                        <Skeleton className="h-40 w-full rounded-xl mb-4" />
                        {/* <div className="space-y-4">
                            <Skeleton className="h-60 w-full rounded-xl" />
                            <Skeleton className="h-60 w-full rounded-xl" />
                            <Skeleton className="h-60 w-full rounded-xl" />
                        </div> */}
                    </div>
                </div>
                {/* Right Aside Skeleton */}
                <div className="flex flex-col space-y-4 p-14">
                    <Skeleton className="h-80 w-[18rem] rounded-xl" />
                    <Skeleton className="h-80 w-[18rem] rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
