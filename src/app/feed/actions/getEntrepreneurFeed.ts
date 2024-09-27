"use server";

import { XMLParser } from "fast-xml-parser";
import { revalidatePath } from "next/cache";

type FeedEntry = {
  id: string;
  title: string;
  link: string;
  pubDate: Date;
  contentSnippet: string;
  categories: { id: string; name: string }[];
  description: string;
  author: string;
  imageUrl: string;
};

export async function getEntrepreneurFeed(): Promise<FeedEntry[]> {
  const url = "https://www.entrepreneur.com/latest.rss";

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const result = parser.parse(xml);

    if (!result.rss || !result.rss.channel || !result.rss.channel.item) {
      throw new Error("Unexpected RSS feed structure");
    }

    const entries: FeedEntry[] = result.rss.channel.item.map((item: any) => ({
      id: item.guid,
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate),
      contentSnippet: item.description,
      categories: item.category
        ? Array.isArray(item.category)
          ? item.category.map((cat: string) => ({ id: cat, name: cat }))
          : [{ id: item.category, name: item.category }]
        : [],
      description: item["media:content"]?.["media:description"] || "",
      author: item["dc:creator"],
      imageUrl: item["media:content"]?.["@_url"] || "",
    }));

    // Revalidate the path after fetching new data
    revalidatePath("/startups/catalog/essays");

    return entries;
  } catch (error) {
    console.error("Failed to fetch or parse Entrepreneur feed:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
