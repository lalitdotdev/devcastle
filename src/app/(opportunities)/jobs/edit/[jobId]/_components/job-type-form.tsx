"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/Form";

import { Button } from "@/components/ui/Button";
import { Job } from "@prisma/client";
import { Pencil } from "lucide-react";
import Select from "@/components/Jobboard/Select";
import { jobTypes } from "@/lib/job-types";
import { toast } from "sonner";
import { updateJobPosting } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface JobTypeFormProps {
    initialData: Job
    jobId: string;

}


const formSchema = z.object({
    type: z.string().min(1)
})

const JobTypeForm = ({ initialData, jobId }: JobTypeFormProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: initialData.type || ""
        },

    })

    const { isSubmitting, isValid, dirtyFields } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('type', values.type);

        try {
            await updateJobPosting(jobId, formData);
            toast.success('Job Type updated successfully', {
                position: 'top-center'
            });
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error updating job categoryId:', error);
        }

    }

    const toggleEditing = () => setIsEditing(!isEditing)


    return (
        <div className="mt-6  bg-gray-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Job Type
                <Button onClick={toggleEditing} variant={"ghost"} className="p-1 text-indigo-600 mb-2" size={'sm'}>{
                    isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" /> Edit </>)
                }</Button>
            </div>

            {/* display the categoryId if not editing */}
            {
                !isEditing && <p className="text-sm text-gray-400">{initialData.type}</p>

            }

            {/* display the form if editing */}
            {
                isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select {...field} defaultValue="" className="bg-[#282C35]">
                                            <option value="" hidden>
                                                Select an option
                                            </option>

                                            {jobTypes.map((jobType) => (
                                                <option key={jobType} value={jobType}>
                                                    {jobType}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Full-time, part-time, contract, etc.
                                    </FormDescription>

                                    <FormMessage />

                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="flex items-center gap-x-2 ">
                                <Button
                                    type="submit"
                                    disabled={!isValid || !dirtyFields}
                                    isLoading={isSubmitting}
                                    className=""
                                    variant={"subtle"}
                                >
                                    {isSubmitting ? 'Updating...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </Form >
                )
            }
        </div >
    )
}

export default JobTypeForm
