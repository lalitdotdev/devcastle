"use server";

import { db } from "@/lib/db";

export async function getCommunities() {
  const communities = await db.community.findMany({
    take: 7,
    orderBy: {
      subscribers: {
        _count: "desc",
      },
    },
  });

  return communities;
}
