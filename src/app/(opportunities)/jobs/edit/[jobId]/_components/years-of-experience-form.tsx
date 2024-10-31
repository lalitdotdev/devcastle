"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";

import { Button } from "@/components/ui/Button";
import { Job } from "@prisma/client";
import { Pencil } from "lucide-react";
import Select from "@/components/Jobboard/Select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateJobPosting } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { yearsOfExperience } from "@/lib/job-types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface YearsOfExperienceFormProps {
    initialData: Job;
    jobId: string;
}

const formSchema = z.object({
    yearsOfExperience: z.string({
        required_error: "Please select years of experience",
    }).refine(
        (value) => yearsOfExperience.some(exp => exp.value === value),
        "Invalid years of experience"
    ),
});

const YearsOfExperienceForm = ({ initialData, jobId }: YearsOfExperienceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            yearsOfExperience: initialData.yearsOfExperience || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            formData.append('yearsOfExperience', values.yearsOfExperience);

            await updateJobPosting(jobId, formData);

            toast.success('Years of experience updated successfully');
            router.refresh();
            setIsEditing(false);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error updating years of experience:', error);
        }
    };

    const toggleEditing = () => setIsEditing(!isEditing);

    const selectedExperience = yearsOfExperience.find(
        (exp) => exp.value === initialData.yearsOfExperience
    );

    return (
        <div className="mt-6 bg-gray-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Years of Experience
                <Button onClick={toggleEditing} variant="ghost" className="text-indigo-600">
                    {isEditing ? (
                        "Cancel"
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                        </>
                    )}
                </Button>
            </div>

            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2 text-gray-300",
                    !initialData.yearsOfExperience && "text-neutral-500 italic"
                )}>
                    {selectedExperience?.label || "No experience requirement set"}
                </p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="yearsOfExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Required Experience</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            className="bg-[#282C35]"
                                        >
                                            <option value="" hidden>
                                                Select required experience
                                            </option>
                                            {yearsOfExperience.map((exp) => (
                                                <option key={exp.value} value={exp.value}>
                                                    {exp.label}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isSubmitting ? 'Updating...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default YearsOfExperienceForm;
