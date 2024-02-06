import Footer from "@/components/Jobboard/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Campusbuddy Jobs",
    template: "%s | Campusbuddy Jobs",
  },
  description: "Find your dream developer job.",
};

export default function JobBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-white min-w-[350px] ">
      {children}
      <Footer />
    </div>
  );
}
