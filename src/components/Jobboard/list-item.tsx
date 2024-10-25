"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListItemProps {
    category: any;
    onSelect: (category: any) => void;
    isChecked: boolean;
}

export const ListItem = ({ category, onSelect, isChecked }: ListItemProps) => {
    return (
        <div
            className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-50 text-neutral-200 hover:text-primary"
            onClick={() => onSelect(category)}
        >
            <Check
                className={cn(
                    "ml-auto h-4 w-4",
                    isChecked ? "opacity-100" : "opacity-0"
                )}
            />
            <p className="w-full truncate text-sm whitespace-nowrap text-white">
                {category.label}
            </p>
        </div>
    );
};
