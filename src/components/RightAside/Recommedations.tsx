import { FC } from 'react'


import { Plus, Terminal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '../ui/Button'


import { Separator } from '../ui/separator'
import { Community } from '@prisma/client'




interface RecommedationsProps {
    communities: Community[]
}


const Recommedations: FC<RecommedationsProps> = ({ communities }) => {

    return (
        <div className="hidden lg:block lg:w-80  ">
            <div className="sticky top-0 md:top-24 h-fit">
                <div className=" bg-[#212329] rounded-lg p-4 mb-4 text-white  shadow-sm ">
                    {/* Want to giv background image in below div */}
                    <div className='flex flex-end px-[6px] py-[10px] h-[120px] border-lg font-semibold bg-castle-art bg-cover'>
                        <h2 className="text-lg font-bold text-zinc-300">Popular Castles</h2>
                    </div>
                    <Separator className=' bg-gray-500 my-4' />

                    <ul>
                        {communities.map((community) => (
                            <li key={community.id} className="mb-4 flex justify-between border-b  border-gray-500 text-sm">
                                <Link href={`/cb/${community.name}`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        {/* <a className="flex items-center space-x-2"> */}
                                        {/* <Image
                                            src={community.name}
                                            alt={community.name}
                                            className="w-8 h-8 rounded-full"
                                        /> */}
                                        <Terminal size={24} className="animate-pulse transition-all duration-800 ease-in-out text-indigo-600" />


                                        <span>{community.name}</span>

                                        {/* community member count here */}


                                        {/* </a> */}
                                    </div>
                                </Link>
                                <div>
                                    <Button
                                        className="text-xs ml-2  rounded-xl h-5 text-gray-500 hover:text-indigo-500"
                                    >
                                        Join
                                    </Button>

                                    {/* {community.creatorId !== session?.user?.id ? (
                                        <SubscribeLeaveToggle
                                            isSubscribed={isSubscribed}
                                            communityId={community.id}
                                            communityName={community.name}
                                        />
                                    ) : null} */}
                                </div>

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
