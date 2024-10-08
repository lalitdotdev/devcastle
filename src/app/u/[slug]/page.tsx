import {
    Code2Icon,
    Github,
    Globe,
    GraduationCap,
    HeartHandshake,
    Instagram,
    Linkedin,
    Twitter,
    UserCheck2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import React from 'react';
import { Timeline } from "../_components/Timeline";
import { UserCog } from 'lucide-react';
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

interface pageProps {
    params: {
        slug: string;
    };
}

// const socials = {
//     twitter: "https://twitter.com/mrExplorist",
//     github: "https://github.com/mrExplorist",
//     linkedin: "https://www.linkedin.com/in/pinglalit/",
//     website: "https://lalitsharma-portfolio.netlify.app/",
//     instagram: "",
// };



const user = {
    about:
        "I am a full stack developer with 2+ years of experience in building web applications",
    followersCount: 80,
    followingCount: 20,
    articlesCount: 2,
    socials: {
        twitter: "https://twitter.com/mrExplorist",
        github: "https://github.com/mrExplorist",
        linkedin: "https://www.linkedin.com/in/pinglalit/",
        website: "https://litsharmadev.tech/",
        instagram: "",
    },
}





// generate metadata for the page after /cb in slug

export function generateMetadata({ params: { slug } }: pageProps): Metadata {
    return {
        title: `${slug} | Profile`,
        description: `Profile of ${slug}`,
    };
}

const Page = async ({ params }: pageProps) => {
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

    // Get user posts from db


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

        <main className="mx-auto my-6 w-full px-4  sm:max-w-5xl md:max-w-6xl lg:px-8">
            <div className="flex flex-col md:flex-row py-8 justify-center md:items-center  border-gray-600 mb-4 rounded-md border p-4">
                <div className=" w-full flex flex-col md:justify-start items-center md:flex-row md:gap-4">
                    <div className="sm:m-0 shadow-lg overflow-hidden h-[74px] w-[74px]   border-4 rounded-full  mt-1 object-cover">
                        {profile?.image && (
                            <Image
                                src={profile?.image}
                                height={250}
                                width={250}
                                alt=""
                            />
                        )}
                    </div>
                    <div className="" >
                        <div className="flex flex-col flex-wrap justify-center md:justify-between  ">
                            <h2 className=" md:text-4xl text-2xl text-indigo-500 font-bold capitalize ml-0">
                                {profile?.username}
                            </h2>
                            <p className="text-sm  text-light-gray">{profile?.about} </p>

                            {/* only show followers and followings for user's own profile and dont show on other's profile */}
                            {
                                session?.user.id !== profile?.id ? (
                                    <div className="flex w-full flex-wrap sm:w-auto gap-x-4 py-4 items-center justify-start">
                                        <span className="tracking-wider cursor hover:text-indigo-500 text-gray-500  flex gap-1">
                                            <span className="text-gray-400 dark:text-gray-300">
                                                {user.followersCount}
                                            </span>
                                            <span className="cursor-pointer">Follower</span>
                                        </span>
                                        <span className="tracking-wider text-gray-500 dark:text-gray-400  flex gap-1">
                                            <span className="text-gray-400 dark:text-gray-300">
                                                {user.followingCount}
                                            </span>
                                            <span className="hover:text-indigo-500 cursor-pointer">
                                                Following
                                            </span>
                                        </span>
                                        <span className="tracking-wider text-gray-500 dark:text-gray-400  flex gap-1">
                                            <span className="text-gray-400 dark:text-gray-300">
                                                {user.articlesCount}
                                            </span>
                                            <span className="hover:text-indigo-500 cursor-pointer">
                                                Articles
                                            </span>
                                        </span>
                                    </div>
                                ) : (
                                    // Show socials for other users with icons from lucide react as link
                                    <div className="flex w-full justify-center pb-4 sm:mt-0 sm:mb-0 sm:w-auto sm:justify-start gap-3 relative md:top-3  opacity-70 text-gray-500 ">
                                        {user.socials?.twitter && (
                                            <a href={user.socials.twitter} target="_blank" rel="noreferrer">
                                                <Twitter className="h-6 w-6 hover:text-indigo-500 ">
                                                    Twitter
                                                </Twitter>
                                            </a>
                                        )}

                                        {user.socials?.github && (
                                            <a href={user.socials?.github} target="_blank" rel="noreferrer">
                                                <Github className="h-6 w-6 hover:text-indigo-500 ">
                                                    Github
                                                </Github>
                                            </a>
                                        )}
                                        {user.socials?.website && (
                                            <a href={user.socials?.website} target="_blank" rel="noreferrer">
                                                <Globe className="h-6 w-6 hover:text-indigo-500 " />
                                            </a>
                                        )}

                                        {user.socials?.linkedin && (
                                            <a
                                                href={user.socials?.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Linkedin className="h-6 w-6 hover:text-indigo-500 " />
                                            </a>
                                        )}

                                        {user.socials?.instagram && (
                                            <a
                                                href={user.socials?.instagram}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Instagram className="h-5 w-5 " />
                                            </a>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                {/*TODO: Hard Coded now will fetch from DB */}


                <div className='flex flex-col items-end w-full text-lg'>
                    {
                        session?.user?.id !== profile?.id && (
                            <Link href="/mentorship" >
                                <Button className=" gap-2 px-3 py-2 font-semibold  uppercase tracking-wide  text-zinc-400">
                                    <HeartHandshake size={28} />
                                    <span className="font-semibold uppercase text-lg">
                                        Book a session</span>
                                </Button>
                            </Link>
                        )
                    }
                    {session?.user?.id === profile?.id ? (
                        <Link href="/dashboard">
                            <Button className=" gap-2 px-3 py-2 font-semibold  uppercase tracking-wide  text-zinc-400">
                                <UserCog className="text-indigo-500" size={52} />
                            </Button>


                        </Link>
                    ) : (
                        <Button className="gap-2 tracking-wide px-3 py-2  font-semibold  uppercase text-lg text-zinc-400">
                            <UserCheck2 size={32} />Follow
                        </Button>
                    )}



                </div>
                {/* Show edit on profile if the  */}

            </div>



            {/* Profile tabs */}
            <div>
                <Tabs defaultValue="about" className="w-full">
                    <div className="border-b border-neutral-600 md:font-semibold w-full ">
                        <TabsList className="grid md:grid-cols-6 grid-cols-3 md:w-4/5 w-full ">
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="articles">Articles</TabsTrigger>
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="experience" className="mr-4">
                                Experience
                            </TabsTrigger>
                            <TabsTrigger value="techstack" className="mr-4">
                                Tech Stack
                            </TabsTrigger>

                            <TabsTrigger value="repositories">Repositories</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="about" className="max-lg:pt-4">
                        <div className="flex flex-col gap-4 p-4">
                            <p className="text-gray-400 w-2/3">{profile?.about}</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="articles" className="max-lg:pt-4">Articles</TabsContent>
                    <TabsContent value="posts" className="max-lg:pt-4">

                    </TabsContent>

                    <TabsContent value='experience' className="max-lg:pt-4">

                        <div className="w-full">
                            <Timeline data={data} />
                        </div>

                    </TabsContent>

                    <TabsContent value="repositories" className="max-lg:pt-4"></TabsContent>
                </Tabs>
            </div>
        </main >

    );
};

export default Page;
