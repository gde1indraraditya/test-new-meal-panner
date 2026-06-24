import { describe, it, expect } from "vitest";
import { formatDate, formatDisplay, getWeekRange, getDaysOfWeek, getWeekNumber } from "../dates";

describe("formatDate", () => {
  it("formats date as YYYY-MM-DD", () => {
    expect(formatDate(new Date(2024, 10, 7))).toBe("2024-11-07");
  });

  it("zero-pads month and day", () => {
    expect(formatDate(new Date(2025, 0, 1))).toBe("2025-01-01");
  });

  it("handles end of year", () => {
    expect(formatDate(new Date(2024, 11, 31))).toBe("2024-12-31");
  });
});

describe("formatDisplay", () => {
  it("shows Indonesian day, date, and month", () => {
    const d = new Date(2024, 10, 7);
    expect(formatDisplay(d)).toBe("Kamis, 7 Nov");
  });

  it("shows correct day name", () => {
    expect(formatDisplay(new Date(2024, 10, 4))).toBe("Senin, 4 Nov");
    expect(formatDisplay(new Date(2024, 10, 10))).toBe("Minggu, 10 Nov");
  });
});

describe("getWeekRange", () => {
  it("returns Monday to Sunday for a Wednesday", () => {
    const wed = new Date(2024, 10, 6);
    const { startDate, endDate } = getWeekRange(wed);
    expect(startDate.getDay()).toBe(1);
    expect(formatDate(startDate)).toBe("2024-11-04");
    expect(endDate.getDay()).toBe(0);
    expect(formatDate(endDate)).toBe("2024-11-10");
  });

  it("handles Sunday correctly (previous Monday)", () => {
    const sun = new Date(2024, 10, 10);
    const { startDate } = getWeekRange(sun);
    expect(formatDate(startDate)).toBe("2024-11-04");
  });

  it("handles Monday correctly", () => {
    const mon = new Date(2024, 10, 4);
    const { startDate } = getWeekRange(mon);
    expect(formatDate(startDate)).toBe("2024-11-04");
  });
});

describe("getDaysOfWeek", () => {
  it("returns 7 days starting from Monday", () => {
    const mon = new Date(2024, 10, 4);
    const days = getDaysOfWeek(mon);
    expect(days).toHaveLength(7);
    expect(formatDate(days[0])).toBe("2024-11-04");
    expect(formatDate(days[6])).toBe("2024-11-10");
  });

  it("each day increments by 1", () => {
    const mon = new Date(2024, 10, 4);
    const days = getDaysOfWeek(mon);
    for (let i = 1; i < days.length; i++) {
      const diff = (days[i].getTime() - days[i - 1].getTime()) / 86400000;
      expect(diff).toBe(1);
    }
  });
});

describe("getWeekNumber", () => {
  it("returns correct ISO week number", () => {
    expect(getWeekNumber(new Date(2024, 0, 1))).toBe(1);
    expect(getWeekNumber(new Date(2024, 11, 31))).toBe(1);
  });
});
