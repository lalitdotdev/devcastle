"use client";

import * as React from "react";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ComboboxProps {
    options: { label: string; value: string }[];
    value?: string;
    onChange: (value: string) => void;
    heading: string;
}

const ListItem = ({ category, onSelect, isChecked }: any) => (
    <CommandItem
        onSelect={onSelect}
        className="flex items-center px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-150 rounded-lg mx-2 group"
    >
        <div className="flex-1 flex items-center space-x-3">
            <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                isChecked ? "border-blue-500 bg-blue-500" : "border-gray-300 group-hover:border-blue-400"
            )}>
                {isChecked && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className={cn(
                "font-medium transition-colors duration-200",
                isChecked ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"
            )}>
                {category.label}
            </span>
        </div>
    </CommandItem>
);

export const CategoriesCombobox = ({
    options,
    value,
    onChange,
    heading,
}: ComboboxProps) => {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [filtered, setFiltered] = React.useState(options);

    const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        setFiltered(
            options.filter((item) =>
                item.label.toLowerCase().includes(term.toLowerCase())
            )
        );

    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="subtle"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between px-4 py-6 ",
                        "border-2 rounded-xl transition-all duration-200",
                        "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                        open && "border-blue-500 ring-2 ring-blue-200"
                    )}
                >
                    <span className={cn(
                        "font-medium",
                        value ? "text-gray-300" : "text-gray-200"
                    )}>
                        {value
                            ? options.find((option) => option.value === value)?.label
                            : "Select option..."}
                    </span>
                    <ChevronsUpDown className={cn(
                        "ml-2 h-5 w-5 shrink-0 transition-transform duration-200",
                        open ? "rotate-180 text-blue-500" : "text-gray-400"
                    )} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 shadow-lg rounded-xl">
                <Command className="w-full">
                    <div className="w-full p-4 border-b border-gray-100 ">
                        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-200">
                            <Search className="mr-2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search category..."
                                value={searchTerm}
                                onChange={handleSearchTerm}
                                className="flex-1 w-full bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    <CommandList className="max-h-64 overflow-y-auto py-2 scrollbar-thin">
                        <CommandGroup heading={heading} className="px-3 py-2 text-xs font-semibold text-gray-100 uppercase tracking-wider ">
                            {(searchTerm === "" ? options : filtered).length > 0 ? (
                                (searchTerm === "" ? options : filtered).map((option) => (
                                    <ListItem
                                        key={option.value}
                                        category={option}
                                        onSelect={() => {
                                            onChange(option.value === value ? "" : option.value);
                                            setOpen(false);
                                        }}
                                        isChecked={option.value === value}
                                    />
                                ))
                            ) : (
                                <CommandEmpty className="py-6 text-center text-gray-500">
                                    No categories found
                                </CommandEmpty>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default CategoriesCombobox;
