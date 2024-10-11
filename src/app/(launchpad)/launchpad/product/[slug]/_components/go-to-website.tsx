'use client'


interface GoToWebsiteProps {
    website: string;
}


const GoToWebsite: React.FC<GoToWebsiteProps> = ({
    website
}) => {
    return (
        <div
            onClick={() => window.open(website, "_blank")}
            className="hidden lg:flex hover:underline cursor-pointer text-blue-500 transition-colors duration-300"
        >
            Go to website
        </div>
    );
}

export default GoToWebsite;
