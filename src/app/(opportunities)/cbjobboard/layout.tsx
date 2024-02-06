import Footer from "@/components/Jobboard/Footer";

export default function JobBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-white min-w-[350px]">
      {children}
      <Footer />
    </div>
  );
}
