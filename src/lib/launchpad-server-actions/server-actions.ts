"use server";

import { authOptions } from "../auth";
import { db } from "../db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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

// ==================================== User Actions ====================================
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

export const updateProduct = async (
  productId: string,
  {
    name,
    slug,
    headline,
    description,
    logo,
    releaseDate,
    website,
    twitter,
    discord,
    images,
  }: ProductData,
) => {
  const authenticatedUser = await getServerSession(authOptions);

  if (!authenticatedUser) {
    throw new Error("You must be signed in to update a product");
  }

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
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      discord,
      images: {
        deleteMany: {
          productId,
        },
        createMany: {
          data: images.map((image) => ({ url: image })),
        },
      },
      status: "PENDING",
    },
  });
  return product;
};

export const deleteProduct = async (productId: string) => {
  const authenticatedUser = await getServerSession(authOptions);

  if (
    !authenticatedUser ||
    !authenticatedUser.user ||
    !authenticatedUser.user.id
  ) {
    throw new Error("User ID is missing or invalid");
  }

  const userId = authenticatedUser.user.id;

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product || product.userId !== userId) {
    throw new Error("Product not found or not authorized");
  }

  await db.product.delete({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });
  return true;
};

export const getUpvotedProducts = async () => {
  try {
    const authenticatedUser = await getServerSession(authOptions);

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const upvotedProducts = await db.productUpvote.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return upvotedProducts.map((upvote) => upvote.product);
  } catch (error) {
    console.error("Error getting upvoted products:", error);
    return [];
  }
};
export const getProductBySlug = async (slug: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        slug,
      },
      include: {
        images: true,
        categories: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
          },
        },
      },
    });
    return product;
  } catch (error) {
    console.error("Error getting product by slug:", error);
    return null;
  }
};

export const getCategories = async () => {
  const categories = await db.launchPadCategory.findMany({
    where: {
      products: {
        some: {
          status: "ACTIVE",
        },
      },
    },
  });

  return categories;
};

export const commentOnProduct = async (
  productId: string,
  commentText: string,
) => {
  try {
    const authenticatedUser = await getServerSession(authOptions);

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    // Check if authenticated user has a profile picture
    const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined

    await db.launchPadComment.create({
      data: {
        createdAt: new Date(),
        productId,
        userId,
        body: commentText,
        profilePicture: profilePicture,
      },
      include: {
        user: true,
      },
    });

    const productDetails = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        userId: true,
        name: true, // Include the product name in the query
      },
    });

    // Check if the commenter is not the owner of the product
    if (productDetails && productDetails.userId !== userId) {
      // Notify the product owner about the comment
      await db.launchPadNotification.create({
        data: {
          userId: productDetails.userId,
          body: `Commented on your product "${productDetails.name}"`,
          profilePicture: profilePicture,
          productId: productId,
          type: "COMMENT",
          status: "UNREAD",
          // Ensure commentId is included here
        },
      });
    }
    revalidatePath(`/launchpad`);
  } catch (error) {
    console.error("Error commenting on product:", error);
    throw error;
  }
};

export const deleteProductComment = async (commentId: string) => {
  try {
    await db.launchPadComment.delete({
      where: {
        id: commentId,
      },
    });
    revalidatePath(`/launchpad`);
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const authenticatedUser = await getServerSession(authOptions);

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const notifications = await db.launchPadNotification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (notifications.length === 0) {
      return null;
    }

    return notifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const authenticatedUser = await getServerSession(authOptions);

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser?.user.id;

    await db.launchPadNotification.updateMany({
      where: {
        userId,
      },
      data: {
        status: "READ",
      },
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export const searchProducts = async (query: string) => {
  const products = await db.product.findMany({
    where: {
      name: {
        contains: query,
      },
      status: "ACTIVE",
    },
  });

  return products;
};

export const getProductsByUserId = async (userId: string) => {
  const products = await db.product.findMany({
    where: {
      userId,
    },
  });

  return products;
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

export const getActiveProducts = async () => {
  const products = await db.product.findMany({
    where: {
      status: "ACTIVE",
    },
    include: {
      categories: true,
      images: true,
      comments: {
        include: {
          user: true,
        },
      },
      upvotes: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      upvotes: {
        _count: "desc",
      },
    },
  });

  return products;
};

export const getRejectedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      status: "REJECTED",
    },
    include: {
      categories: true,
      images: true,
    },
  });

  return products;
};

export const getUsers = async () => {
  const users = await db.user.findMany();

  return users;
};

export const getTotalUpvotes = async () => {
  const totalUpvotes = await db.productUpvote.count({
    where: {
      product: {
        status: "ACTIVE",
      },
    },
  });
  return totalUpvotes;
};

export const getAdminData = async () => {
  const totalProducts = await db.product.count();
  const totalUsers = await db.user.count();
  const totalUpvotes = await db.productUpvote.count();
  const totalComments = await db.launchPadComment.count();
  const totalCategories = await db.launchPadCategory.count();

  return {
    totalProducts,
    totalUsers,
    totalUpvotes,
    totalComments,
    totalCategories,
  };
};

// ==================================== Product Actions ====================================

export const upvoteProduct = async (productId: string) => {
  try {
    const authenticatedUser = await getServerSession(authOptions);

    if (
      !authenticatedUser ||
      !authenticatedUser.user ||
      !authenticatedUser.user.id
    ) {
      throw new Error("User ID is missing or invalid");
    }

    const userId = authenticatedUser.user.id;

    const upvote = await db.productUpvote.findFirst({
      where: {
        productId,
        userId,
      },
    });

    const profilePicture = authenticatedUser.user.image || ""; // Use an empty string if profile picture is undefined

    if (upvote) {
      await db.productUpvote.delete({
        where: {
          id: upvote.id,
        },
      });
    } else {
      await db.productUpvote.create({
        data: {
          productId,
          userId,
        },
      });

      const productOwner = await db.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          userId: true,
        },
      });

      // notify the product owner about the upvote

      if (productOwner && productOwner.userId !== userId) {
        await db.launchPadNotification.create({
          data: {
            userId: productOwner.userId,
            body: `Upvoted your product`,
            profilePicture: profilePicture,
            productId: productId,
            type: "UPVOTE",
            status: "UNREAD",
          },
        });
      }
    }
    return true;
  } catch (error) {
    console.error("Error upvoting product:", error);
    throw error;
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: true,
        images: true,
        comments: {
          include: {
            user: true,
          },
        },
        upvotes: {
          include: {
            user: true,
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

export const getRankById = async (): Promise<
  {
    id: string;
    name: string;
    upvotes: { id: string }[];
    rank: number;
  }[]
> => {
  // Fetch products along with their upvote counts from the database
  const rankedProducts = await db.product.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      upvotes: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      upvotes: {
        _count: "desc", // Order by upvotes count in descending order
      },
    },
  });

  // Find the maximum number of upvotes among all products
  const maxUpvotes =
    rankedProducts.length > 0 ? rankedProducts[0].upvotes.length : 0;

  // Assign ranks to each product based on their number of upvotes
  const productsWithRanks = rankedProducts.map((product, index) => ({
    ...product,
    rank: product.upvotes.length === maxUpvotes ? 1 : index + 2,
  }));

  return productsWithRanks;
};

export const getProductsByCategoryName = async (category: string) => {
  const products = await db.product.findMany({
    where: {
      categories: {
        some: {
          name: category,
        },
      },
      status: "ACTIVE",
    },
  });
  return products;
};
