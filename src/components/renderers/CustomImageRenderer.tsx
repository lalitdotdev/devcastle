"use client";

import Image from "next/image";

function CustomImageRenderer({ data }: any) {
    const src = data.file.url;
    const caption = data.caption || "Post image";

    return (
        <div className="group relative w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/20 my-8 transition-all hover:border-border/60">
            <div className="relative aspect-video w-full">
                <Image 
                    alt={caption} 
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" 
                    fill 
                    src={src} 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                />
            </div>
            {data.caption && (
                <div className="p-3 text-center border-t border-border/40 bg-card/50">
                    <p className="text-sm text-muted-foreground italic font-medium">
                        {data.caption}
                    </p>
                </div>
            )}
        </div>
    );
}

export default CustomImageRenderer;
