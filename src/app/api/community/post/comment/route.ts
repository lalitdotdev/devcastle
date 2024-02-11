import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorised', { status: 401 });
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

    return new Response('OK! Comment created in DB');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid POST request data passed', { status: 422 });
    }
    return new Response('Could not create comment , please try again later!', {
      status: 500,
    });
  }
}

export async function handler(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorised', { status: 401 });
    }

    if (req.method === 'PATCH') {
      // Creation logic
      const body = await req.json();
      const { postId, text, replyToId } = CommentValidator.parse(body);

      // Store comment in the database
      await db.comment.create({
        data: {
          text,
          replyToId,
          postId,
          authorId: session.user.id,
        },
      });

      return new Response('OK! Comment created in DB');
    } else if (req.method === 'DELETE') {
      // Deletion logic
      const body = await req.json();
      const { commentId } = CommentValidator.parse(body);

      // Ensure that the user has the right to delete the comment
      const comment = await db.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true }, // Assuming your Comment model has an authorId field
      });

      if (!comment) {
        return new Response('Comment not found', { status: 404 });
      }

      if (comment.authorId !== session.user.id) {
        return new Response('Permission denied', { status: 403 });
      }

      // Perform the delete operation using the Prisma model
      await db.comment.delete({ where: { id: commentId } });

      return new Response('OK! Comment deleted from DB');
    } else {
      return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
