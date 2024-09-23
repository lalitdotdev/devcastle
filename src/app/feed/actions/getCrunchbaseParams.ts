"use server";

// app/actions/crunchbaseFeed.ts

import { revalidatePath } from "next/cache";

const CRUNCHBASE_API_KEY = process.env.CRUNCHBASE_API_KEY;
const CRUNCHBASE_API_URL = "https://api.crunchbase.com/api/v4";

type SortOrder = "asc" | "desc";

interface FetchCrunchbaseFeedParams {
  query?: string;
  types?: string[];
  locations?: string[];
  fundingType?: string;
  fundingTotalMin?: number;
  fundingTotalMax?: number;
  foundedAfter?: string; // YYYY-MM-DD
  foundedBefore?: string; // YYYY-MM-DD
  lastFundingAt?: string; // YYYY-MM-DD
  sortOrder?: SortOrder;
  sortColumn?: string;
  limit?: number;
  page?: number;
}

export async function fetchCrunchbaseFeed(params: FetchCrunchbaseFeedParams) {
  if (!CRUNCHBASE_API_KEY) {
    throw new Error("Crunchbase API key is not set");
  }

  // Create an object with all parameters, converting them to strings or undefined
  const queryParamsObj: Record<string, string | undefined> = {
    user_key: CRUNCHBASE_API_KEY,
    query: params.query,
    types: params.types?.join(","),
    locations: params.locations?.join(","),
    funding_type: params.fundingType,
    funding_total_min: params.fundingTotalMin?.toString(),
    funding_total_max: params.fundingTotalMax?.toString(),
    founded_after: params.foundedAfter,
    founded_before: params.foundedBefore,
    last_funding_at: params.lastFundingAt,
    sort_order: params.sortOrder,
    sort_column: params.sortColumn,
    limit: params.limit?.toString(),
    page: params.page?.toString(),
  };

  // Filter out undefined values
  const filteredParams = Object.entries(queryParamsObj)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  // Create URLSearchParams from the filtered object
  const queryParams = new URLSearchParams(filteredParams);

  try {
    const response = await fetch(
      `${CRUNCHBASE_API_URL}/searches/organizations?${queryParams}`,
      {
        headers: {
          "X-cb-user-key": CRUNCHBASE_API_KEY,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process and enrich the data
    const enrichedData = data.entities.map((entity: any) => ({
      uuid: entity.uuid,
      name: entity.properties.name,
      shortDescription: entity.properties.short_description,
      profileImageUrl: entity.properties.profile_image_url,
      website: entity.properties.website?.value,
      linkedinUrl: entity.properties.linkedin?.value,
      twitterUrl: entity.properties.twitter?.value,
      fundingTotal: entity.properties.funding_total?.value_usd,
      foundedOn: entity.properties.founded_on?.value,
      lastFundingAt: entity.properties.last_funding_at,
      employeeCount: entity.properties.num_employees_enum,
      industries: entity.properties.categories?.map((cat: any) => cat.value),
      headquarters: entity.properties.headquarters_regions
        ?.map((hq: any) => hq.value)
        .join(", "),
    }));

    // Optionally revalidate the path where this data will be used
    revalidatePath("/startups/catalog/crunchbase-feed");

    return {
      entities: enrichedData,
      count: data.count,
      total: data.total,
      pageInfo: data.paging,
    };
  } catch (error) {
    console.error("Error in fetchCrunchbaseFeed:", error);
    throw error; // Re-throw the error after logging
  }
}
23
