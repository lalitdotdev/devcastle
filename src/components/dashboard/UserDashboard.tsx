"use client";

import * as z from "zod";

import { Bookmark, Briefcase, Loader2, RssIcon, Trello, UserIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Job, User } from "@prisma/client";
import React, { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import axios, { AxiosError } from "axios";

import { Button } from "../ui/Button";
import H1 from "../h1";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { LucideIcon } from 'lucide-react'
import ProductHuntFeedImporter from "@/components/Feed/ProductHuntFeedImport";
import { UploadCloud } from "lucide-react";
import { UserProfileValidator } from "@/lib/validators/username";
import { cn } from "@/lib/utils";
import { getUserJobs } from "@/app/dashboard/actions";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

const Bookmarks = React.lazy(() => import("@/app/bookmarks/_components/BookMarks"));
const JobResults = React.lazy(() => import('../Jobboard/JobResults'));
interface UserDashboardProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id" | "username" | "image" | "about">;
}

type FormData = z.infer<typeof UserProfileValidator>;


interface TabIconProps {
    icon: LucideIcon,
    label: string
}

const TabIcon = ({ icon: Icon, label }: TabIconProps) => (
    <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
    </div>
);
export function UserDashboard({
    user,
    className,
    ...props
}: UserDashboardProps) {
    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(UserProfileValidator),
        defaultValues: {
            name: user?.username || "",
            about: user?.about || "",
        },
    });




    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const { mutate: updateUserProfile, isLoading } = useMutation({
        mutationFn: async ({ name, about }: FormData) => {
            const payload: FormData = { name, about };

            const { data } = await axios.patch(`/api/editprofile/`, payload);
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Username already taken.",
                        description: "Please choose another username.",
                        variant: "destructive",
                    });
                }
            }

            return toast({
                title: "Something went wrong.",
                description: "Your profile was not updated. Please try again.",
                variant: "destructive",
            });
        },
        onSuccess: () => {
            toast({
                description: "Your profile has been updated.",
            });
            router.refresh();
        },
    });
    useEffect(() => {
        async function fetchJobs() {
            try {
                const fetchedJobs = await getUserJobs();
                setJobs(fetchedJobs);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch jobs. Please try again.');
                setLoading(false);
            }
        }

        fetchJobs();
    }, []);


    if (error) return <div>{error}</div>;



    return (
        <form
            className={cn(className)}
            onSubmit={handleSubmit((e) => updateUserProfile(e))}
            {...props}
        >
            <Tabs defaultValue="tab1" className="md:w-[85%] items-center">
                <Tabs defaultValue="account" className="w-full">
                    <div className="">
                        <TabsList className="grid grid-cols-5 gap-4 mb-8 border border-gray-600">
                            <TabsTrigger value="account"><TabIcon icon={UserIcon} label="Account" /></TabsTrigger>
                            <TabsTrigger value="bookmarks"><TabIcon icon={Bookmark} label="Bookmarks" /></TabsTrigger>
                            <TabsTrigger value="createdjobs"><TabIcon icon={Briefcase} label="Jobs" /></TabsTrigger>
                            <TabsTrigger value="kanban"><TabIcon icon={Trello} label="Kanban" /></TabsTrigger>
                            <TabsTrigger value="imports"><TabIcon icon={RssIcon} label="Imports" /></TabsTrigger>
                        </TabsList>

                    </div>
                    <TabsContent value="account">
                        <Card className="border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium leading-6">
                                    <H1>Personal Information</H1>
                                </CardTitle>
                                <CardDescription className="flex flex-wrap max-w-[80%]">
                                    We value your information as it enables us to curate
                                    personalized content, connect you with like-minded
                                    individuals, and introduce you to relevant events.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Upload Avatar</Label>

                                    <div className="text-center">
                                        <div className="text-center mb-4">
                                            <div className="sm:m-0 relative shadow-lg rounded-full border-4 border-indigo-600 overflow-hidden h-[86px] w-[86px] md:h-[100px] md:w-[100px] flex justify-center items-center">
                                                {/* check if user has image then show image else show upload button */}

                                                {user.image ? (
                                                    <Image
                                                        src={user.image}
                                                        width={500}
                                                        height={500}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <UploadCloud className="h-8 w-8 text-indigo-700" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                </div>
                                <div className="relative grid gap-2">
                                    <div className="absolute top-0 left-0 h-10 grid border-r border-gray-600 ">
                                        <p className="text-sm text-zinc-400 p-2 ">curiosity/</p>
                                    </div>

                                    <div className="gap-4">
                                        <Label className="sr-only" htmlFor="name">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            className="pl-24  border-2 rounded-none"
                                            size={32}
                                            {...register("name")}
                                        />
                                    </div>

                                    <div className="text-gray-500">
                                        <Label htmlFor="about">About yourself</Label>
                                        <Input
                                            id="about"
                                            className="pl-6 border-2 rounded-none p-8"
                                            size={32}
                                            {...register("about")}
                                        />
                                    </div>
                                    {/* <div className="text-gray-500">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      className="pl-6 mt-2 border-2 rounded-none "
                      size={32}
                      {...register("tags")}
                    />
                  </div> */}
                                    <div className="text-gray-500 mt-2 gap-4">
                                        <Label htmlFor="socials">Social Profiles</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select social Profiles" />
                                            </SelectTrigger>
                                            <SelectContent className="text-gray-200 bg-[#1B1F23] border hover:border-indigo-600">
                                                <SelectItem value="linkedln">Linkedln</SelectItem>
                                                <SelectItem value="github">Github</SelectItem>
                                                <SelectItem value="twitter">Twitter</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {errors?.name && (
                                        <p className="px-1 text-xs text-red-600">
                                            {errors.name.message}
                                        </p>
                                    )}
                                    {errors?.about && (
                                        <p className="px-1 text-xs text-red-600">
                                            {errors.about.message}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    isLoading={isLoading}
                                    className="bg-transparent border hover:border-blue-500 text-gray"
                                >
                                    Update Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="articles">
                        <Card className="border-gray-700">
                            <CardHeader>
                                <CardTitle>Articles</CardTitle>
                                <CardDescription>
                                    <H1>
                                        Your articles are a great way to share your knowledge with
                                        the community.
                                    </H1>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Articles</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="bookmarks">
                        <Card className="border-gray-700">
                            <CardHeader>
                                <CardTitle>Bookmarks</CardTitle>
                                <CardDescription>
                                    <H1>
                                        Your bookmarks are a great way to save your favorite
                                        articles , resources , posts and more.
                                    </H1>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <React.Suspense fallback={<div className="flex justify-center items-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-purple-500" />

                                </div>}>
                                    <Bookmarks />
                                </React.Suspense>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="createdjobs">
                        <Card className="border-gray-700">
                            <CardHeader>
                                <CardTitle>
                                    Your created Jobs / Opportunities here
                                </CardTitle>
                                <CardDescription>
                                    <H1>
                                        Your created jobs are a great way to share your job
                                        opportunities with the community.

                                    </H1>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                                    </div>
                                ) : (
                                    <React.Suspense fallback={<div className="flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>}>
                                        <JobResults jobs={jobs} />
                                    </React.Suspense>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="kanban">
                        <Card className="border-gray-700">
                            <CardHeader>
                                <CardTitle>Kanban</CardTitle>
                                <CardDescription>
                                    <H1>
                                        Your kanban board is a great way to organize your tasks and
                                        keep track of your progress on projects , tasks , job
                                        applications and more.
                                    </H1>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>{/* Custom kanban here */}</CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="imports">
                        <Card className="border-gray-700">
                            <CardHeader>
                                <CardTitle>Imports and RSS Feed</CardTitle>
                                <CardDescription>
                                    <H1>
                                        Your imports are a great way to import your data from other
                                        platforms and rss feeds.
                                    </H1>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProductHuntFeedImporter />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you will be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  isLoading={isLoading}
                  className="bg-transparent border hover:border-blue-500 text-gray"
                >
                  Save password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent> */}
                </Tabs>
            </Tabs>
        </form>
    );
}
