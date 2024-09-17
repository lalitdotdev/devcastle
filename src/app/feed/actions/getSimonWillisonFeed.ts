import { XMLParser } from "fast-xml-parser";

export async function getSimonWillisonFeed() {
  try {
    const response = await fetch("https://simonwillison.net/atom/everything/");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const result = parser.parse(xml);

    const entries = result.feed.entry.map((entry: any) => {
      let link = "";
      if (Array.isArray(entry.link)) {
        const alternateLink = entry.link.find(
          (l: any) => l["@_rel"] === "alternate",
        );
        link = alternateLink
          ? alternateLink["@_href"]
          : entry.link[0]["@_href"];
      } else if (typeof entry.link === "object") {
        link = entry.link["@_href"];
      }

      const categoryNames = Array.isArray(entry.category)
        ? entry.category.map((c: any) => c["@_term"])
        : entry.category
          ? [entry.category["@_term"]]
          : [];

      return {
        id: entry.id || `${entry.title}-${entry.published}`, // Fallback if no id is provided
        title: entry.title,
        link: link,
        pubDate: new Date(entry.published),
        contentSnippet:
          typeof entry.summary === "object"
            ? entry.summary["#text"]
            : entry.summary,
        categories: categoryNames.map((name: string) => ({ id: name, name })), // Create simple category objects
        description: entry.content ? entry.content["#text"] : "",
      };
    });

    return entries;
  } catch (error) {
    console.error("Failed to fetch or parse feed:", error);
    return []; // Return an empty array or handle the error as needed
  }
}
