import { XMLParser } from "fast-xml-parser";

export async function getEntrepreneurFeed() {
  try {
    const response = await fetch("https://www.entrepreneur.com/latest.rss");

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
      id: item.guid,
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate),
      contentSnippet: item.description,
      categories: item.category
        ? [{ id: item.category, name: item.category }]
        : [],
      description: item["media:content"]?.["media:description"] || "",
      author: item["dc:creator"],
      // You might want to add image URL if available
      imageUrl: item["media:content"]?.["@_url"] || "",
    }));

    return entries;
  } catch (error) {
    console.error("Failed to fetch or parse Entrepreneur feed:", error);
    return [];
  }
}
