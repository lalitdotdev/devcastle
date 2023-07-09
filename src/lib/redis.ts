import { Redis } from "@upstash/redis";

// defining a redis instance
export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_SECRET!,
});
