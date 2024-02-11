import Footer from "@/components/Footer";
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
    <div>
      {children}
      <Footer />
    </div>
  );
}
