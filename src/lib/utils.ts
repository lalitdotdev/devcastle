import { ClassValue, clsx } from "clsx";

import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | string): string {
  // Ensure the input is treated as a number and remove commas
  num = typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;

  if (isNaN(num)) {
    return "0"; // Return '0' if the input is not a valid number
  }

  if (Math.abs(num) >= 1e6) {
    // Show in millions with 'M'
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (Math.abs(num) >= 1e3) {
    // Show in thousands with 'k'
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    return num.toString(); // Show as is for numbers less than 1000
  }
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

// Utility to truncate long text
export const truncateText = (text: string, maxLength: number) => {
  if (text?.length <= maxLength) return text;
  return text?.slice(0, maxLength) + "...";
};

// utils/feedUtils.ts

export const getAuthorName = (author: any): string => {
  return author && typeof author === "object" && "#text" in author
    ? author["#text"]
    : "";
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
    }
  }

  return result;
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// convert a string to a slug (e.g. "Hello World" => "hello-world")
export function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}
