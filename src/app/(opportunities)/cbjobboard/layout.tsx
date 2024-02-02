export default function JobBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex text-white min-w-[350px] scrollbar-thin !scrollbar-track-transparent !scrollbar-thumb-[#212329]">
      {children}
    </div>
  );
}
