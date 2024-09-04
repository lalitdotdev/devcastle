"use client"

import { ArrowBigUpDash, ArrowUpRight, Link as LinkIcon, MessageCircle, ThumbsUp, Vote } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProductHuntPosts } from '@/app/feed/getProductHuntPosts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProducthuntThumbnail {
    type: string;
    url: string;
}

interface ProducthuntTopic {
    name: string;
}


interface Producthunt {
    id: string;
    name: string;
    tagline: string;
    description: string;
    createdAt?: Date;
    url: string;
    votesCount: number;
    topics?: ProducthuntTopic[] & {
        edges: {
            node: {
                name: string;
            }
        }[]
    };
    thumbnail: ProducthuntThumbnail;
    website: string;
    reviewsRating?: number; // Make this optional
}

export default function ProductHuntFeedImporter() {
    const [posts, setPosts] = useState<Producthunt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImportFeed = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedPosts = await fetchProductHuntPosts();
            setPosts(fetchedPosts);
            console.log(fetchedPosts);
            toast.success('Product Hunt feed imported successfully!');
        } catch (err) {
            toast.error('Error importing Product Hunt feed');
            setError('Failed to fetch posts. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto  space-y-8 text-gray-200">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 bg-gradient-to-br from-zinc-800 to-transparent p-4 rounded-xl w-full justify-between"
            >
                <div className='flex items-center gap-2'>
                    <Image src="/assets/images/product-hunt-logo.png" alt="Product Hunt" sizes='(max-width: 768px) 100vw, 640px' width={64} height={64} className='animate-gradient transition-all delay-200' />
                    <h1 className="font-normal text-2xl md:text-3xl  text-gray-400">
                        Product Hunt Feed
                    </h1>
                </div>

                <Button
                    onClick={handleImportFeed}
                    disabled={isLoading || posts.length > 0}
                    className="px-4 py-2 text-sm font-medium border border-zinc-700 hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-300"
                >
                    {isLoading ? 'Importing...' : 'Import Feed'}
                </Button>



            </motion.div>

            {error && (
                <motion.p
                    className="text-red-400 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {error}
                </motion.p>
            )}

            {posts.length > 0 && (
                <motion.ul
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {posts.map((post, index) => (
                        <motion.li
                            key={post.id}
                            className="bg-[#242A30] rounded-md overflow-hidden hover:bg-[#2C353D] transition-colors duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className="p-4 flex items-center space-x-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-md">
                                    {post.thumbnail && (
                                        <Image
                                            src={post.thumbnail.url}
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

                                        {
                                            post.createdAt && (
                                                <span className="flex items-center">
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            )
                                        }

                                        {post.reviewsRating !== undefined && (
                                            <span className="flex items-center">
                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                {post.reviewsRating.toFixed(1)}
                                            </span>
                                        )}
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
                                            className="hidden sm:flex shrink-0 justify-between  gap-2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}

                                        >
                                            {/* map over 3 topic names only of each post */}
                                            {post.topics?.edges.slice(0, 2).map(({ node }) => (
                                                <Badge key={node.name} variant="secondary" className="bg-transparent border border-zinc-700 text-zinc-400 hover:bg-zinc-700/40 hover:text-white text-[0.6rem]">
                                                    {node.name}
                                                </Badge>
                                            ))}





                                        </motion.div>
                                    </div>
                                </div>
                                <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 transition-colors duration-300"
                                >
                                    <ArrowUpRight className="w-6 h-6" />
                                </a>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </div>
    );
}
