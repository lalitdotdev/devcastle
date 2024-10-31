"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";

import { Button } from "@/components/ui/Button";
import { Job } from "@prisma/client";
import { Pencil } from "lucide-react";
import Select from "@/components/Jobboard/Select";
import { locationTypes } from "@/lib/job-types";
import { toast } from "sonner";
import { updateJobPosting } from "../actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface JobTypeFormProps {
    initialData: Job;
    jobId: string;
}

const formSchema = z.object({
    locationType: z.string({
        required_error: "Please select a location type",
    }).refine(
        (value) => locationTypes.includes(value),
        "Invalid location type"
    ),
});

const JobLocationTypeForm = ({ initialData, jobId }: JobTypeFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            locationType: initialData.locationType || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('locationType', values.locationType);
        try {

            await updateJobPosting(jobId, formData);
            toast.success('Job location Type updated successfully', {
                position: 'top-center'
            });
            router.refresh();

            toast.success('Location type updated successfully');
            router.refresh();
            setIsEditing(false);
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Error updating location type:', error);
        }
    };

    const toggleEditing = () => setIsEditing(!isEditing);

    return (
        <div className="mt-6 bg-gray-800 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Location Type
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
                <p className="text-sm text-gray-400">
                    {initialData.locationType || "No location type set"}
                </p>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="locationType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            className="bg-[#282C35]"
                                        >
                                            <option value="" hidden>
                                                Select a location type
                                            </option>
                                            {locationTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
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

export default JobLocationTypeForm;
