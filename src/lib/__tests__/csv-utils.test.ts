import { describe, it, expect } from "vitest";
import { decode, normalize, parseDateCell, extractEntries, MONTHS } from "../csv-utils";

describe("decode", () => {
  it("decodes leetspeak digits to uppercase", () => {
    expect(decode("D1k4")).toBe("DIKA");
    expect(decode("C1c1")).toBe("CICI");
  });

  it("handles already uppercase", () => {
    expect(decode("P4P4")).toBe("PAPA");
  });

  it("passes through normal text uppercased", () => {
    expect(decode("AA")).toBe("AA");
    expect(decode("Mama")).toBe("MAMA");
  });
});

describe("normalize", () => {
  it("trims and decodes to uppercase", () => {
    expect(normalize(" D1k4 ")).toBe("DIKA");
  });
});

describe("MONTHS", () => {
  it("maps Indonesian abbreviated months", () => {
    expect(MONTHS["Jan"]).toBe(1);
    expect(MONTHS["Feb"]).toBe(2);
    expect(MONTHS["Mar"]).toBe(3);
    expect(MONTHS["Apr"]).toBe(4);
    expect(MONTHS["Mei"]).toBe(5);
    expect(MONTHS["Jun"]).toBe(6);
    expect(MONTHS["Jul"]).toBe(7);
    expect(MONTHS["Agu"]).toBe(8);
    expect(MONTHS["Sep"]).toBe(9);
    expect(MONTHS["Okt"]).toBe(10);
    expect(MONTHS["Nov"]).toBe(11);
    expect(MONTHS["Des"]).toBe(12);
  });

  it("maps English abbreviated months", () => {
    expect(MONTHS["Dec"]).toBe(12);
  });

  it("maps full Indonesian month names", () => {
    expect(MONTHS["Januari"]).toBe(1);
    expect(MONTHS["Desember"]).toBe(12);
    expect(MONTHS["November"]).toBe(11);
  });
});

describe("parseDateCell", () => {
  it("parses a valid date cell", () => {
    expect(parseDateCell("Kamis 7 Nov", 2024)).toBe("2024-11-07");
  });

  it("handles full month names", () => {
    expect(parseDateCell("Rabu 1 Januari", 2025)).toBe("2025-01-01");
    expect(parseDateCell("Senin 1 Desember", 2025)).toBe("2025-12-01");
  });

  it("returns null for empty cell", () => {
    expect(parseDateCell("", 2024)).toBeNull();
    expect(parseDateCell("   ", 2024)).toBeNull();
  });

  it("returns null for invalid day name", () => {
    expect(parseDateCell("Foo 7 Nov", 2024)).toBeNull();
  });

  it("returns null for invalid month", () => {
    expect(parseDateCell("Kamis 7 Foomonths", 2024)).toBeNull();
  });

  it("returns null for fewer than 3 parts", () => {
    expect(parseDateCell("Kamis 7", 2024)).toBeNull();
  });
});

describe("extractEntries", () => {
  it("extracts simple menu name", () => {
    const result = extractEntries("Nasi Goreng");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Nasi Goreng");
    expect(result[0].members).toEqual([]);
    expect(result[0].activities).toEqual([]);
  });

  it("extracts menu with assigned members", () => {
    const result = extractEntries("Nasi Goreng (AA, Dika)");
    expect(result[0].name).toBe("Nasi Goreng");
    expect(result[0].members).toEqual(["AA", "DIKA"]);
  });

  it("extracts multiple entries separated by annotations", () => {
    const result = extractEntries("Nasi Goreng (AA)\n[[break]]\nMie Ayam (Dika, Cici)");
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Nasi Goreng");
    expect(result[1].name).toBe("Mie Ayam");
  });

  it("extracts activities from annotations", () => {
    const result = extractEntries("Makan di luar [[AA Kantor]]");
    expect(result[0].name).toBe("Makan di luar");
    expect(result[0].activities).toEqual(["AA Kantor"]);
  });

  it("extracts standalone activity lines", () => {
    const result = extractEntries("Nasi Goreng (AA)\n[[AA Kantor]]\nMie Ayam\n[[Dika Les]]");
    expect(result).toHaveLength(2);
    expect(result[0].activities).toEqual(["AA Kantor"]);
    expect(result[1].activities).toEqual(["Dika Les"]);
  });

  it("returns empty array for empty text", () => {
    expect(extractEntries("")).toEqual([]);
    expect(extractEntries("   ")).toEqual([]);
  });

  it("decodes leetspeak in member codes", () => {
    const result = extractEntries("Nasi Goreng (D1k4, C1c1)");
    expect(result[0].members).toEqual(["DIKA", "CICI"]);
  });

  it("handles & separator in member list", () => {
    const result = extractEntries("Nasi Goreng (AA & Dika)");
    expect(result[0].members).toEqual(["AA", "DIKA"]);
  });

  it("handles / separator in member list", () => {
    const result = extractEntries("Nasi Goreng (AA/Dika)");
    expect(result[0].members).toEqual(["AA", "DIKA"]);
  });
});
