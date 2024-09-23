"use server";

import * as cheerio from "cheerio";

import { revalidatePath } from "next/cache";

interface BlogPost {
  title: string;
  url: string;
  date: string;
}

export async function scrapeArpitBhayaniBlogPosts() {
  const url = "https://arpitbhayani.me/blogs"; // Replace with the actual URL

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    const $ = cheerio.load(html);
    const blogPosts: BlogPost[] = [];

    $("ul li").each((index, element) => {
      const $element = $(element);
      const title = $element.find("a").text().trim();
      const url = $element.find("a").attr("href");
      const date = $element.find("span.is-hidden-mobile").text().trim();

      if (title && url && date) {
        blogPosts.push({ title, url, date });
      }
    });

    // Optionally revalidate the path where this data will be used
    revalidatePath("/blog-feed");

    return blogPosts;
  } catch (error) {
    console.error("Error scraping blog posts:", error);
    throw error;
  }
}
