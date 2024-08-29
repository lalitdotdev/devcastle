'use server'

import Recommedations from './Recommedations'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'

const RightAside = async (

) => {
    const session = await getServerSession()


    const communities = await db.community.findMany({
        take: 7,
        orderBy: {
            subscribers: {
                _count: "desc",
            },
        },
    })







    // check if the user is subscribed to the community or not and display the join or leave button accordingly
    //   fetch 5 communities from the database based on number of joined members

    const subscribedCommunities = await db.subscription.findMany({
        where: {
            userId: session?.user?.id,
        },
        include: {
            community: true,
        },
    });

    const isSubscribed = !!subscribedCommunities;





    // return (
    //     <pre className="mt-16 text-white">
    //         {JSON.stringify(communities, null, 2)}
    //     </pre>
    // )


    // map over the communities and display them in the right aside component with a link to the community page and a join button if the user is not subscribed to the community and a leave button if the user is subscribed to the community

    return (
        <div className='flex-col gap-4'>
            <Recommedations communities={communities} isSubscribed={isSubscribed} />

        </div>

    )

}

export default RightAside
