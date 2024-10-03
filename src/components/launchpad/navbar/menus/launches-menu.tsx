const items = [
    {
        icon: "🗓️",
        title: "Coming Soon",
        description: " Check out launches that are coming soon",
    },
    {
        icon: "❓",
        title: "Product Questions",
        description: "Answer the most interesting questions",
    },
    {
        icon: "🔮",
        title: "Launch archive",
        description: " Most-loved launches by the community",
    },
    {
        icon: "📰",
        title: "Newsletter",
        description: "The best of Bird, everyday",
    },
];

const LaunchesMenu = () => {
    return (
        <div className="border-2 border-white shadow-md bg-teal-500 absolute top-full text-black rounded-md">
            <div className="flex cursor-pointer p-4">
                <div className="flex flex-col items-start space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="bg-teal-400 p-1 rounded-sm shadow-sm">
                                {item.icon}
                            </div>
                            <div>
                                <div className="font-semibold">{item.title}</div>
                                <div className="text-xs w-60">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LaunchesMenu;
