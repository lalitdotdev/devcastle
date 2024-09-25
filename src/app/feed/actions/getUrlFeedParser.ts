// app/actions/getFeed.ts
"use server";

import { XMLParser } from "fast-xml-parser";

export async function getUrlFeedParser(url: string) {
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

    const entries = result.rss.channel.item.map((item: any) => ({
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
    return [];
  }
}

function extractImageUrl(content: string): string {
  const match = content.match(/<img[^>]+src="?([^"\s]+)"?\s*/);
  return match ? match[1] : "";
}
