import "dotenv/config";
import { parse } from "csv-parse/sync";
import fs from "fs";
import { db } from "@/db";
import { meals, mealSlots, familyMembers } from "@/db/schema";

const MONTHS: Record<string, number> = {
  Jan: 1, Januari: 1,
  Feb: 2, Februari: 2,
  Mar: 3, Maret: 3,
  Apr: 4, April: 4,
  Mei: 5, Mei: 5,
  Jun: 6, Juni: 6,
  Jul: 7, Juli: 7,
  Agu: 8, Agustus: 8,
  Sep: 9, September: 9,
  Okt: 10, Oktober: 10,
  Nov: 11, November: 11,
  Des: 12, Desember: 12, Dec: 12,
};
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const LEET: Record<string, string> = {
  "4": "A", "3": "E", "6": "G", "1": "I", "0": "O", "5": "S",
};

function decode(text: string): string {
  return text.split("").map((c) => LEET[c.toUpperCase()] ?? c).join("");
}

function normalize(code: string): string {
  return decode(code.trim());
}

function parseDateCell(cell: string, year: number): string | null {
  if (!cell || !cell.trim()) return null;
  const parts = cell.trim().split(/\s+/);
  if (parts.length < 3) return null;
  if (!DAYS.includes(parts[0])) return null;

  const day = parseInt(parts[1], 10);
  const month = MONTHS[parts[2]];
  if (isNaN(day) || !month) return null;

  const d = new Date(year, month - 1, day);
  if (isNaN(d.getTime())) return null;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function extractEntries(text: string): Array<{ name: string; members: string[]; activities: string[] }> {
  if (!text || !text.trim()) return [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const entries: Array<{ name: string; members: string[]; activities: string[] }> = [];
  let buffer: string[] = [];

  function flush() {
    if (buffer.length === 0) return;
    const combined = buffer.join(" ");
    const acts: string[] = [];
    const noActs = combined.replace(/\[\[\s*([^\]]+)\s*\]\]/g, (_m: string, a: string) => {
      acts.push(a.trim());
      return "";
    }).trim();
    const parenMatch = noActs.match(/\(([^)]+)\)/);
    let name = noActs;
    let members: string[] = [];
    if (parenMatch) {
      name = noActs.replace(/\([^)]+\)/g, "").trim();
      members = parenMatch[1].replace(/&/g, ",").split(/[,/]+/).map((c: string) => normalize(c.trim())).filter(Boolean);
    }
    if (name) {
      entries.push({ name, members, activities: acts });
    }
    buffer = [];
  }

  for (const line of lines) {
    if (line.startsWith("[[")) {
      flush();
      const match = line.match(/\[\[\s*([^\]]+)\s*\]\]/);
      if (match && entries.length > 0) entries[entries.length - 1].activities.push(match[1].trim());
      continue;
    }
    buffer.push(line);
  }
  flush();
  return entries;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) { console.error("Usage: tsx src/scripts/import-csv.ts <path>"); process.exit(1); }

  const raw = fs.readFileSync(csvPath, "utf-8");
  const records = parse(raw, { relaxColumnCount: true, skip_empty_lines: false }) as string[][];

  const members = await db.select().from(familyMembers);
  const knownCodes = new Set(members.map((m) => m.code));
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
