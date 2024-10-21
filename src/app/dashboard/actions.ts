"use server";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserJobs() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to fetch jobs");
  }

  const jobs = await db.job.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  revalidatePath("/dashboard"); // Adjust this path as needed

  return jobs;
}
