"use server";

import { revalidatePath } from "next/cache";

export async function fetchProductHuntPosts() {
  const API_ENDPOINT = "https://api.producthunt.com/v2/api/graphql";
  const ACCESS_TOKEN = process.env.PRODUCT_HUNT_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    throw new Error("Product Hunt access token is not set");
  }

  const query = `
    query {
      posts(first: 25) {
        edges {
          node {
            id
            name
            tagline
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

    // Revalidate the path to update the cached data
    revalidatePath("/");

    return data.data.posts.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
