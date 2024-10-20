"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { approveSubmission, deleteJob } from "./actions";

import FormSubmitButton from "@/components/Jobboard/FormSubmitButton";
import { Job } from "@prisma/client";
import { useFormState } from "react-dom";

interface AdminSidebarProps {
    job: Job;
}

export default function AdminSidebar({ job }: AdminSidebarProps) {
    return (
        <aside className="flex w-[200px] flex-none flex-row items-center gap-2 md:flex-col md:items-stretch">
            {job.approved ? (
                <span className="text-center font-semibold text-green-500 justify-center items-center flex gap-2">
                    <CheckCircle className="text-xl text-green-500" />
                    Approved
                </span>
            ) : (
                <ApproveSubmissionButton jobId={job.id} />
            )}
            <DeleteJobButton jobId={job.id} />
        </aside>
    );
}

interface AdminButtonProps {
    jobId: string;
}

function ApproveSubmissionButton({ jobId }: AdminButtonProps) {
    const [formState, formAction] = useFormState(approveSubmission, undefined);

    return (
        <form action={formAction} className="space-y-1">
            <input hidden name="jobId" value={jobId} />
            <FormSubmitButton className="w-full hover:bg-emerald-300 bg-emerald-100
                         px-4 py-2 text-center text-sm rounded-md text-zinc-900">
                <CheckCircle className="text-xl text-emerald-500" />
                Approve
            </FormSubmitButton>
            {formState?.error && (
                <p className="text-sm text-red-500">{formState.error}</p>
            )}
        </form>
    );
}

function DeleteJobButton({ jobId }: AdminButtonProps) {
    const [formState, formAction] = useFormState(deleteJob, undefined);

    return (
        <form action={formAction} className="space-y-1 text-white">
            <input hidden name="jobId" value={jobId} />
            <FormSubmitButton className="bg-red-200
                px-4 py-2 text-center text-sm rounded-md w-full text-red-600">
                <XCircle className="text-xl text-red-500" />
                Delete
            </FormSubmitButton>
            {formState?.error && (
                <p className="text-sm text-red-500">{formState.error}</p>
            )}
        </form>
    );
}
