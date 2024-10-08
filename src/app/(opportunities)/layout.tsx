import Footer from "@/components/Jobboard/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Devcastle Jobs",
        template: "%s | Devcastle Jobs",
    },
    description: "Find your dream developer job.",
};

export default function JobBoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="text-white min-w-[350px] min-h-[70vh]">{children}</div>
            <Footer />
        </>
    );
}
