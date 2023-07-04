import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { Icons } from "../Icons";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

interface OAuthButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const OAuthButtons: React.FC<OAuthButtonProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // throw new Error("test");
      await signIn("google");
    } catch (err) {
      //toast error message here
      // console.log(err);

      toast({
        title: "There was an error",
        description:
          "There was an error logging in with Google. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col justify-center ", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full mb-2"
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>

      <Button variant="outline" type="button" size="sm" className="w-full">
        Some other providers
      </Button>
    </div>
  );
};
export default OAuthButtons;
