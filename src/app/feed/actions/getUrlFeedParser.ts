// app/actions/getFeed.ts
"use server";

import { XMLParser } from "fast-xml-parser";
import { revalidatePath } from "next/cache";

interface FeedEntry {
  id: string;
  title: string;
  link: string;
  pubDate: Date;
  contentSnippet: string;
  categories: { id: string; name: string }[];
  content: string;
  author: string | undefined;
  imageUrl: string;
}

export async function getUrlFeedParser(url: string): Promise<FeedEntry[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const result = parser.parse(xml);

    const items = result.rss?.channel?.item || [];

    const entries: FeedEntry[] = items.map((item: any) => ({
      id: item.guid || item.link,
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate),
      contentSnippet: item.description,
      categories: Array.isArray(item.category)
        ? item.category.map((cat: string) => ({ id: cat, name: cat }))
        : item.category
          ? [{ id: item.category, name: item.category }]
          : [],
      content: item["content:encoded"] || item.description,
      author: item["dc:creator"] || item.author,
      imageUrl: extractImageUrl(item["content:encoded"] || item.description),
    }));

    return entries;
  } catch (error) {
    console.error("Failed to fetch or parse feed:", error);
    throw error; // Rethrow the error for the calling component to handle
  }
}

function extractImageUrl(content: string): string {
  const match = content.match(/<img[^>]+src="?([^"\s]+)"?\s*/);
  return match ? match[1] : "";
}
