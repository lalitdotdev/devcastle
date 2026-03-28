import { PrismaClient } from "@prisma/client";
import { Redis } from "@upstash/redis";
// If you are using standard Node.js without Bun, you may need to install 'dotenv' 
// or run with the --env-file flag: node --env-file=.env scripts/populate-redis.js
try {
  const dotenv = await import("dotenv");
  dotenv.config();
} catch (e) {
  // dotenv not found, assuming env vars are already loaded (e.g. by Bun or --env-file)
}

if (!process.env.REDIS_URL || !process.env.REDIS_SECRET) {
  console.error("❌ Error: REDIS_URL or REDIS_SECRET is missing in environment variables.");
  console.log("Please ensure they are set in your .env file or deployment environment.");
  process.exit(1);
}

const prisma = new PrismaClient();
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_SECRET,
});

async function populateRedisCache() {
  console.log("🚀 Starting Upstash Redis cache population...");
  
  try {
    // Fetch all posts with their authors and votes from the primary database
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        votes: true,
      },
    });

    console.log(`📝 Found ${posts.length} posts to process.`);
    
    let cachedCount = 0;

    for (const post of posts) {
      // Calculate total votes (Upvotes - Downvotes)
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UPVOTE") return acc + 1;
        if (vote.type === "DOWNVOTE") return acc - 1;
        return acc;
      }, 0);

      // Match the application logic: cache posts with at least 1 upvote
      if (votesAmt >= 1) {
        const cachePayload = {
          authorUsername: post.author.username || "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: null, // Global cache doesn't store per-user state
          createdAt: post.createdAt,
        };

        // Store the post in Redis as a hash
        await redis.hset(`post:${post.id}`, cachePayload);
        cachedCount++;
        process.stdout.write("."); // Progress indicator
      }
    }

    console.log(`\n\n✅ Done! Population complete.`);
    console.log(`📊 Total posts processed: ${posts.length}`);
    console.log(`✨ Total posts cached: ${cachedCount}`);
    
  } catch (error) {
    console.error("\n❌ Error during population:", error);
  } finally {
    await prisma.$disconnect();
  }
}

populateRedisCache().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
