import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommunityValidator } from "@/lib/validators/community";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json(); // getting the body content of the request as JSON object

    const { name, description } = CommunityValidator.parse(body);

    const communityExists = await db.community.findFirst({
      where: {
        name,
      },
    });

    if (communityExists) {
      return new Response(
        "Community already exists please choose another one",
        { status: 409 }
      );
    }

    const community = await db.community.create({
      data: {
        name,
        description,
        creatorId: session.user.id,
      },
    });

    // subscribe creator to their own community
    await db.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    });

    const responseData = {
      name: community.name,
      description: community.description,
    };
    const responseBody = JSON.stringify(responseData);
    return new Response(responseBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response("Could not create community", { status: 500 });
  }
}
