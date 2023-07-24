import { db } from "@/lib/db";
import { UserCredentialsValidator } from "@/lib/validators/userCredentials";

import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = UserCredentialsValidator.parse(body);

    if (!name || !email || !password) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const credentialExists = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (credentialExists) {
      return new Response("Email already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return new Response("OK! User created in DB");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid POST request data passed", { status: 422 });
    }
    return new Response("user not created in db, please try again!", {
      status: 500,
    });
  }
}
