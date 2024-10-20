import Bookmarks from "./_components/BookMarks";
import { HomeFeedTabs } from "@/components/ui/HomeFeedTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookmarks",
};

const tabs = [
    {
        title: "Post Bookmarks",
        value: "post bookmarks",
        content: (
            <div className="bg-gradient-to-br  rounded-lg p-2 md:p-6 shadow-md">
                <Bookmarks />
            </div>
        ),
    },
    {
        title: "Opportunities",
        value: "opportunities",
        href: "/opportunities",
        content: (
            <div className="w-full border-b border-zinc-700 bg-gradient-to-br from-green-600 to-teal-800 p-6 rounded-lg shadow-md">
                <p className="text-white text-lg">Find your saved opportunities here!</p>
            </div>
        ),
    },
];

export default function Page() {
    return (
        <main className="flex w-full min-w-0  md:px-4 md:py-4 ">
            <div className="w-full min-w-0 space-y-8 ">
                <div className="rounded-2xl max-w-7xl mx-auto bg-gradient-to-r from-zinc-700 to-slate-700 p-3 md:p-5 shadow-xl">
                    <h1 className="text-center text-3xl font-extrabold text-white tracking-wide">
                        Your Saved Bookmarks
                    </h1>
                    <p className="text-center text-gray-300 mt-3">
                        View all your saved posts and opportunities in one place.
                    </p>
                </div>

                <div className=" mx-auto md:max-w-7xl md:p-2 md:border-l rounded-lg border-zinc-700 p-4 ">
                    <HomeFeedTabs tabs={tabs} containerClassName="w-fit bg-[#2C353D] text-white mt-0" />
                </div>
            </div>
        </main>
    );
}
