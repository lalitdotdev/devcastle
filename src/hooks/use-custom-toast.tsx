import Link from "next/link";
import { toast } from "./use-toast";

export const useCustomToast = () => {
    const loginToast = () => {
        const { dismiss } = toast({
            title: "Login Required",
            description: "You must be logged in to do that.",
            variant: "destructive",
            action: (
                <Link
                    href="/sign-in"
                    onClick={() => dismiss()}
                    className="border-2 p-2 rounded-md"
                >
                    Login
                </Link>
            ),
        });
    };
    return { loginToast };
};
