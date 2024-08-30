// app/api/fetchEssays/route.ts

import { NextRequest, NextResponse } from "next/server";

import Parser from "rss-parser";
import { db } from "@/lib/db";

const parser = new Parser();

export async function POST(request: NextRequest) {
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

    return NextResponse.json(
      { message: "Essays updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating essays:", error);
    return NextResponse.json(
      { error: "Error updating essays" },
      { status: 500 },
    );
  }
}
