import { Bell, Pin, Settings2, TerminalSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { getActiveProducts, getAdminData, getPendingProducts, getRejectedProducts, getTotalUpvotes, getUsers } from "@/lib/launchpad-server-actions/server-actions";

import H1 from "@/components/h1";
import JobListItem from "@/components/Jobboard/JobListItem";
import Link from "next/link";
import OverviewChart from "./launchpad/_components/overview-chart";
import PendingProducts from "./launchpad/_components/pending-products";
import RecentActivity from "./launchpad/_components/recent-activity";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function page() {
    const session = await getAuthSession();
    const unapprovedJobs = await db.job.findMany({
        where: { approved: false },
        include: { category: true },
    });


    const users = await getUsers();
    const pendingProducts = await getPendingProducts();

    const activeProducts = await getActiveProducts();
    const rejectedProducts = await getRejectedProducts();
    const totalUpvotes = await getTotalUpvotes();
    const data = await getAdminData();


    console.log(data)
    const premiumUsers = users.filter((user: any) => user.isPremium);

    const stats = [
        {
            title: "Total Users",
            value: users.length,
            icon: "👤",
            gradientClasses: "bg-gradient-to-r from-blue-500 to-blue-700"
        },
        {
            title: "Premium Users",
            value: premiumUsers.length,
            icon: "💎",
            gradientClasses: "bg-gradient-to-r from-purple-500 to-purple-700"
        },
        {
            title: "Active Products",
            value: activeProducts.length,
            icon: "📦",
            gradientClasses: "bg-gradient-to-r from-emerald-500 to-emerald-700"
        },
        {
            title: "Pending Products",
            value: pendingProducts.length,
            icon: "🕒",
            gradientClasses: "bg-gradient-to-r from-amber-500 to-amber-700"
        },
        {
            title: "Rejected Products",
            value: rejectedProducts.length,
            icon: "❌",
            gradientClasses: "bg-gradient-to-r from-red-500 to-red-700"
        },
        {
            title: "Total Upvotes",
            value: totalUpvotes,
            icon: "⭐",
            gradientClasses: "bg-gradient-to-r from-teal-500 to-teal-700"
        },
    ];



    if (session?.user.role !== "ADMIN") {
        return notFound();
    } else {
        return (
            <main className="min-h-screen text-gray-100">
                <div className="m-auto max-w-7xl space-y-8 px-4 py-12">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <H1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                            Admin Dashboard
                        </H1>
                        <p className="text-gray-400">Manage your platform with ease</p>
                    </div>

                    {/* Notice Banner */}
                    <div className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 rounded-lg border border-emerald-500/20 p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <Pin className="text-emerald-400" size={32} />
                            <p className="text-gray-300">
                                Welcome to your admin dashboard. Monitor and manage all products, users, and jobs from this central hub.
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Header */}
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="transition-transform hover:scale-105">
                                <TerminalSquare className="text-emerald-400" size={48} />
                            </Link>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Welcome back, Admin</h2>
                                <p className="text-gray-400">Here&apos;s your business overview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                                <Bell className="text-gray-400 hover:text-emerald-400" size={24} />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                                <Settings2 className="text-gray-400 hover:text-emerald-400" size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-medium text-gray-200">
                                        {stat.title}
                                    </CardTitle>
                                    <span className="text-2xl">{stat.icon}</span>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-3xl font-bold ${stat.gradientClasses} bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-7 gap-6 mt-8">
                        <Card className="lg:col-span-4 bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200">Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <OverviewChart data={data} />
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3 bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200">Recent Activity</CardTitle>
                                <CardDescription className="text-gray-400">Latest platform updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentActivity users={users} />
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="bg-gray-700" />

                    {/* Pending Products Section */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-3 text-white">
                            <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                            Pending Products
                            <span className="text-2xl">📦</span>
                        </h2>
                        <PendingProducts pendingProducts={pendingProducts} authenticatedUser={session} />
                    </section>

                    <Separator className="bg-gray-700" />

                    {/* Jobs Section */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-3 text-white">
                            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                            Pending Job Listings
                            <span className="text-2xl">💼</span>
                        </h2>
                        <div className="space-y-4">
                            {unapprovedJobs.map((job) => (
                                <Link key={job.id} href={`/admin/jobs/${job.slug}`}>
                                    <JobListItem job={job} />
                                </Link>
                            ))}
                            {unapprovedJobs.length === 0 && (
                                <p className="text-gray-400 italic">No unapproved jobs</p>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        );
    }
}
