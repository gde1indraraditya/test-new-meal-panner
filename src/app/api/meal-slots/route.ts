import { NextResponse } from "next/server";
import { db } from "@/db";
import { mealSlots } from "@/db/schema";

export async function GET() {
  const result = await db
    .select()
    .from(mealSlots)
    .orderBy(mealSlots.sortOrder);

  return NextResponse.json(result);
}
