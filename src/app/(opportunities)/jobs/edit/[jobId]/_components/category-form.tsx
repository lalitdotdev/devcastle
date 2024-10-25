"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form";

import { Button } from "@/components/ui/Button";
import CategoriesCombobox from "@/components/Jobboard/combo-box";
import { Job } from "@prisma/client";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateJobPosting } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CategoryFormProps {
    initialData: Job
    jobId: string;
    options: { label: string, value: string }[];
}


const formSchema = z.object({
    categoryId: z.string().min(1)
})

const CategoryForm = ({ initialData, jobId, options }: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
        },

    })

    const { isSubmitting, isValid, dirtyFields } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        console.log('values:', values)

        formData.append('categoryId', values.categoryId);
        console.log('formData:', formData)

        try {
            await updateJobPosting(jobId, formData);
            toast.success('Job category updated successfully', {
                position: 'top-center'
            });
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error updating job categoryId:', error);
        }

    }

    const toggleEditing = () => setIsEditing(!isEditing)

    const selectedOption = options.find(option => option.value === initialData.categoryId)
    return (
        <div className="mt-6  bg-gray-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Job Category
                <Button onClick={toggleEditing} variant={"ghost"} className="p-1 text-indigo-600 mb-2" size={'sm'}>{
                    isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" /> Edit Category</>)
                }</Button>
            </div>

            {/* display the categoryId if not editing */}
            {
                !isEditing && <p className={cn("text-sm mt-2 text-gray-300", !initialData?.categoryId && 'text-neutral-500 italic')}>{
                    selectedOption?.label || "No Category"
                }
                </p>
            }

            {/* display the form if editing */}
            {
                isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            <FormField control={form.control} name="categoryId" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <CategoriesCombobox
                                            heading={"Categories"}
                                            options={options}
                                            {...field}

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

export default CategoryForm
