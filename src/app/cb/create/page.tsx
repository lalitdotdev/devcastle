"use client";

import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/Button";
import { CreateCommunityPayload } from "@/lib/validators/community";
import H1 from "@/components/h1";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const [communityName, setCommunityName] = useState<string>("");
    const [communityDescription, setCommunityDescription] = useState<string>("");

    const [charsRemaining, setCharsRemaining] = useState(21);
    const [aboutCharsRemaining, setAboutCharsRemaining] = useState(60);

    const router = useRouter();
    const { loginToast } = useCustomToast();

    //what is  mutation function?
    //  TODO: create community mutation function and hook it up to the button below to create a community on the backend and redirect to the community page on success (or show an error message on failure) - see https://react-query.tanstack.com/guides/mutations for more info on mutations and https://react-query.tanstack.com/guides/queries for more info on queries (which are used in the example below) - you can also look at the other pages in this folder for examples of how to use react-query for data fetching and caching (which is what we use for all data fetching in the app) - you can also look at the docs for react-query here: https://react-query.tanstack.com/overview -

    const { mutate: createCommunity, isLoading } = useMutation({
        // data fetching

        mutationFn: async () => {
            const payload: CreateCommunityPayload = {
                name: communityName,
                description: communityDescription,
            };
            const { data } = await axios.post("/api/community", payload);

            return data;
        },

        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Community already exists.",
                        description: "Please choose a different community name.",
                        variant: "destructive",
                    });
                }

                if (err.response?.status === 401) {
                    return loginToast();
                }
            }
            toast({
                title: "An error occurred.",
                description: "Could not create community.",
                variant: "destructive",
            });
        },
        onSuccess: (data) => {
            router.push(`/cb/${data.name}`);
        },
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return;
        setCommunityName(event.target.value);
        setCharsRemaining(21 - event.target.value.length);
    };
    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.value.length > 60) return;
        setCommunityDescription(event.target.value);
        setAboutCharsRemaining(60 - event.target.value.length);
    };

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto mt-12">
            <div className="relative bg-[#212329] w-full h-fit p-4 rounded-lg space-y-6 text-gray-400 border border-gray-500">
                <div className="flex justify-between items-center">
                    <H1 className="text-xl font-semibold text-zinc-500 flex gap-2 items-center justify-center">
                        Create a Castle
                    </H1>
                </div>

                <div>
                    <h2 className="text-xl font-md text-indigo-600">Name</h2>
                    <p className="text-xs pb-2 text-gray-500">
                        Unlock the gateway to a pulsating online realm.
                    </p>
                    <div className="relative">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400  ">
                            cb/
                        </p>
                        <Input
                            value={communityName}
                            onChange={handleChange}
                            className="pl-10 align-center"
                        />
                    </div>
                    {communityName && (
                        <p
                            className={`text-xs mt-2 ${charsRemaining === 0 ? "text-red-600" : "text-gray-700"
                                }`}
                        >
                            {charsRemaining} characters remaining
                        </p>
                    )}
                    <div>
                        <p className="text-lg font-md pt-2 mt-2 text-indigo-600">
                            What is this castle all about ?
                        </p>
                        <p className="text-xs pb-2 text-gray-500">
                            Create a compelling short community description that grabs
                            attention, sparks curiosity, and entices others to join your
                            vibrant online space.
                        </p>

                        <Input
                            value={communityDescription}
                            onChange={handleDescriptionChange}
                            className="pl-2 align-center"
                        />
                    </div>
                    {communityDescription && (
                        <p
                            className={`text-xs mt-2 ${aboutCharsRemaining === 0 ? "text-red-600" : "text-gray-700"
                                }`}
                        >
                            {aboutCharsRemaining} characters remaining
                        </p>
                    )}
                </div>
                <div className="flex justify-end gap-4">
                    <Button
                        disabled={isLoading}
                        className="text-gray-400"
                        onClick={() => router.back()}

                    >
                        Dismiss
                    </Button>
                    <Button
                        isLoading={isLoading}
                        disabled={communityName.length === 0}
                        onClick={() => createCommunity()}
                        className="border border-indigo-600 text-indigo-600"
                    >
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Page;
