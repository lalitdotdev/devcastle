"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/Form";
import {
    Briefcase, Building2, DollarSign, FileText,
    Globe2, Loader2, Mail, MapPin, Upload, X, Sparkles,
} from "lucide-react";
import { CreateJobValues, createJobSchema } from "@/lib/validators/jobFilter";

import LocationInput from "@/components/Jobboard/LocationInput";
import RichTextEditor from "@/components/Jobboard/RichTextEditor";
import Select from "@/components/Jobboard/Select";
import { createJobPosting } from "./actions";
import { draftToMarkdown } from "markdown-draft-js";
import { jobTypes } from "@/lib/job-types";
import { locationTypes } from "../../../../lib/job-types";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ── Shared field styles ───────────────────────────────────────────────────────
const inputClass =
    "w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-violet-500/60 focus:outline-none transition-colors duration-200";

const selectClass =
    "w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-violet-500/60 focus:outline-none transition-colors duration-200 appearance-none";

const labelClass = "text-xs font-medium text-zinc-400 uppercase tracking-wider";

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
    icon: Icon,
    color,
    title,
    desc,
    children,
}: {
    icon: any;
    color: string;
    title: string;
    desc: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/60">
                <div className={`flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br ${color} text-white shrink-0`}>
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-zinc-200">{title}</p>
                    <p className="text-[11px] text-zinc-600">{desc}</p>
                </div>
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function FieldWrap({ label, desc, error, children }: { label: string; desc?: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className={labelClass}>{label}</label>
            {children}
            {desc && !error && <p className="text-[11px] text-zinc-600">{desc}</p>}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const NewJobForm = () => {
    const form = useForm<CreateJobValues>({
        resolver: zodResolver(createJobSchema),
    });

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger,
        control,
        setValue,
        setFocus,
    } = form;

    const onSubmit = async (values: CreateJobValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });
        try {
            await createJobPosting(formData);
            toast.success("Job posted successfully!", { description: "Pending admin approval." });
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0f] py-12 px-4 sm:px-6">
            {/* Ambient blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
                <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-600/5 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">

                {/* ── Page header ── */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Post an opportunity
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] text-zinc-100 mb-3">
                        Hire great<br />
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            developers
                        </span>
                    </h1>
                    <p className="text-zinc-500 leading-relaxed max-w-lg">
                        Reach thousands of developers actively looking for their next opportunity.
                        Fill in the details below and go live after approval.
                    </p>
                </div>

                <Form {...form}>
                    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* ── Role details ── */}
                        <Section
                            icon={Briefcase}
                            color="from-violet-600 to-fuchsia-600"
                            title="Role Details"
                            desc="Core information about the position"
                        >
                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldWrap
                                            label="Job Title"
                                            desc="A clear title helps candidates find your listing"
                                            error={errors.title?.message}
                                        >
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    placeholder="e.g. Senior Frontend Engineer"
                                                    className={inputClass}
                                                />
                                            </FormControl>
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldWrap label="Job Type" desc="Full-time, part-time, contract, etc." error={errors.type?.message}>
                                            <FormControl>
                                                <Select {...field} defaultValue="" className={selectClass}>
                                                    <option value="" hidden>Select a type</option>
                                                    {jobTypes.map((t) => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="salary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldWrap label="Annual Salary (USD)" error={errors.salary?.message}>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        placeholder="120000"
                                                        className={`${inputClass} pl-10`}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />
                        </Section>

                        {/* ── Company ── */}
                        <Section
                            icon={Building2}
                            color="from-cyan-500 to-blue-600"
                            title="Company"
                            desc="Who's hiring?"
                        >
                            <FormField
                                control={control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldWrap label="Company Name" error={errors.companyName?.message}>
                                            <FormControl>
                                                <input {...field} placeholder="Acme Inc." className={inputClass} />
                                            </FormControl>
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="companyLogo"
                                render={({ field: { value, ...fieldValues } }) => (
                                    <FormItem>
                                        <FieldWrap label="Company Logo" error={errors.companyLogo?.message}>
                                            <FormControl>
                                                <label className="flex items-center gap-3 h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 border-dashed text-sm text-zinc-600 hover:border-zinc-700 hover:text-zinc-400 cursor-pointer transition-all duration-200">
                                                    <Upload className="h-4 w-4 shrink-0" />
                                                    <span className="truncate">
                                                        {value instanceof File ? value.name : "Upload logo (PNG, JPG, SVG)"}
                                                    </span>
                                                    <input
                                                        {...fieldValues}
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => fieldValues.onChange(e.target.files?.[0])}
                                                    />
                                                </label>
                                            </FormControl>
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />
                        </Section>

                        {/* ── Location ── */}
                        <Section
                            icon={MapPin}
                            color="from-amber-500 to-orange-600"
                            title="Location"
                            desc="Where will this role be based?"
                        >
                            <FormField
                                control={control}
                                name="locationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldWrap label="Work Arrangement" error={errors.locationType?.message}>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    defaultValue=""
                                                    className={selectClass}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        if (e.currentTarget.value === "Remote") trigger("location");
                                                    }}
                                                >
                                                    <option value="" hidden>Select an option</option>
                                                    {locationTypes.map((lt) => (
                                                        <option key={lt} value={lt}>{lt}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FieldWrap label="Office Location" error={errors.location?.message}>
                                            <FormControl>
                                                <LocationInput
                                                    onLocationSelected={field.onChange}
                                                    ref={field.ref}
                                                    className={inputClass}
                                                />
                                            </FormControl>
                                            {watch("location") && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="flex items-center gap-1.5 text-xs text-zinc-400 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60">
                                                        <Globe2 className="h-3 w-3 text-zinc-600" />
                                                        {watch("location")}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue("location", "", { shouldValidate: true })}
                                                        className="flex items-center justify-center h-7 w-7 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-600 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </FieldWrap>
                                    </FormItem>
                                )}
                            />
                        </Section>

                        {/* ── How to apply ── */}
                        <Section
                            icon={Mail}
                            color="from-rose-500 to-pink-600"
                            title="How to Apply"
                            desc="Provide at least one application method"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name="applicationEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FieldWrap label="Email" error={errors.applicationEmail?.message}>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                                                        <input
                                                            {...field}
                                                            type="email"
                                                            placeholder="jobs@company.com"
                                                            className={`${inputClass} pl-10`}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FieldWrap>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="applicationUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FieldWrap label="Application URL" error={errors.applicationUrl?.message}>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                                                        <input
                                                            {...field}
                                                            type="url"
                                                            placeholder="https://company.com/apply"
                                                            className={`${inputClass} pl-10`}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                trigger("applicationEmail");
                                                            }}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </FieldWrap>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <p className="text-[11px] text-zinc-700">Provide email, URL, or both.</p>
                        </Section>

                        {/* ── Description ── */}
                        <Section
                            icon={FileText}
                            color="from-fuchsia-500 to-violet-600"
                            title="Job Description"
                            desc="Describe the role, requirements, and benefits"
                        >
                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden focus-within:border-violet-500/60 transition-colors duration-200">
                                                <RichTextEditor
                                                    onChange={(draft) => field.onChange(draftToMarkdown(draft))}
                                                    ref={field.ref}
                                                />
                                            </div>
                                        </FormControl>
                                        {errors.description && (
                                            <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </Section>

                        {/* ── Submit ── */}
                        <div className="flex items-center justify-between gap-4 pt-2">
                            <p className="text-[11px] text-zinc-700 leading-relaxed max-w-sm">
                                By submitting you agree to our{" "}
                                <a href="/terms" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">terms</a>.
                                Your listing will be reviewed before going live.
                            </p>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="shrink-0 flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold
                                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                                    hover:from-violet-500 hover:to-fuchsia-500
                                    text-white shadow-lg shadow-violet-900/30
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" />Posting…</>
                                ) : (
                                    <><Sparkles className="h-4 w-4" />Post Job</>
                                )}
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default NewJobForm;