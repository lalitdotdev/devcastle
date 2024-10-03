import { Button, ButtonProps } from "./Button";

import { cn } from "@/lib/utils";

//======================================
export const AnimatedButton = ({ ...props }: ButtonProps) => {
    return (
        <div className="relative overflow-hidden rounded-full bg-zinc-900 shadow border border-zinc-800 group  p-0.5">
            <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_50%_50%,#fff_0%,#262a35_7%)]  group-hover:bg-none" />
            <Button
                {...props}
                className={cn(
                    'h-10 px-8 w-full rounded-full font-semibold  text-zinc-200 backdrop-blur-xl  bg-[#262a35] ',
                    props.className
                )}
            />
        </div>
    );
};
