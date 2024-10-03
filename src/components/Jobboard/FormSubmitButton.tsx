"use client";

import LoadingButton from "./LoadingButton";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
    const { pending } = useFormStatus();
    return <LoadingButton {...props} type="submit" loading={pending} />;
}
