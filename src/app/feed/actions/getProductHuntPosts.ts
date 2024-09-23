// app/actions/productHunt.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ProductHuntPostData {
  id: string;
  name: string;
  tagline: string;
  description: string | null;
  url: string;
  votesCount: number;
  createdAt: string;
  thumbnail: { url: string } | null;
  website: string | null;
  topics: { edges: { node: { name: string } }[] };
}

interface FetchResult {
  success: boolean;
  message: string;
}

export async function fetchAndStoreProductHuntPosts(): Promise<FetchResult> {
  const API_ENDPOINT = "https://api.producthunt.com/v2/api/graphql";
  const ACCESS_TOKEN = process.env.PRODUCT_HUNT_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    throw new Error("Product Hunt access token is not set");
  }

  const query = `
    query {
      posts(first: 50) {
        edges {
          node {
            id
            name
            tagline
            description
            url
            votesCount
            createdAt
            thumbnail {
              url
            }
            website
            topics(first: 3) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const posts: ProductHuntPostData[] = data.data.posts.edges.map(
      (edge: any) => edge.node,
    );

    await Promise.all(
      posts.map(async (post) => {
        await db.productHuntPost.upsert({
          where: { id: post.id },
          update: {
            name: post.name,
            tagline: post.tagline,
            description: post.description,
            url: post.url,
            votesCount: post.votesCount,
            createdAt: new Date(post.createdAt),
            thumbnailUrl: post.thumbnail?.url ?? null,
            website: post.website,
            topics: {
              set: [], // Clears the current topics for the post
              connectOrCreate: post.topics.edges.map((topicEdge) => ({
                where: { name: topicEdge.node.name }, // Try to connect by name
                create: { name: topicEdge.node.name }, // Create if it doesn't exist
              })),
            },
          },
          create: {
            id: post.id,
            name: post.name,
            tagline: post.tagline,
            description: post.description,
            url: post.url,
            votesCount: post.votesCount,
            createdAt: new Date(post.createdAt),
            thumbnailUrl: post.thumbnail?.url ?? null,
            website: post.website,
            topics: {
              connectOrCreate: post.topics.edges.map((topicEdge) => ({
                where: { name: topicEdge.node.name }, // Try to connect by name
                create: { name: topicEdge.node.name }, // Create if it doesn't exist
              })),
            },
          },
        });
      }),
    );

    revalidatePath("/");

    return {
      success: true,
      message: "Product Hunt feed imported successfully",
    };
  } catch (error) {
    console.error("Error fetching and storing posts:", error);
    return { success: false, message: "Failed to import Product Hunt feed" };
  }
}

export async function getProductHuntPosts() {
  try {
    const posts = await db.productHuntPost.findMany({
      include: {
        topics: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts from database:", error);
    throw error;
  }
}
