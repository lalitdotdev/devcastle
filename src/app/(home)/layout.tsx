import Footer from "@/components/Jobboard/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "DevCastle",
        template: "%s | DevCastle ",
    },
    description: "Find your dream developer job.",
};

export default function HomePageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
