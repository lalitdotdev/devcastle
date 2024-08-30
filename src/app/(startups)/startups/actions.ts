"use server";

import Parser from "rss-parser";
import { db } from "@/lib/db";

const parser = new Parser();

export const getEssays = async () => {
  const essays = await db.essay.findMany({
    orderBy: { pubDate: "desc" },
    include: { categories: true },
  });

  return essays;
};

export async function updateEssays() {
  try {
    const feed = await parser.parseURL(
      "http://www.aaronsw.com/2002/feeds/pgessays.rss",
    );

    for (const item of feed.items) {
      await db.essay.upsert({
        where: { link: item.link as string },
        update: {
          title: item.title as string,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet,
          description: item.summary,
          updatedAt: new Date(), // Update the updatedAt field
          categories: {
            connectOrCreate:
              item.categories?.map((categoryName) => ({
                where: { name: categoryName },
                create: { name: categoryName },
              })) || [],
          },
        },
        create: {
          title: item.title as string,
          link: item.link as string,
          pubDate: new Date(),
          description: item.contentSnippet,
          categories: {
            connectOrCreate:
              item.categories?.map((categoryName) => ({
                where: { name: categoryName },
                create: { name: categoryName },
              })) || [],
          },
        },
      });
    }

    return { message: "Essays updated successfully" };
  } catch (error) {
    console.error("Error updating essays:", error);
    throw new Error("Error updating essays");
  }
}
