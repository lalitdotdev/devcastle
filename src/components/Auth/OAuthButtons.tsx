import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { Icons } from "../Icons";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

interface OAuthButtonProps extends React.HTMLAttributes<HTMLDivElement> {}

const OAuthButtons: React.FC<OAuthButtonProps> = ({ className, ...props }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      // throw new Error("test");
      await signIn("google", {
        callbackUrl: "http://localhost:3000/feed",
      });
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
      setIsGoogleLoading(false);
    }
  };

  const loginWithGithub = async () => {
    setIsLoading(true);
    try {
      await signIn("github", {
        callbackUrl: "http://localhost:3000/feed",
      });
      // after sometime after redirecting refresh the page
    } catch (err) {
      //toast error message here
      // console.log(err);

      toast({
        title: "There was an error",
        description:
          "There was an error logging in with Github. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col justify-center items-center", className)}
      {...props}
    >
      <Button
        onClick={loginWithGoogle}
        isLoading={isGoogleLoading}
        type="button"
        size="sm"
        className="w-[80%] mb-2 border border-blue-500"
      >
        {isGoogleLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Sign in with Google
      </Button>

      <Button
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-[80%] mt-1 border border-blue-500"
        onClick={loginWithGithub}
      >
        <Github className="h-5 w-5 mr-2 " />
        Sign in with Github
      </Button>
    </div>
  );
};
export default OAuthButtons;
