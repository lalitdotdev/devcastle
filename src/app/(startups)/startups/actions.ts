"use server";

import { XMLParser } from "fast-xml-parser";
import { db } from "@/lib/db";

export const getEssays = async () => {
  const essays = await db.essay.findMany({
    orderBy: { pubDate: "desc" },
    include: { categories: true },
  });

  return essays;
};

export async function fetchEssays() {
  const response = await fetch(
    "http://www.aaronsw.com/2002/feeds/pgessays.rss",
  );
  const xmlData = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const result = parser.parse(xmlData);

  const items = result.rss.channel.item;

  for (const item of items) {
    await db.essay.upsert({
      where: { link: item.link },
      update: {
        title: item.title,
        description: item.description,
        pubDate: new Date(item.pubDate),
      },
      create: {
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: new Date(item.pubDate),
      },
    });
  }

  return { message: "Essays fetched and stored successfully" };
}
