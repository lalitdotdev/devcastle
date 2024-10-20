"use server";

import { db } from "@/lib/db";
import { del } from "@vercel/blob";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type FormState = { error?: string } | undefined;

export async function approveSubmission(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    // throw new Error("Not implemented");
    const jobId = formData.get("jobId") as string;
    const session = await getAuthSession();
    if (session?.user.role !== "ADMIN") {
      throw new Error("Not Authorized !!");
    }

    await db.job.update({
      where: { id: jobId },
      data: { approved: true },
    });
    revalidatePath("/");
  } catch (error) {
    let message = "An error occurred while approving the submission";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

// delete a job server action
export async function deleteJob(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    // throw new Error("Not implemented");
    const jobId = formData.get("jobId") as string;
    const session = await getAuthSession();
    if (session?.user.role !== "ADMIN") {
      throw new Error("Not Authorized !!");
    }
    const job = await db.job.findUnique({
      where: { id: jobId },
    });
    if (job?.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }
    await db.job.delete({
      where: { id: jobId },
    });
    revalidatePath("/");
  } catch (error) {
    let message = "An error occurred while deleting the job";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}
