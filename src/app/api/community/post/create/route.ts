import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // TODO: Subscribe to community
    const { communityId, title, content } = PostValidator.parse(body);

    // check if user is already subscribed to community

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        communityId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response("Subscribe to post", { status: 400 });
    }

    // TODO: processing the request

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        communityId,
      },
    });

    // return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid POST request data passed", { status: 422 });
    }
    return new Response(
      "Could not post to community at this time , please try again",
      {
        status: 500,
      }
    );
  }
}
