"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

interface LogoUploaderProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}

export const LogoUploader = ({ onChange, endpoint }: LogoUploaderProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                toast.success("Logo uploaded successfully!", { position: "top-right" });
            }}
            onUploadError={(error: Error) => {
                toast(error.message, { position: "top-center" });
            }}
        />
    );
};
