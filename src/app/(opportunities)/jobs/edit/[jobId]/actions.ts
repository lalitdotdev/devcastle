"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { jobTypes } from "@/lib/job-types";
import { redirect } from "next/navigation";
import { z } from "zod";
const requiredString = z.string().min(1, "Required");
// Create a new schema for updates, making all fields optional

// Create separate schemas for different update operations

const updateJobSchema = z.object({
  title: z.string().min(1, "Required").max(100).optional(),
  type: requiredString
    .refine((value) => jobTypes.includes(value), "Invalid job type")
    .optional(),
  categoryId: z.string().min(1, "Required").optional(),
  companyName: z.string().min(1, "Required").max(100).optional(),
  locationType: z.enum(["remote", "hybrid", "on-site"]).optional(),
  location: z.string().max(100).optional(),
  applicationEmail: z.string().email().max(100).optional(),
  applicationUrl: z.string().url().max(100).optional(),
  short_description: z.string().max(1000).optional(),
  description: z.string().max(5000).optional(),
  salary: z.string().regex(/^\d+$/, "Must be a number").max(9).optional(),
});

export async function updateJobPosting(jobId: string, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }
  const values = Object.fromEntries(formData.entries());

  const validatedFields = updateJobSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const {
    title,
    type,
    companyName,
    locationType,
    categoryId,
    location,
    applicationEmail,
    applicationUrl,
    short_description,
    description,
    salary,
  } = validatedFields.data;

  // Fetch the existing job to get the current slug
  const existingJob = await db.job.findUnique({
    where: { id: jobId, userId: session.user.id },
  });

  if (!existingJob) {
    throw new Error("Job not found or you don't have permission to edit it");
  }

  const updatedJob = await db.job.update({
    where: { id: jobId, userId: session.user.id },
    data: {
      title: title?.trim(),
      type,
      companyName: companyName?.trim(),
      categoryId,
      locationType,
      location,
      applicationEmail: applicationEmail?.trim(),
      applicationUrl: applicationUrl?.trim(),
      short_description: short_description?.trim(),
      description: description?.trim(),
      salary: salary ? parseInt(salary) : undefined,
    },
  });

  redirect(`/jobs/${updatedJob.slug}`);
}
