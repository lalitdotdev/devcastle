"use client"

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
        <Card className="m-auto my-10 space-y-10 max-w-6xl mx-auto bg-gray-900 border-2 border-indigo-600 rounded-lg">
            <CardHeader className="bg-indigo-600 text-white p-6 max-w-6xl mx-auto rounded-t-lg">
                <CardTitle>
                    <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
                </CardTitle>
                <p className="text-gray-300 text-lg">
                    Reach top developers and find your perfect fit.
                </p>
            </CardHeader>
            <CardContent className="p-8 max-w-6xl mx-auto">
                <div className="mb-6">
                    <h2 className="font-semibold text-xl text-white">Job details</h2>
                    <p className="text-gray-400 text-base">
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
                                    <FormLabel className="text-gray-400 font-medium">Job title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. Frontend Developer"
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-400 text-sm">
                                        A descriptive title that will help developers find your job
                                    </FormDescription>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-medium">Job type</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            defaultValue=""
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                        >
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
                                    <FormDescription className="text-gray-400 text-sm">
                                        Full-time, part-time, contract, etc.
                                    </FormDescription>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-medium">Company</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="companyLogo"
                            render={({ field: { value, ...fieldValues } }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-medium">Company logo</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldValues}
                                            type="file"
                                            accept="image/*"
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                fieldValues.onChange(file);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="locationType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-medium">Location</FormLabel>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            defaultValue=""
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
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
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-medium">Office location</FormLabel>
                                    <FormControl>
                                        <LocationInput
                                            onLocationSelected={field.onChange}
                                            ref={field.ref}
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                        />
                                    </FormControl>

                                    {watch("location") && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                className="border-2 border-indigo-600 rounded-md p-1 hover:bg-indigo-600 hover:text-white transition-colors duration-200 ease-in-out"
                                                onClick={() => {
                                                    setValue("location", "", { shouldValidate: true });
                                                }}
                                            >
                                                <X size={20} />
                                            </button>
                                            <span className="text-sm text-gray-400">{watch("location")}</span>
                                        </div>
                                    )}

                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="applicationEmail" className="text-gray-400 font-medium">
                                How to apply
                            </Label>
                            <div className="flex justify-between gap-4">
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
                                                        className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                                        {...field}
                                                    />
                                                    <span className="mx-2 text-gray-400">or</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-500 font-medium" />
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
                                                    className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        trigger("applicationEmail");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500 font-medium" />
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
                                    <Label
                                        onClick={() => setFocus("description")}
                                        className="text-gray-400 font-medium"
                                    >
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
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-medium">Salary</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            className="bg-gray-800 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-white"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 font-medium" />
                                </FormItem>
                            )}
                        />

                        <LoadingButton
                            type="submit"
                            loading={isSubmitting}
                            className="bg-indigo-600 text-white font-medium rounded-md px-6 py-3 focus:ring-4 focus:ring-indigo-300 hover:bg-indigo-700 transition-colors duration-200 ease-in-out"
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
