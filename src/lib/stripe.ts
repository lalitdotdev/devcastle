"use server";

import Stripe from "stripe";
import { authOptions } from "./auth";
import { getServerSession } from "next-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const priceId = "price_1Q8U9ZSH0nA3JHusV0uD4UZq";

// Create a function to generate checkout link
export const createCheckoutSession = async ({ email }: { email: string }) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `http://localhost:3000/launchpad/new-product`,
      cancel_url: `http://localhost:3000/launchpad`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Failed to create checkout session");
  }
};
