'use client';

import { RefreshCcw } from "lucide-react";
import { updateEssays } from "../../actions";

export default function UpdateButton() {
    const handleUpdate = async () => {
        try {
            const result = await updateEssays();
            console.log(result.message);
        } catch (error) {
            console.log(error);

        }
    };

    return <button onClick={handleUpdate} className="text-lg border flex gap-2 justify-center items-center border-blue-500 w-fit text-blue-500 mt-8">
        <RefreshCcw className="h-5 w-5" />
        Update Essays
    </button>;
}
