const items = [
    {
        title: "About Us",
    },
    {
        title: "Careers",
    },
    {
        title: "Apps",
    },
    {
        title: "FAQs",
    },
    {
        title: "Legal",
    },
];

const AboutMenu = () => {
    return (
        <div
            className="
      w-32
      border-2
      border-white
    rounded-md
      shadow-md
      bg-teal-500
      absolute
      text-black
      -ml-14
      top-full"
        >
            <ul className="flex flex-col items-start p-4 space-y-2 cursor-pointer">
                {items.map((item, index) => (
                    <div key={index} className="flex ">
                        <div className="text-sm">{item.title}</div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default AboutMenu;
