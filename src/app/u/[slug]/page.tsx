import {
    Code2Icon,
    Github,
    Globe,
    GraduationCap,
    HeartHandshake,
    Instagram,
    Linkedin,
    LucideIcon,
    Twitter,
    UserCheck2,
    UserCog
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React from 'react';
import { Timeline } from "../_components/Timeline";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

interface pageProps {
    params: {
        slug: string;
    };
}
interface Profile {
    id: string;
    username: string;
    image: string | null;
    about: string | null;
}

interface Session {
    user: {
        id: string;
    };
}

interface Social {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    instagram?: string;
}

interface User {
    about?: string;
    followersCount?: number;
    followingCount?: number;
    articlesCount?: number;
    socials?: Social;
}

interface TimelineData {
    title: string;
    content: React.ReactNode;
}

interface ProfilePageProps {
    profile: Profile;
    session: Session | null;
    user?: User;
    data: TimelineData[];
    params: {
        slug: string;
    };
}

interface StatProps {
    label: string;
    value: number;
}

interface SocialLinkProps {
    platform: keyof Social;
    url: string;
}



// Default user data
const defaultUser: User = {
    about: "",
    followersCount: 0,
    followingCount: 0,
    articlesCount: 0,
    socials: {
        twitter: "",
        github: "",
        linkedin: "",
        website: "",
        instagram: ""
    }
};


export function generateMetadata({ params: { slug } }: pageProps): Metadata {
    return {
        title: `${slug} | Profile`,
        description: `Profile of ${slug}`,
    };
}
const ProfilePage = async ({ params }: ProfilePageProps) => {
    // Merge default user with provided user data

    const { slug } = params;

    const session = await getAuthSession();

    const profile = await db.user.findFirst({
        where: {
            username: slug,
        },
        select: {
            id: true,
            username: true,
            image: true,
            about: true,
        }
    });


    const data = [
        {
            title: "2024",
            content: (
                <div>
                    <p className="text-neutral-500 text-xs md:text-sm font-normal mb-8">
                        Scaled and optimized speed of blah blah 10x times.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src="https://assets.aceternity.com/templates/startup-1.webp"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/templates/startup-2.webp"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/templates/startup-3.webp"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/templates/startup-4.webp"
                            alt="startup template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Early 2023",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        I usually run out of copy, but when I see content this big, I try to
                        integrate lorem ipsum.
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Lorem ipsum is for people who are too lazy to write copy. But we are
                        not. Here are some more example of beautiful designs I built.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src="https://assets.aceternity.com/pro/hero-sections.png"
                            alt="hero template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/features-section.png"
                            alt="feature template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/pro/bento-grids.png"
                            alt="bento template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/cards.png"
                            alt="cards template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Changelog",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                        Deployed 5 new components on Aceternity today
                    </p>
                    <div className="mb-8">
                        <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                            ✅ Card grid component
                        </div>
                        <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                            ✅ Startup template Aceternity
                        </div>
                        <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                            ✅ Random file upload lol
                        </div>
                        <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                            ✅ Himesh Reshammiya Music CD
                        </div>
                        <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
                            ✅ Salman Bhai Fan Club registrations open
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src="https://assets.aceternity.com/pro/hero-sections.png"
                            alt="hero template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/features-section.png"
                            alt="feature template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/pro/bento-grids.png"
                            alt="bento template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                        <Image
                            src="https://assets.aceternity.com/cards.png"
                            alt="cards template"
                            width={500}
                            height={500}
                            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
                        />
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="min-h-screen ">
            <main className="mx-auto w-full px-4 py-12 sm:max-w-6xl  lg:px-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gray-800/50 p-8 backdrop-blur-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                    <div className="relative flex flex-col md:flex-row gap-8">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                            <div className="relative h-32 w-32 rounded-2xl overflow-hidden ring-4 ring-indigo-500/30">
                                {profile?.image && (
                                    <Image
                                        src={profile.image}
                                        alt=""
                                        width={128}
                                        height={128}
                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    {profile?.username}
                                </h1>
                                <div className="flex gap-3">
                                    {session?.user?.id !== profile?.id ? (
                                        <Link href="/mentorship">
                                            <Button className="group bg-indigo-500 hover:bg-indigo-600 text-white">
                                                <HeartHandshake className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                                Book a session
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/dashboard">
                                            <Button variant="outline" className="group">
                                                <UserCog className="h-5 w-5 text-indigo-400 transition-transform group-hover:scale-110" />
                                            </Button>
                                        </Link>
                                    )}
                                    {session?.user?.id !== profile?.id && (
                                        <Button className="group bg-gray-700 hover:bg-gray-600">
                                            <UserCheck2 className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                            Follow
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-300">{profile?.about}</p>

                            {session?.user?.id !== profile?.id ? (
                                <div className="flex gap-6">
                                    <Stat label="Followers" value={defaultUser.followersCount || 0} />
                                    <Stat label="Following" value={defaultUser.followingCount || 0} />
                                    <Stat label="Articles" value={defaultUser.articlesCount || 0} />
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    {defaultUser.socials && Object.entries(defaultUser.socials).map(([platform, url]) => (
                                        url && <SocialLink key={platform} platform={platform as keyof Social} url={url} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-8">
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="flex justify-start gap-2 p-1 bg-gray-800/50 backdrop-blur-lg rounded-lg">
                            <TabsTrigger value="about" className="text-sm">About</TabsTrigger>
                            <TabsTrigger value="articles" className="text-sm">Articles</TabsTrigger>
                            <TabsTrigger value="posts" className="text-sm">Posts</TabsTrigger>
                            <TabsTrigger value="experience" className="text-sm">Experience</TabsTrigger>
                            <TabsTrigger value="techstack" className="text-sm">Tech Stack</TabsTrigger>
                            <TabsTrigger value="repositories" className="text-sm">Repositories</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="about">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <p className="text-gray-300 leading-relaxed">{profile?.about}</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="experience">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <Timeline data={data} />
                                </div>
                            </TabsContent>

                            <TabsContent value="articles">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <p className="text-gray-300">Articles</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="posts">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <p className="text-gray-300">Posts</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="techstack">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <p className="text-gray-300">Tech Stack</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="repositories">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <p className="text-gray-300">Repositories</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="projects">
                                <div className="rounded-xl bg-gray-800/50 backdrop-blur-lg p-6">
                                    <p className="text-gray-300">Projects</p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

const Stat: React.FC<StatProps> = ({ label, value }) => (
    <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-indigo-400">{value}</span>
        <span className="text-sm text-gray-400">{label}</span>
    </div>
);

const SocialLink: React.FC<SocialLinkProps> = ({ platform, url }) => {
    const icons: Record<keyof Social, LucideIcon> = {
        twitter: Twitter,
        github: Github,
        linkedin: Linkedin,
        website: Globe,
        instagram: Instagram
    };
    const Icon = icons[platform];

    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
        >
            <Icon className="h-5 w-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
        </a>
    );
};

export default ProfilePage;
