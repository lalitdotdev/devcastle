import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Define dummy data for Users
  const users = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      username: "johndoe",
      image: "https://placeimg.com/64/64/people",
      // hashedPassword: "hashed_password", // You'll need to handle password hashing separately
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      username: "janesmith",
      image: "https://placeimg.com/64/64/people",
      // hashedPassword: "hashed_password", // You'll need to handle password hashing separately
    },
  ];

  // Define dummy data for Posts
  const posts = [
    {
      title: "My First Post",
      content: {
        text: "This is the content of my first post!",
      },
      published: true,
      community: { connect: { id: "community-id-1" } }, // Replace with an existing community ID
      author: { connect: { id: "user-id-1" } }, // Replace with an existing user ID
    },
    {
      title: "Another Interesting Post",
      content: {
        text: "Sharing some more thoughts here...",
      },
      published: false,
      community: { connect: { id: "community-id-2" } }, // Replace with an existing community ID
      author: { connect: { id: "user-id-2" } }, // Replace with an existing user ID
    },
  ];

  // Create Users
  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // Create Posts with relationships
  for (const post of posts) {
    await prisma.post.create({
      data: {
        ...post,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
