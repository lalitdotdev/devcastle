import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorised", { status: 401 });
    }

    // store comment in database
    await db.comment.create({
      data: {
        text,
        replyToId,
        postId,
        authorId: session.user.id,
      },
    });

    return new Response("OK! Comment created in DB");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid POST request data passed", { status: 422 });
    }
    return new Response("Could not create comment , please try again later!", {
      status: 500,
    });
  }
}
