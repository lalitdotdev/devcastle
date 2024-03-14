import { CheckCircle } from "lucide-react";
import H1 from "@/components/h1";

export default function JobSubmittedPage() {
    return (
        <main className="mx-auto my-10 max-w-5xl space-y-5 px-3 items-center justify-center flex flex-col">
            <div className="flex gap-4 items-center justify-center ">
                <span><CheckCircle size={48} className="text-green-500 animate-bounce transition-all duration-900" /></span>
                <H1>Job submitted</H1>
            </div>
            <p className="text-lg flex flex-col  text-center">Your job posting has been submitted and is pending approval.
                <span className="text-n-4"> We truely appreciate your contribution in the community !! </span></p>
        </main>
    );
}

