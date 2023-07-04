import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Campusbuddy",
  description:
    "CampusBuddy is a dynamic and vibrant online platform that serves as a hub for students to connect collaborate, and thrive within their campus community and across campuses ",
};

//importing custom fonts

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal, // receiving authModal as a prop as it is a server component
}: {
  children: React.ReactNode;
  authModal?: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          {/* @ts-expect-error server-component */}
          <Navbar />
          {/* Rendering authModal alongside other components */}
          {authModal}
          <div className="container max-w-7xl mx-auto h-full pt-12">
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
