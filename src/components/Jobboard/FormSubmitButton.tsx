"use client";

import { experimental_useFormStatus } from "react-dom";
import LoadingButton from "./LoadingButton";

export default function FormSubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { pending } = experimental_useFormStatus();
  return <LoadingButton {...props} type="submit" loading={pending} />;
}
