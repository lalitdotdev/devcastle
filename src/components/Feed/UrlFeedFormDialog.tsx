"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Rss } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { XMLParser } from "fast-xml-parser";
import { getUrlFeedParser } from "@/app/feed/actions/getUrlFeedParser";
import { toast } from "sonner";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema
const formSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
});

// Define the type for our form
type FormData = z.infer<typeof formSchema>;

// Server action to add feed and fetch its contents
async function addFeed(data: FormData) {


    try {
        const response = await getUrlFeedParser(data.url);
        console.log(response);
    } catch (error) {
        console.error("Failed to fetch or parse feed:", error);
        return { success: false, error: "Failed to fetch or parse feed" };
    }
}


export default function AddFeedDialog() {
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data: FormData) => {
        try {
            const result = await addFeed(data);
            if (result?.success) {
                toast.success("Feed imported successfully");
                reset();
                setOpen(false);
            } else {
                toast.error('Failed to import feed', {
                    description: result?.error,
                });
            }

        } catch (error) {
            toast.error('Failed to import feed', {
                description: error instanceof Error ? error.message : "An unknown error occurred",

            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center space-x-2 text-zinc-100 gap-1">
                    <Rss className="h-4 w-4" />
                    Rss Feed URL

                </div>

            </DialogTrigger>
            <DialogContent className=" bg-gray-800 text-white">
                <DialogHeader className=" ">
                    <div className="flex items-center gap-2 ">
                        <Rss className="bg-white text-zinc-800 rounded-lg h-8 w-8 p-1" />
                        <div>
                            <DialogTitle>Publication or Blog(Beta)</DialogTitle>
                            <p className="text-sm text-zinc-500">Add a new RSS feed to your feed list</p>
                        </div>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="name">Feed Name</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Enter feed name"
                            className="border-none"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div> */}
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="url">RSS Feed URL</Label>
                        <Input
                            id="url"
                            {...register("url")}
                            placeholder="Enter RSS feed URL"
                            className="border-blue-500 border-2"
                        />
                        {errors.url && <p className="text-sm text-red-500">{errors.url.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="subtle" onClick={() => setOpen(false)} className="bg-gray-800 text-zinc-500 border-none">Cancel</Button>
                        <Button type="submit" className="bg-black text-white">Add Feed</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
