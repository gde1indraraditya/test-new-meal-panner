import "dotenv/config";
import { db } from "./index";
import { familyMembers, mealSlots } from "./schema";

async function seed() {
  console.log("Seeding family members...");
  await db.insert(familyMembers).values([
    { name: "AA", code: "AA", emoji: "👶" },
    { name: "Wayah", code: "Wayah", emoji: "👴" },
    { name: "Dika", code: "Dika", emoji: "🧑" },
    { name: "Cici", code: "Cici", emoji: "👩" },
    { name: "Papa", code: "Papa", emoji: "👨" },
    { name: "Mama", code: "Mama", emoji: "👩‍👧" },
    { name: "Semua", code: "Semua", emoji: "👨‍👩‍👧‍👦" },
  ]);

  console.log("Seeding meal slots...");
  await db.insert(mealSlots).values([
    { name: "Siang", icon: "☀️", sortOrder: 1 },
    { name: "Malam", icon: "🌙", sortOrder: 2 },
    { name: "Anytime", icon: "🕐", sortOrder: 3 },
  ]);

  console.log("Seed complete!");
}

seed().catch(console.error);
