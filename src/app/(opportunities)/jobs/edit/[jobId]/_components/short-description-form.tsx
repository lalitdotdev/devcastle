"use client"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Lightbulb, Loader2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Job } from "@prisma/client";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/lib/ai";
import { toast } from "sonner";
import { updateJobPosting } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ShortDescriptionFormProps {
    initialData: Job
    jobId: string;

}


const formSchema = z.object({
    short_description: z.string().min(1)
})

const ShortDescriptionForm = ({ initialData, jobId }: ShortDescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [isPromptLoading, setIsPromptLoading] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            short_description: initialData.short_description || ""
        },

    })

    const { isSubmitting, isValid, dirtyFields } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('short_description', values.short_description);

        try {
            await updateJobPosting(jobId, formData);
            toast.success('Job short description updated successfully', {
                position: 'top-center'
            });
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error updating job short_description:', error);
        }

    }

    const toggleEditing = () => setIsEditing(!isEditing)
    const handlePromptGenerate = async () => {
        try {
            setIsPromptLoading(true)
            const customPrompt = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters but remember to not write number of characters in the response?`;


            await getGenerativeAIResponse(customPrompt).then((response) => {
                form.setValue('short_description', response)
                setIsPromptLoading(false)
            })



        } catch (error) {
            console.log(error)
            toast.error("Something went wrong!")
        }
    }


    return (
        <div className="mt-6  bg-gray-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between ">
                Job Short Description
                <Button onClick={toggleEditing} variant={"ghost"} className="p-1 text-indigo-600 mb-2" size={'sm'}>{
                    isEditing ? (<>Cancel</>) : (<><Pencil className="w-4 h-4 mr-2" /> Edit </>)
                }</Button>
            </div>

            {/* display the short_description if not editing */}
            {
                !isEditing && <p className={cn("text-sm mt-2 text-gray-300", !initialData?.short_description && 'text-neutral-500 italic')}>
                    {
                        initialData.short_description
                    }
                </p>
            }

            {/* display the form if editing */}
            {
                isEditing && (
                    <>
                        <div className="flex items-center gap-2 my-2">
                            <input type="text" placeholder="e.g Full-Stack Developer" value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:border-indigo-600 sm:text-sm bg-gray-800 text-gray-300" />
                            {
                                isPromptLoading ? (
                                    <>
                                        <Button className="bg-zinc-900/50 rounded-xl w-1/2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="ml-2 "> Generating with AI</span>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={handlePromptGenerate} className="bg-gray-900/50 rounded-xl">
                                            <Lightbulb className="w-6 h-6 " />
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                        <p className="text-muted-foreground text-sm text-right">Note* : Profession Name is enough to generate tags.</p>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4 mt-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="short_description"
                                    render={({ field }) => (
                                        <FormControl>
                                            <FormItem>
                                                <label htmlFor="short_description" className="block text-sm font-medium text-gray-300">
                                                    Short Description
                                                </label>
                                                <Textarea
                                                    id="short_description"
                                                    disabled={isSubmitting}
                                                    placeholder="Short description about the job"
                                                    {...field}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-gray-300"
                                                />
                                                <FormMessage {...field} />
                                            </FormItem>
                                        </FormControl>
                                    )}
                                />


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
                    </>
                )
            }
        </div>
    )
}

export default ShortDescriptionForm
