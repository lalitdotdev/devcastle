import { Button } from '../ui/Button'
import { Community } from '@prisma/client'
import CommunityAvatar from '../Avatars/CommunityAvatar'
import { FC } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Separator } from '../ui/separator'

interface RecommedationsProps {
    communities: Community[]
    isSubscribed: boolean
}


const Recommedations: FC<RecommedationsProps> = ({ communities }) => {

    return (
        <div className="hidden lg:block   ">
            <div className="sticky top-0 md:top-24 h-fit">
                <div className="  rounded-lg p-4 mb-4  text-white  shadow-sm ">
                    {/* Want to giv background image in below div */}
                    <div className='flex flex-end px-[6px] py-[10px] h-[120px] border-lg font-semibold bg-castle-art bg-cover rounded-3xl'>
                        <h2 className="text-lg font-bold text-zinc-300">Popular Castles</h2>
                    </div>
                    <Separator className=' bg-gray-700 my-4' />

                    <ul>
                        {communities.map((community) => (
                            <li key={community.id} className="mb-4 flex justify-between border-b  border-gray-700 text-sm">
                                <Link href={`/cb/${community.name}`}>
                                    <div className="flex items-center space-x-2 mb-2">

                                        <CommunityAvatar seed={community.name as string} classNames="w-6 h-6 rounded-full" />


                                        <span>{community.name}</span>


                                    </div>
                                </Link>


                            </li>
                        ))}
                    </ul>
                    <div className="flex mt-4">
                        <Link href="/cb/create">
                            <Button
                                className="w-full text-xs rounded-xl h-6 px-2  transition-all bg-indigo-700 ease-in-out text-white gap-1"
                            >
                                <Plus size={16} strokeWidth={4} />
                                Create a Castle
                            </Button>
                        </Link>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Recommedations
