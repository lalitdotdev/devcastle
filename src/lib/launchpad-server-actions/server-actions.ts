"use server";

import { authOptions } from "../auth";
import { db } from "../db";
import { getServerSession } from "next-auth";

interface ProductData {
  name: string;
  slug: string;
  headline: string;
  rank?: number;
  description: string;
  logo: string;
  releaseDate: string;
  images: string[];
  website: string;
  twitter: string;
  discord: string;
  categories: string[];
}

export const createProduct = async ({
  name,
  slug,
  headline,
  description,
  logo,
  releaseDate,
  images,
  website,
  twitter,
  discord,
  categories,
}: ProductData) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const product = await db.product.create({
      data: {
        name,
        rank: 0, // Default rank set to 0
        slug,
        headline,
        description,
        logo,
        releaseDate,
        website,
        twitter,
        discord,
        status: "PENDING", // Default status set to PENDING
        categories: {
          connectOrCreate: categories.map((name) => ({
            where: {
              name,
            },
            create: {
              name,
            },
          })),
        },
        images: {
          createMany: {
            data: images.map((image) => ({ url: image })),
          },
        },

        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getOwnerProducts = async () => {
  const authenticatedUser = await getServerSession(authOptions);

  if (!authenticatedUser) {
    return [];
  }

  const userId = authenticatedUser.user?.id;

  const products = await db.product.findMany({
    where: {
      userId,
    },
  });

  return products;
};

export const isUserPremium = async () => {
  const authenticatedUser = await getServerSession(authOptions);

  if (
    !authenticatedUser ||
    !authenticatedUser.user ||
    !authenticatedUser.user.id
  ) {
    throw new Error("User ID is missing or invalid");
  }

  const userId = authenticatedUser.user.id;

  // get the user

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.isPremium;
};

// ==================================== Admin Actions ====================================

export const getPendingProducts = async () => {
  const products = await db.product.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      categories: true,
      images: true,
    },
  });

  return products;
};

export const activateProduct = async (productId: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "ACTIVE",
      },
    });

    await db.launchPadNotification.create({
      data: {
        userId: product.userId,
        body: `Your product ${product.name} has been activated`,
        type: "ACTIVATED",
        status: "UNREAD",
        profilePicture: product.logo,
        productId: product.id,
      },
    });

    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const rejectProduct = async (productId: string, reason: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found or not authorized");
    }

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        status: "REJECTED",
      },
    });

    await db.launchPadNotification.create({
      data: {
        userId: product.userId,
        body: `Your product "${product.name}" has been rejected. Reason: ${reason}`,
        type: "REJECTED",
        status: "UNREAD",
        profilePicture: `${product.logo}`,
        productId: productId,
      },
    });
  } catch (error) {
    console.error("Error rejecting product:", error);
    throw error;
  }
};
