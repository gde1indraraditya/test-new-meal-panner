const LEET: Record<string, string> = {
  "4": "A", "3": "E", "6": "G", "1": "I", "0": "O", "5": "S",
};

export function decode(text: string): string {
  return text.toUpperCase().split("").map((c) => LEET[c] ?? c).join("");
}

export function normalize(code: string): string {
  return decode(code.trim());
}

export const MONTHS: Record<string, number> = {
  Jan: 1, Januari: 1,
  Feb: 2, Februari: 2,
  Mar: 3, Maret: 3,
  Apr: 4, April: 4,
  Mei: 5, Juni: 6, Jun: 6,
  Jul: 7, Juli: 7,
  Agu: 8, Agustus: 8,
  Sep: 9, September: 9,
  Okt: 10, Oktober: 10,
  Nov: 11, November: 11,
  Des: 12, Desember: 12, Dec: 12,
};

export const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function parseDateCell(cell: string, year: number): string | null {
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

export function extractEntries(text: string): Array<{ name: string; members: string[]; activities: string[] }> {
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
