"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "./ui/Button";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UserProfileValidator } from "@/lib/validators/username";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import H1 from "./h1";

interface UserDashboardProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username" | "image" | "about">;
}

type FormData = z.infer<typeof UserProfileValidator>;

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

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUserProfile(e))}
      {...props}
    >
      <Tabs defaultValue="tab1" className="md:w-[80%] items-center">
        <Tabs defaultValue="account" className="w-full">
          <div className="border-b border-gray-500">
            <TabsList className="grid grid-cols-6  md:w-[50%] gap-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="bookmarks">BookMarks</TabsTrigger>
              <TabsTrigger value="gigs">Gigs</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="imports">Imports</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="account">
            <Card className="border-none">
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
                      className="pl-6 mt-2 border-2 rounded-none p-8"
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
            <Card>
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
            <Card>
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
                <p>Bookmarks</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="gigs">
            <Card>
              <CardHeader>
                <CardTitle>Gigs and Colloborative Projects</CardTitle>
                <CardDescription>
                  <H1>
                    Your created gigs and projects to showcase your work and
                    find collaborators.
                  </H1>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Gigs</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="kanban">
            <Card>
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
            <Card>
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
                <p>Imports</p>
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
