"use client";

import { Prisma, Community } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Rotate3d } from "lucide-react";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
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
      className="relative max-w-[14rem] md:max-w-lg z-50 overflow-visible bg-transparent border border-zinc-500 hover:border-indigo-600 focus-within:ring-1  hover:border-dashed focus-within:ring-blue-500 focus-within:ring-opacity-50 rounded-lg p-2 border-dashed"
    >
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0 "
        placeholder="Search communities..."
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-[#1B1F23] top-full inset-x-0 shadow rounded-b-md text-gray-400">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Unlock the gateway to a pulsating online realm, where like-minded souls converge to ignite your niche with limitless inspiration and connection!">
              {queryResults?.map((Community) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/cb/${e}`);
                    router.refresh();
                  }}
                  key={Community.id}
                  value={Community.name}
                >
                  <Rotate3d className="mr-2 h-4 w-4 text-indigo-600" />
                  <a className="text-gray-300" href={`/cb/${Community.name}`}>
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
