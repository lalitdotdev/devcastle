import AdminSidebar from "./AdminSidebar";
import JobDetailsPageComponent from "@/components/Jobboard/JobDetailsPageComponent";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
interface PageProps {
    params: { slug: string };
}

export default async function Page({ params: { slug } }: PageProps) {
    const session = await getAuthSession();
    const job = await db.job.findUnique({
        where: { slug },
        include: { category: true },
    });

    if (!job) notFound();

    if (session?.user.role !== "ADMIN") {
        return notFound();
    } else {
        return (
            <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
                <JobDetailsPageComponent job={job} />
                <AdminSidebar job={job} />
            </main>
        );
    }
}
