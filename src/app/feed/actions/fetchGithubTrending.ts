import * as cheerio from "cheerio";

import { formatNumber } from "@/lib/utils";

const GITHUB_TRENDING_BASE_URL = "https://github.com/trending";

export interface Github {
  title: string;
  description: string;
  url: string;
  stars: string | number;
  language: string;
}

// Server action function to fetch GitHub trending repositories
export async function fetchGithubTrending(
  lang: string = "all",
  since: string = "daily ",
): Promise<Github[]> {
  try {
    if (lang === "all") {
      lang = "";
    }

    const url = `${GITHUB_TRENDING_BASE_URL}/${lang}?since=${since}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const repos: Github[] = [];

    $("article.Box-row").each((index, element) => {
      const repo: Github = {
        title: $(element).find("h2.h3.lh-condensed").text().trim(),
        description: $(element).find("p.col-9").text().trim(),
        url: `https://github.com${$(element).find("h2.h3.lh-condensed a").attr("href")}`,
        language: $(element).find("p.col-9").text().trim(),
        stars: formatNumber(
          parseInt(
            $(element)
              .find(`a[href*="/stargazers"]`)
              .text()
              .trim()
              .replace(/,/g, ""),
          ),
        ),
      };
      repos.push(repo);
    });

    return repos;
  } catch (error) {
    console.error(error);
    return [];
  }
}
