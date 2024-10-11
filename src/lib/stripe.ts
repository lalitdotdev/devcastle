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

// Create a function to get customer portal link
export const createCustomerLink = async () => {
  try {
    const authenticatedUser = await getServerSession(authOptions);

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.email
    ) {
      throw new Error("User not authenticated");
    }

    const email = authenticatedUser.user.email;

    console.log(email, "email");

    const customers = await stripe.customers.list({
      email: email,
    });

    if (!customers || customers.data.length == 0) {
      throw new Error("Customer not found");
    }

    const customer = customers.data[0];

    if (!customer || !customer.id) {
      throw new Error("Customer not found");
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `http://localhost:3000/launchpad/my-products`,
    });

    return portal.url;
  } catch (error) {
    console.error("Stripe error:", error);

    throw new Error("Customer not found");
  }
};
