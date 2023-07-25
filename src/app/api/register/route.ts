import { db } from "@/lib/db";
import { UserRegisterationValidator } from "@/lib/validators/userCredentials";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } =
      UserRegisterationValidator.parse(body);

    if (!username || !email || !password) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const credentialExists = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (credentialExists) {
      return new NextResponse("User already exists", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });

    return new Response(JSON.stringify(user));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid POST request data passed", { status: 422 });
    }
    return new Response("user not created in db, please try again!", {
      status: 500,
    });
  }
}
