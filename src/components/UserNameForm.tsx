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
import { UsernameValidator } from "@/lib/validators/username";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Image from "next/image";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username" | "image">;
}

type FormData = z.infer<typeof UsernameValidator>;

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = { name };

      const { data } = await axios.patch(`/api/username/`, payload);
      return data;
    },
    onError: err => {
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
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      });
      router.refresh();
    },
  });

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(e => updateUsername(e))}
      {...props}
    >
      <Tabs defaultValue="tab1" className="w-full">
        <Tabs defaultValue="account" className="w-[600px] ">
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger value="account" className="text-black">
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="text-black">
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your username here. Click save when you are
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label className="sr-only" htmlFor="image">
                    Profile Avatar
                  </Label>
                  <div className="text-center">
                    {/* <div className="sm:m-0 shadow-lg rounded-full overflow-hidden h-[86px] w-[86px] md:h-[100px] md:w-[100px]"> */}
                    {/* <Image src={user} width={500} height={500} alt="" /> */}
                    <div className="text-center mb-4">
                      <div className="sm:m-0 shadow-lg rounded-full border-4 border-indigo-600 overflow-hidden h-[86px] w-[86px] md:h-[100px] md:w-[100px]">
                        <Image
                          src={user?.image}
                          width={500}
                          height={500}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                <div className="relative grid gap-1 border border-gray-500 w-[300px] md:w-[400px]  hover:border-blue-600 rounded-md ">
                  <div className="absolute top-0 left-0 h-10 grid place-items-center ">
                    <span className="text-sm text-zinc-400 ml-2">u/</span>
                  </div>
                  <Label className="sr-only" htmlFor="name">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="w-[300px] md:w-[400px] pl-6"
                    size={32}
                    {...register("name")}
                  />
                  {errors?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  isLoading={isLoading}
                  className="bg-transparent border hover:border-blue-500 text-gray"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
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
          </TabsContent>
        </Tabs>
      </Tabs>
    </form>
  );
}
