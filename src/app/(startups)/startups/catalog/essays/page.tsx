// app/essays/page.tsx

import EssayList from "@/components/EssaysList";
import Link from "next/link";
import UpdateButton from "../_components/UpdateEssays";
import { getEssays } from "../../actions";

export default async function EssaysPage() {
    const essays = await getEssays();
    console.log(essays);





    return (
        <main className="container mx-auto px-4 p-6 md:p-12 max-w-screen-xl">

            <div className="flex flex-col  justify-center gap-4 py-8 md:py-16">
                <h1 className="md:text-6xl text-4xl font-bold my-4  rounded-xl gradient-text animate-gradient">Paul Graham Essays</h1>


                <Link href="https://www.paulgraham.com/bio.html" className="" target="_blank" rel="noreferrer">
                    {/* <p className="text-sm text-gray-400">Essays by &copy;Paul Graham</p> */}
                    <pre className="text-sm text-gray-400">
                        <code>
                            © 1985-2022 by Paul Graham. All rights reserved.
                        </code>

                    </pre>

                    <p className="text-sm text-gray-400">A collection of essays by Y Combinator co-founder Paul Graham.</p>

                    <p className="text-sm text-gray-400">
                        This info is scraped from Aaron Swartz&apos;s
                        <a href="http://www.aaronsw.com/2002/feeds/pgessays.rss" target="_blank" rel="noreferrer"> RSS Feed</a>.
                    </p>




                </Link>

            </div>
            <EssayList essays={essays} />
            <UpdateButton />
        </main>
    );
}
