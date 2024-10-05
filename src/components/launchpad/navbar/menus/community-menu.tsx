const items = [
    {
        icon: "🎙️",
        title: "Discussions",
        description: " Check out launches that are coming soon",
    },
    {
        icon: "✏️",
        title: "Stories",
        description: "Tech news, interviews and tips from makers",
    },

    {
        icon: "💯",
        title: "Visit Streaks",
        description: "The most active community members",
    },
];

const CommunityMenu = () => {
    return (
        <div
            className="
        border
        border-gray-200
      rounded-sm
        shadow-md
        bg-white
        absolute
        top-full
        text-gray-600

        "
        >
            <div className="flex cursor-pointer ">
                <div className="border-2 border-white rounded-md p-4 flex bg-teal-500  text-black -ml-12 ">
                    <div className="flex flex-col items-start space-y-3  ">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="bg-teal-400 p-1 rounded-sm shadow-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">{item.title}</div>
                                    <div className="text-xs w-48">{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityMenu;
