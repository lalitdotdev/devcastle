import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: Request & { query: { commentId: string } }) {
  try {
    const { commentId } = req.query;
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorised", { status: 401 });
    }

    // delete comment from database and all associated likes and replies to comment from database as well (cascade delete) using Prisma deleteMany method

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        votes: true,
        replies: true,
      },
    });

    if (!comment?.id) {
      return new Response("Comment not found", { status: 402 });
    }

    // Finally, delete the comment itself
    await db.comment.deleteMany({
      where: {
        id: comment.id,
      },
    });

    return new Response("OK! Comment deleted from DB", { status: 200 });
  } catch (error) {
    return new Response("Could not delete comment , please try again later!", {
      status: 500,
    });
  }
}
