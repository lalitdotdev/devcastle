"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Globe } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useQuery } from "@tanstack/react-query";

interface SearchBarProps { }

const SearchBar: FC<SearchBarProps> = () => {
    const [input, setInput] = useState<string>("");
    const pathname = usePathname();
    const commandRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useOnClickOutside(commandRef, () => {
        setInput("");
    });

    const {
        isFetching,
        data: queryResults,
        refetch,
        isFetched,
    } = useQuery({
        queryFn: async () => {
            if (!input.trim()) return []; // Always return an empty array for empty input
            const { data } = await axios.get(`/api/search?q=${input}`);
            return Array.isArray(data) ? data : [];
        },
        queryKey: ["search-query"],
        enabled: false, // Initially disabled; only fetch on valid input
    });

    // Debounced request function to avoid excessive API calls
    const request = useCallback(
        debounce(() => {
            if (input.trim() !== "") {
                refetch();
            }
        }, 300),
        [input, refetch]
    );

    const handleInputChange = (text: string) => {
        setInput(text);
        // Only request if the input is not empty
        if (text.trim() !== "") {
            request();
        }
    };

    useEffect(() => {
        setInput(""); // Clear input on path change
    }, [pathname]);

    const safeQueryResults = Array.isArray(queryResults) ? queryResults : [];
    // Add this console log just before the return statement
    console.log("Rendering SearchBar with:", { input, isFetching, isFetched, safeQueryResults });


    return (
        <Command
            ref={commandRef}
            className="relative w-[6rem] md:w-[20rem] max-w-[26rem] overflow-visible bg-transparent border focus-within:ring-1 focus-within:ring-opacity-50 rounded-lg border-zinc-700"
        >
            <CommandInput
                isLoading={isFetching}
                onValueChange={handleInputChange}
                value={input}
                className="h-7 w-full bg-transparent text-[0.9rem] focus:outline-none text-white [&:not(:placeholder-shown)~button]:visible [&:not(:placeholder-shown)~button]:opacity-100"
                placeholder="Search communities to join..."
            />

            {input.trim().length > 0 && (
                <CommandList className="absolute border border-zinc-600 top-full inset-x-0 shadow rounded-md text-gray-300 z-9999">
                    {isFetched && safeQueryResults.length === 0 && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    {safeQueryResults.length > 0 && (
                        <CommandGroup heading="Unlock the gateway to a pulsating online realm!" className="z-50">
                            {safeQueryResults.map((community) => (
                                <CommandItem
                                    onSelect={() => {
                                        router.push(`/cb/${community.name}`);
                                        router.refresh();
                                    }}
                                    key={community.id}
                                    value={community.name}
                                    className="cursor-pointer hover:bg-zinc-600 justify-between"
                                >
                                    <div className="flex items-center justify-center">
                                        <Globe className="mr-2 h-4 w-4 text-zinc-400" />
                                        <a className="hover:text-gray-00 text-gray-300 cursor-pointer" href={`/cb/${community.name}`}>
                                            cb/{community.name}
                                        </a>
                                    </div>

                                    <span className="text-gray-400 text-xs ml-1">
                                        {community._count?.posts} posts
                                    </span>
                                    <span className="text-gray-400 text-xs items-start">
                                        {community._count?.subscribers} members
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            )}
        </Command>
    );
};

export default SearchBar;
