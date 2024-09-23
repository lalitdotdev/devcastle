"use server";

import { XMLParser } from "fast-xml-parser";

export async function getStartupMagazineFeed() {
  try {
    const response = await fetch("https://thestartupmag.com/feed/");

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
      id: item.guid["#text"],
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate),
      contentSnippet: item.description,
      categories: Array.isArray(item.category)
        ? item.category.map((cat: string) => ({ id: cat, name: cat }))
        : item.category
          ? [{ id: item.category, name: item.category }]
          : [],
      content: item["content:encoded"],
      author: item["dc:creator"],
      imageUrl: extractImageUrl(item["content:encoded"]),
    }));

    return entries;
  } catch (error) {
    console.error("Failed to fetch or parse The Startup Magazine feed:", error);
    return [];
  }
}

function extractImageUrl(content: string): string {
  const match = content.match(/<img[^>]+src="?([^"\s]+)"?\s*/);
  return match ? match[1] : "";
}
