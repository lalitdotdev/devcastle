import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const jobCategories = [
  // Technology
  { name: "Software Development" },
  { name: "Data Science" },
  { name: "DevOps" },
  { name: "Cloud Computing" },
  { name: "Cybersecurity" },
  { name: "Artificial Intelligence" },
  { name: "Machine Learning" },

  // Business
  { name: "Marketing" },
  { name: "Sales" },
  { name: "Business Development" },
  { name: "Project Management" },
  { name: "Product Management" },
  { name: "Finance" },
  { name: "Human Resources" },

  // Creative
  { name: "Design" },
  { name: "Content Creation" },
  { name: "UX/UI Design" },
  { name: "Video Production" },

  // Healthcare
  { name: "Healthcare" },
  { name: "Biotechnology" },
  { name: "Pharmaceuticals" },

  // Engineering
  { name: "Mechanical Engineering" },
  { name: "Electrical Engineering" },
  { name: "Civil Engineering" },

  // Others
  { name: "Education" },
  { name: "Customer Service" },
  { name: "Consulting" },
  { name: "Legal" },
  { name: "Operations" },
];

async function recoverAndMigrateData() {
  try {
    console.log("Starting data recovery and migration...");

    // 1. Get all data from the category table
    const existingCategories = await prisma.category.findMany();
    console.log(`Found ${existingCategories.length} categories to migrate`);

    // 2. Move data to jobCategory table
    for (const category of existingCategories) {
      await prisma.jobCategory
        .create({
          data: {
            name: category.name,
          },
        })
        .catch((e) => {
          if (e.code === "P2002") {
            // Unique constraint error
            console.log(
              `Category "${category.name}" already exists in JobCategory table`,
            );
          } else {
            throw e;
          }
        });
    }

    // 3. Seed any missing categories from our full list
    const result = await prisma.jobCategory.createMany({
      data: jobCategories,
      skipDuplicates: true,
    });

    console.log(`Added ${result.count} new categories`);

    // 4. Verify final state
    const allJobCategories = await prisma.jobCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    console.log("\nAll job categories in database:");
    allJobCategories.forEach((category) => {
      console.log(`- ${category.name} (ID: ${category.id})`);
    });

    // Optional: If you want to cleanup the old category table
    // Uncomment the following lines if you're sure you want to delete the old data
    /*
    const deleteResult = await prisma.category.deleteMany()
    console.log(`Deleted ${deleteResult.count} records from old category table`)
    */
  } catch (error) {
    console.error("Error during recovery and migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

recoverAndMigrateData().catch((error) => {
  console.error(error);
  process.exit(1);
});
