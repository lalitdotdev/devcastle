import Bookmarks from "./_components/BookMarks";
import { HomeFeedTabs } from "@/components/ui/HomeFeedTabs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bookmarks",
};


const tabs = [
    {
        title: "Post BookMarks",
        value: "post bookmarks",
        content: (
            <>
                <Bookmarks />
            </>

        )
        // content: (
        //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
        //         <p>Product Tab</p>
        //         <DummyContent />
        //     </div>
        // ),
    },
    {
        title: "Opportunities",
        value: "opportunities",
        href: "/opportunities",
        content: (
            <div className="w-full border-b border-zinc-700">

            </div>
        ),

    },

    // content: (
    //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
    //         <p>Services tab</p>
    //         <DummyContent />
    //     </div>
    // ),



];


export default function Page() {
    return (
        <main className="flex w-full min-w-0 gap-5">
            <div className="w-full min-w-0 space-y-5 mt-5">
                <div className="rounded-2xl bg-card p-5 shadow-sm">
                    <h1 className="text-center text-2xl font-bold">All Saved BookMarks </h1>
                </div>

                <div className="w-full ">
                    <HomeFeedTabs tabs={tabs} />
                </div>

            </div>

        </main>
    );
}
