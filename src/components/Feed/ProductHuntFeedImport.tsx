'use client'

import { ArrowBigUpDash, ArrowUpRight, Link as LinkIcon, MessageCircle, Rocket } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { fetchAndStoreProductHuntPosts, getProductHuntPosts } from '@/app/feed/actions/getProductHuntPosts'

import { Badge } from '../ui/badge'
import Banner from '../banner'
import Image from 'next/image'
import Link from 'next/link'
import { Separator } from '../ui/separator'
import { StatefulButton } from './Stateful-btn'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface ProductHuntPost {
    id: string
    name: string
    tagline: string
    description: string | null
    createdAt: Date
    url: string
    votesCount: number
    topics: { name: string }[]
    thumbnailUrl: string | null
    website: string | null
}

export default function ProductHuntFeed() {
    const [posts, setPosts] = useState<ProductHuntPost[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isFeedVisible, setIsFeedVisible] = useState(false)

    // Load posts from localStorage on component mount
    useEffect(() => {
        const storedPosts = localStorage.getItem('productHuntPosts')
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts))
            setIsFeedVisible(true)
        }
    }, [])

    const fetchPosts = async () => {
        try {
            const fetchedPosts = await getProductHuntPosts()
            setPosts(fetchedPosts)
            setIsFeedVisible(true)

            // Store the fetched posts in localStorage for persistence
            localStorage.setItem('productHuntPosts', JSON.stringify(fetchedPosts))
            // console.log(`Fetched ${fetchedPosts.length} posts from Product Hunt and stored in localStorage`)

        } catch (err) {
            setError('Failed to fetch posts. Please try again.')
            console.error(err)
        }
    }

    const handleImportFeed = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await fetchAndStoreProductHuntPosts()
            if (result.success) {
                toast.promise(fetchPosts(), {
                    loading: 'Fetching feed from Product Hunt...',
                    success: 'Product Hunt feed imported successfully ',
                    error: 'Failed to fetch posts. Please try again.',

                })
                await fetchPosts()
            } else {
                toast.error(result.message)
            }
        } catch (err) {
            toast.error('Error importing Product Hunt feed')
            setError('Failed to import feed. Please try again.')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mx-auto space-y-8 text-gray-200">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full flex  items-center gap-4 md:rounded-lg tracking-tight z-0  rounded-lg border border-gray-800 p-4 bg-zinc-900/50 overflow-hidden hover:bg-zinc-900 transition-colors duration-300  backdrop-blur-3xl justify-between"
            >
                <div className="flex items-center gap-2">
                    <Image
                        src="/assets/images/product-hunt-logo.png"
                        alt="Product Hunt"

                        width={64}
                        height={64}
                        className="animate-gradient transition-all delay-200"
                    />
                    <h1 className="font-normal text-2xl md:text-3xl text-gray-400">
                        Product Hunt Feed
                    </h1>

                </div>

                <StatefulButton
                    onClickAsync={handleImportFeed}
                    statusLoading='Feed importing ...'
                    statusSuccess='Feed imported successfully!'
                    disabled={posts.length > 0}
                    className="p-6 text-sm font-medium  text-white transition-colors duration-300 border border-slate-500 bg-[#9945FF] min-w-fit"
                >
                    Import feed
                </StatefulButton>
            </motion.div>

            {error && (
                <motion.p
                    className="text-red-400 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {error}
                </motion.p>
            )}


            <Banner
                variant={'success'}
                label='Discover the latest trending products and startups from Product Hunt! 🚀.'

            />
            <Separator className='bg-zinc-700 my-4' />

            {isFeedVisible && posts.length > 0 && (
                <motion.ul
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {posts.map((post) => (
                        <motion.li
                            key={post.id}
                            className="bg-zinc-900/50 border border-gray-700 rounded-md overflow-hidden hover:bg-zinc-900 transition-colors duration-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="p-4 flex items-center space-x-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-md">
                                    {post.thumbnailUrl && (
                                        <Image
                                            src={post.thumbnailUrl}
                                            alt={post.name}
                                            className="object-cover w-full h-full rounded-md"
                                            width={64}
                                            height={64}
                                        />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-white">{post.name}</h3>
                                    <p className="text-sm text-gray-400">{post.tagline}</p>
                                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                                        <span className="flex items-center">
                                            <ArrowBigUpDash className="w-4 h-4 mr-1" />
                                            {post.votesCount}
                                        </span>
                                        <span className="flex items-center">
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                        {post.website && (
                                            <Link
                                                href={post.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center hover:text-orange-500 transition-colors duration-300"
                                            >
                                                <LinkIcon className="w-4 h-4 mr-1" />
                                                Website
                                            </Link>
                                        )}
                                        <motion.div
                                            className="hidden sm:flex shrink-0 justify-between gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            {post.topics.slice(0, 2).map((topic) => (
                                                <Badge
                                                    key={topic.name}
                                                    variant="secondary"
                                                    className="bg-transparent border border-zinc-700 text-zinc-400 hover:bg-zinc-700/40 hover:text-white text-[0.6rem]"
                                                >
                                                    {topic.name}
                                                </Badge>
                                            ))}
                                        </motion.div>
                                    </div>
                                </div>
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 transition-colors duration-300 relative overflow-hidden h-fit w-fit group"
                                >
                                    <ArrowUpRight
                                        className="group-hover:-translate-y-5 group-hover:translate-x-5 duration-500 transition-transform ease-in-out-circ fill-light-gray"
                                        color="gray"
                                    />
                                    <ArrowUpRight
                                        className="absolute top-0 group-hover:translate-x-0 duration-500 group-hover:translate-y-0 transition-all ease-in-out-circ translate-y-5 -translate-x-5 fill-light-gray"
                                        color="gray"
                                    >
                                        <Rocket className="w-4 h-4 text-yellow-400" />
                                    </ArrowUpRight>
                                </a>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </div>
    )
}
