"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";

// Create a new schema for updates, making all fields optional
const updateJobSchema = z.object({
  title: z.string().min(1, "Required").max(100).optional(),
  type: z.enum(["full-time", "part-time", "contract", "internship"]).optional(),
  companyName: z.string().min(1, "Required").max(100).optional(),
  locationType: z.enum(["remote", "hybrid", "on-site"]).optional(),
  location: z.string().max(100).optional(),
  applicationEmail: z.string().email().max(100).optional(),
  applicationUrl: z.string().url().max(100).optional(),
  description: z.string().max(5000).optional(),
  salary: z.string().regex(/^\d+$/, "Must be a number").max(9).optional(),
});

export async function updateJobPosting(jobId: string, formData: FormData) {
  const values = Object.fromEntries(formData.entries());
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validatedFields = updateJobSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.message);
  }

  const {
    title,
    type,
    companyName,
    locationType,
    location,
    applicationEmail,
    applicationUrl,
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
      locationType,
      location,
      applicationEmail: applicationEmail?.trim(),
      applicationUrl: applicationUrl?.trim(),
      description: description?.trim(),
      salary: salary ? parseInt(salary) : undefined,
    },
  });

  redirect(`/jobs/${updatedJob.slug}`);
}
