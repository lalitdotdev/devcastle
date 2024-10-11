import NextTopLoader from 'nextjs-toploader';

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <NextTopLoader
            color="#2299DD"
            initialPosition={20}
            crawlSpeed={200}
            height={20}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div>
        <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1000}
            showAtBottom={true}
        />
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 py-6 space-y-8 space-x-24 w-full  md:px-10 md:pl-20 ">
        //     <div className="w-full ">
        //         <LoadingSkeleton />
        //     </div>

        // </div>
    )
}

