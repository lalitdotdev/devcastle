// app/page.tsx

import { Metadata } from "next";
import ProductHuntFeedImporter from "@/components/Feed/ProductHuntFeedImport";

// metadata for the page
export const metadata: Metadata = {
    title: "Product Hunt Feed Importer",
    description: "Import your favorite products from Product Hunt",
};


export default function ProductHuntFeed() {

    return (
        <main className=" items-center justify-center max-w-5xl pt-10 mx-auto">
            <ProductHuntFeedImporter />
        </main>
    );
}
