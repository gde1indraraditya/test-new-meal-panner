import "dotenv/config";
import { parse } from "csv-parse/sync";
import fs from "fs";
import { db } from "@/db";
import { meals, mealSlots, familyMembers } from "@/db/schema";
import { MONTHS, parseDateCell, extractEntries } from "@/lib/csv-utils";

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) { console.error("Usage: tsx src/scripts/import-csv.ts <path>"); process.exit(1); }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const records = parse(raw, { relaxColumnCount: true, skip_empty_lines: false }) as string[][];

  const slots = await db.select().from(mealSlots);
  const siangId = slots.find((s) => s.name === "Siang")!.id;
  const malamId = slots.find((s) => s.name === "Malam")!.id;
  const anytimeId = slots.find((s) => s.name === "Anytime")!.id;

  const dataRows = records.slice(5);
  let total = 0;
  let skipped = 0;
  let currentYear = 2024;
  let prevMonth = 11;

  for (const row of dataRows) {
    const b = (row[1] ?? "").trim();
    const e = (row[4] ?? "").trim();
    if (!b && !e) { skipped++; continue; }

    if (b) {
      const parts = b.split(/\s+/);
      if (parts.length >= 3) {
        const month = MONTHS[parts[2]];
        if (month !== undefined) {
          if (month < prevMonth && prevMonth === 12) currentYear++;
          prevMonth = month;
        }
      }
    }

    const siangDate = parseDateCell(b, currentYear);
    if (!siangDate) { skipped++; continue; }

    // Siang
    for (const entry of extractEntries(row[2] ?? "")) {
      await db.insert(meals).values({ date: siangDate, mealSlotId: siangId, menuName: entry.name, assignedMembers: entry.members.length > 0 ? entry.members : null, activities: entry.activities.length > 0 ? entry.activities : null, notes: (row[3] ?? "").trim() || null });
      total++;
    }

    // Malam
    const malamDate = parseDateCell(e, currentYear) || siangDate;
    for (const entry of extractEntries(row[5] ?? "")) {
      await db.insert(meals).values({ date: malamDate, mealSlotId: malamId, menuName: entry.name, assignedMembers: entry.members.length > 0 ? entry.members : null, activities: entry.activities.length > 0 ? entry.activities : null, notes: (row[6] ?? "").trim() || null });
      total++;
    }

    // Anytime
    for (let ci = 7; ci <= 13; ci++) {
      const cell = row[ci]?.trim();
      if (!cell) continue;
      for (const entry of extractEntries(cell)) {
        await db.insert(meals).values({ date: siangDate, mealSlotId: anytimeId, menuName: entry.name, assignedMembers: entry.members.length > 0 ? entry.members : null, activities: entry.activities.length > 0 ? entry.activities : null });
        total++;
      }
    }
  }

  console.log(`\nDone! ${total} meals, ${skipped} skipped, final year=${currentYear}`);
}

main().catch(console.error);
