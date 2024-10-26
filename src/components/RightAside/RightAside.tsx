// RightAside.tsx
import { getSubscribedCommunities, getTopCommunities } from '@/app/feed/actions'

import Recommendations from './Recommendations'

const RightAside = async () => {
    // Fetch data using server actions
    const [communities, subscribedCommunityIds] = await Promise.all([
        getTopCommunities(),
        getSubscribedCommunities(),
    ])

    return (
        <div className='flex-col gap-4'>
            <Recommendations
                communities={communities}
                subscribedCommunityIds={subscribedCommunityIds}
            />
        </div>
    )
}

export default RightAside
