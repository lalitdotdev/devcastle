import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="text-gray-400 min-h-screen overflow-auto">
            <main>
                {children}
            </main>
        </div>
    );
}
