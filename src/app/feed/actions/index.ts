"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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

export async function getTopCommunities() {
  return await db.community.findMany({
    take: 7,
    orderBy: {
      subscribers: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: {
          subscribers: true,
        },
      },
    },
  });
}

export async function getSubscribedCommunities() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  const subscribedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      communityId: true,
    },
  });

  return subscribedCommunities.map((sub) => sub.communityId);
}
export async function joinCommunity(communityId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Must be logged in");
  }

  await db.subscription.create({
    data: {
      userId: session.user.id,
      communityId,
    },
  });

  revalidatePath("/");
}

export async function leaveCommunity(communityId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Must be logged in");
  }

  await db.subscription.delete({
    where: {
      userId_communityId: {
        userId: session.user.id,
        communityId,
      },
    },
  });

  revalidatePath("/");
}
