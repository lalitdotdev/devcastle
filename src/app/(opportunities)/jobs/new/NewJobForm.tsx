"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CreateJobValues, createJobSchema } from "@/lib/validators/jobFilter";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import LoadingButton from "@/components/Jobboard/LoadingButton";
import LocationInput from "@/components/Jobboard/LocationInput";
import RichTextEditor from "@/components/Jobboard/RichTextEditor";
import Select from "@/components/Jobboard/Select";
import { X } from "lucide-react";
import { createJobPosting } from "./actions";
import { draftToMarkdown } from "markdown-draft-js";
import { jobTypes } from "@/lib/job-types";
import { locationTypes } from "../../../../lib/job-types";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const NewJobForm = () => {
    const form = useForm<CreateJobValues>({
        resolver: zodResolver(createJobSchema),
    });

    const {
        handleSubmit,
        formState: { errors, isDirty, isSubmitting, isValid },
        watch,
        trigger,
        control,
        setValue,
        setFocus,
    } = form;

    const onSubmit = async (values: CreateJobValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });

        try {
            await createJobPosting(formData);
            toast.success('Job Created Successfully', {
                description: 'Wait for approval from admin!',
            });
        } catch (error) {
            toast.error('Something went wrong, please try again.');
        }
    };

    return (
        <Card className="m-auto my-10 space-y-10 max-w-6xl mx-auto border border-gray-600 ">
            <CardHeader className="bg-indigo-600 text-white p-6 max-w-6xl mx-auto">
                <CardTitle>
                    <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
                </CardTitle>
                <p className="text-gray-200">
                    Reach top developers and find your perfect fit.
                </p>
            </CardHeader>
            <CardContent className="p-6 max-w-6xl mx-auto">
                <div>
                    <h2 className="font-semibold">Job details</h2>
                    <p className="text-muted-foreground">
                        Provide a job description and details
                    </p>
                </div>




                <Form {...form}>
                    <form className="space-y-6 max-w-6xl mx-auto" noValidate onSubmit={handleSubmit(onSubmit)} >
                        <FormField
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Frontend" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        A descriptive title that will help developers find your job
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job type</FormLabel>
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="companyLogo"
                            render={({ field: { value, ...fieldValues } }) => (
                                <FormItem>
                                    <FormLabel>Company logo</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldValues}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                fieldValues.onChange(file);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="locationType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            defaultValue=""
                                            className="bg-[#282C35]"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (e.currentTarget.value === "Remote") {
                                                    trigger("location");
                                                }
                                            }}
                                        >
                                            <option value="" hidden>
                                                Select an option
                                            </option>
                                            {locationTypes.map((locationType) => (
                                                <option key={locationType} value={locationType}>
                                                    {locationType}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office location</FormLabel>
                                    <FormControl>
                                        <LocationInput
                                            onLocationSelected={field.onChange}
                                            ref={field.ref}
                                        />
                                    </FormControl>

                                    {watch("location") && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                className="border-2 border-indigo-600 rounded-md p-1 hover:bg-indigo-600 hover:text-white transition-colors duration-200 ease-in-out"
                                                onClick={() => {
                                                    setValue("location", "", { shouldValidate: true });
                                                }}
                                            >
                                                <X size={20} />
                                            </button>
                                            <span className="text-sm">{watch("location")}</span>
                                        </div>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="applicationEmail">How to apply</Label>
                            <div className="flex justify-between">
                                <FormField
                                    control={control}
                                    name="applicationEmail"
                                    render={({ field }) => (
                                        <FormItem className="grow">
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input
                                                        id="applicationEmail"
                                                        placeholder="Email"
                                                        type="email"
                                                        {...field}
                                                    />
                                                    <span className="mx-2">or</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="applicationUrl"
                                    render={({ field }) => (
                                        <FormItem className="grow">
                                            <FormControl>
                                                <Input
                                                    placeholder="Website URL e.g. https://example.com/jobs/1234"
                                                    type="url"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        trigger("applicationEmail");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <FormField
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <Label onClick={() => setFocus("description")}>
                                        Description
                                    </Label>
                                    <FormControl>
                                        <RichTextEditor
                                            onChange={(draft) =>
                                                field.onChange(draftToMarkdown(draft))
                                            }
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Salary</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            className=" bg-[#4F46E5] rounded-none text-gray-900 font-semibold text-md focus:border-4 hover:text-gray-800"
                        >
                            Submit
                        </LoadingButton>
                    </form>
                </Form>
            </CardContent>

        </Card>
    );
};

export default NewJobForm;
