"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";
import { Community, Prisma } from "@prisma/client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Globe } from "lucide-react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useQuery } from "@tanstack/react-query";

interface SearchBarProps { }

const SearchBar: FC<SearchBarProps> = ({ }) => {
    const [input, setInput] = useState<string>("");
    const pathname = usePathname();
    const commandRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useOnClickOutside(commandRef, () => {
        setInput("");
    });

    const request = debounce(async () => {
        refetch();
    }, 300);

    const debounceRequest = useCallback(() => {
        request();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        isFetching,
        data: queryResults,
        refetch,
        isFetched,
    } = useQuery({
        queryFn: async () => {
            if (!input) return [];
            const { data } = await axios.get(`/api/search?q=${input}`);
            return data as (Community & {
                _count: Prisma.CommunityCountOutputType;
            })[];
        },
        queryKey: ["search-query"],
        enabled: false,
    });

    useEffect(() => {
        setInput("");
    }, [pathname]);

    return (
        <Command
            ref={commandRef}
            className="relative w-[10rem] md:w-[18rem] max-w-[20rem] z-50 overflow-visible bg-transparent border  focus-within:ring-1 focus-within:ring-opacity-50 rounded-lg p-1 border-zinc-700 "
        >
            <CommandInput
                isLoading={isFetching}
                onValueChange={(text) => {
                    setInput(text);
                    debounceRequest();
                }}
                value={input}
                className="outline-none border-none focus:border-none focus:outline-none ring-0 "
                placeholder="Search communities to join..."
            />

            {input.length > 0 && (
                <CommandList className="absolute z-50  border border-zinc-600 top-full bg-[#2D333B] inset-x-0 shadow rounded-md text-gray-400">
                    {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading="Unlock the gateway to a pulsating online realm!">
                            {queryResults?.map((Community) => (
                                <CommandItem
                                    onSelect={(e) => {
                                        router.push(`/cb/${e}`);
                                        router.refresh();
                                    }}
                                    key={Community.id}
                                    value={Community.name}
                                    className="cursor-pointer hover:bg-zinc-600 z-999"
                                >
                                    <Globe className="mr-2 h-4 w-4 text-zinc-400 " />
                                    <a className=" hover:text-gray-400 cursor-pointer" href={`/cb/${Community.name}`}>
                                        cb/{Community.name}
                                    </a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            )}
        </Command>
    );
};

export default SearchBar;
