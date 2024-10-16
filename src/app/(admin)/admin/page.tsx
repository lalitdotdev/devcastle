import { Bell, Pin, Settings2, TerminalSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { authOptions, getAuthSession } from "@/lib/auth";
import { getActiveProducts, getAdminData, getPendingProducts, getRejectedProducts, getTotalUpvotes, getUsers } from "@/lib/launchpad-server-actions/server-actions";

import H1 from "@/components/h1";
import JobListItem from "@/components/Jobboard/JobListItem";
import Link from "next/link";
import OverviewChart from "./launchpad/_components/overview-chart";
import PendingProducts from "./launchpad/_components/pending-products";
import RecentActivity from "./launchpad/_components/recent-activity";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function page() {
    const session = await getAuthSession();
    const unapprovedJobs = await db.job.findMany({
        where: { approved: false },
    });


    const users = await getUsers();
    const pendingProducts = await getPendingProducts();
    const authenticatedUser = await getServerSession(authOptions);
    const activeProducts = await getActiveProducts();
    const rejectedProducts = await getRejectedProducts();
    const totalUpvotes = await getTotalUpvotes();
    const data = await getAdminData();


    console.log(data)
    const premiumUsers = users.filter((user: any) => user.isPremium);




    if (session?.user.role !== "ADMIN") {
        return notFound();
    } else {
        return (
            <main className="m-auto my-10 max-w-7xl space-y-10 px-3">

                <H1 className="text-center animate-gradient gradient-text">Admin Dashboard</H1>
                <div className="w-full rounded-md p-8  bg-emerald-200  mt-10 md:flex items-center gap-x-4">
                    <Pin className="text-5xl text-green-600 mb-4 md:mb-0" size={40} />
                    <div className="text-zinc-700">
                        This is admin dashboard. You can view and manage all the products, users and jobs here.
                    </div>
                </div>

                {/* Launchpad section */}
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-x-6 items-center py-10">
                            <Link href={"/"} className="">

                                <TerminalSquare className="text-5xl text-purple-600" size={52} />
                            </Link>

                            <div className="hidden md:block">
                                <h1 className="text-3xl font-bold">Welcome back admin</h1>
                                <p className="text-gray-500">
                                    Here is what&apos;s happening in your business today
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Bell className="text-2xl text-gray-500" />
                            <Settings2 className="text-2xl text-gray-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className=" bg-gray-800 border-teal-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">Users</CardTitle>👤
                            </CardHeader>
                            <CardContent>
                                {users.length}
                            </CardContent>
                        </Card>

                        <Card className=" bg-gray-800 border-teal-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">Premium Users</CardTitle>{" "}
                                💰
                            </CardHeader>
                            <CardContent>
                                {premiumUsers.length}
                            </CardContent>
                        </Card>

                        <Card className=" bg-gray-800 border-teal-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">
                                    Active Products
                                </CardTitle>{" "}
                                📦
                            </CardHeader>
                            <CardContent>
                                {activeProducts.length}
                            </CardContent>
                        </Card>

                        <Card className=" bg-gray-800 border-teal-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">
                                    Pending Products
                                </CardTitle>{" "}
                                🕒
                            </CardHeader>
                            <CardContent>
                                {pendingProducts.length}
                            </CardContent>
                        </Card>

                        <Card className=" bg-gray-800 border-teal-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">
                                    Rejected Products
                                </CardTitle>
                                👤
                            </CardHeader>
                            <CardContent>
                                {rejectedProducts.length}
                            </CardContent>
                        </Card>

                        <Card className=" bg-gray-800 border-teal-600">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">Upvotes</CardTitle> 🔺
                            </CardHeader>
                            <CardContent>
                                {totalUpvotes}
                            </CardContent>
                        </Card>
                    </div>


                    <div className="grid md:grid-cols-2 lg:grid-cols-7 my-4 gap-4">
                        <Card className="col-span-4 bg-emerald-50 ">
                            <CardHeader>
                                <CardTitle className="pb-10 text-zinc-700">Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <OverviewChart data={data} />

                            </CardContent>
                        </Card>

                        <Card className="w-full col-span-4 md:col-span-3 bg-emerald-50">
                            <CardHeader>
                                <CardTitle className="text-zinc-700">Recent Activity</CardTitle>
                                <CardDescription>View recent activity</CardDescription>

                            </CardHeader>
                            <CardContent>
                                <RecentActivity users={users} />

                            </CardContent>
                        </Card>

                    </div>

                    <Separator className="my-10 bg-zinc-600" />

                    <div className="pb-10 space-y-10">
                        <h2 className="text-2xl font-semibold bg-gradient text-zinc-900 p-2 border-l-4 border-red-400">Pending Products 📦</h2>
                        <PendingProducts
                            pendingProducts={pendingProducts}
                            authenticatedUser={session}
                        />

                    </div>
                </div>
                <Separator className="bg-zinc-600" />

                {/* Job Section */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-2xl font-semibold bg-emerald-100 text-zinc-900 p-2 border-l-4 border-blue-600">Pending Job Listings 💼</h2>

                    {unapprovedJobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/admin/jobs/${job.slug}`}
                            className="block"
                        >
                            <JobListItem job={job} />
                        </Link>
                    ))}
                    {unapprovedJobs.length === 0 && (
                        <p className="text-muted-foreground">No unapproved jobs</p>
                    )}
                </section>

            </main>
        );
    }
}
