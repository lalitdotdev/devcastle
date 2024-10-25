"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { updateJobPosting } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TitleFormProps {
    initialData: {
        title: string;
    };
    jobId: string;
}


const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    })
})

const TitleForm = ({ initialData, jobId }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,

    })

    const { isSubmitting, isValid, dirtyFields } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('title', values.title);

        try {
            await updateJobPosting(jobId, formData);
            toast.success('Job title updated successfully', {
                position: 'top-center'
            });
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error updating job title:', error);
        }

    }

    const toggleEditing = () => setIsEditing(!isEditing)
    return (
        <div className="mt-6  bg-gray-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Job Title
                <Button onClick={toggleEditing} variant={"ghost"} className="p-1 text-indigo-600 mb-2" size={'sm'}>{
                    isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" /> Edit Title</>)
                }</Button>
            </div>

            {/* display the title if not editing */}
            {
                !isEditing && <p className="text-sm mt-2 text-gray-300">{initialData.title}</p>
            }

            {/* display the form if editing */}
            {
                isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            {...field}
                                            placeholder={initialData.title}
                                            className=" border-2 bg-gray-700 text-white"

                                        />
                                    </FormControl>
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
                    </Form>
                )
            }
        </div>
    )
}

export default TitleForm
