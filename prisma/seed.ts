import { PrismaClient, Role, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "india", name: "India", nameHi: "भारत" },
  { slug: "world", name: "World", nameHi: "विश्व" },
  { slug: "politics", name: "Politics", nameHi: "राजनीति" },
  { slug: "business", name: "Business", nameHi: "व्यापार" },
  { slug: "technology", name: "Technology", nameHi: "तकनीक" },
  { slug: "sports", name: "Sports", nameHi: "खेल" },
  { slug: "entertainment", name: "Entertainment", nameHi: "मनोरंजन" },
  { slug: "health", name: "Health", nameHi: "स्वास्थ्य" },
  { slug: "explainers", name: "Explainers", nameHi: "व्याख्या" },
];

async function main() {
  console.log("Seeding categories…");
  for (const c of CATEGORIES) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  console.log("Seeding an editorial admin user…");
  const admin = await prisma.user.upsert({
    where: { email: "editor@azeelnews.com" },
    update: {},
    create: {
      name: "Arjun Kapoor",
      email: "editor@azeelnews.com",
      role: Role.EDITOR,
      // Real accounts hash passwords at signup via the auth API — this is
      // seed-only placeholder data, never a real credential.
      passwordHash: null,
    },
  });

  const politics = await prisma.category.findUniqueOrThrow({ where: { slug: "politics" } });

  console.log("Seeding a sample post…");
  await prisma.post.upsert({
    where: { slug: "parliament-passes-digital-governance-bill" },
    update: {},
    create: {
      slug: "parliament-passes-digital-governance-bill",
      headline: "Parliament Clears Digital Governance Bill After 14-Hour Debate",
      dek: "The bill establishes a unified data-protection authority and sets new compliance timelines for public and private platforms.",
      body: "The bill passed in a late-night sitting after members from both sides of the aisle pressed for changes to the enforcement timeline.\n\nAt the center of the legislation is a new statutory authority tasked with overseeing how companies collect, store, and share personal data.",
      status: PostStatus.PUBLISHED,
      featuredImageUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&h=800&fit=crop",
      featuredImageAlt: "Parliament House exterior at dusk",
      readingTimeMin: 6,
      isBreaking: true,
      views: 184000,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: politics.id,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
