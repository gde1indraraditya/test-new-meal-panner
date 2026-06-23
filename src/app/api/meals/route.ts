import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meals } from "@/db/schema";
import { and, gte, lte, desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const conditions = [];
  if (startDate) conditions.push(gte(meals.date, startDate));
  if (endDate) conditions.push(lte(meals.date, endDate));

  const result = await db
    .select()
    .from(meals)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(meals.date));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { date, mealSlotId, menuName, restaurantName, assignedMembers, activities, notes, rating } = body;

  if (!date || !mealSlotId || !menuName) {
    return NextResponse.json(
      { error: "date, mealSlotId, and menuName are required" },
      { status: 400 }
    );
  }

  const result = await db
    .insert(meals)
    .values({
      date,
      mealSlotId,
      menuName,
      restaurantName: restaurantName ?? null,
      assignedMembers: assignedMembers ?? null,
      activities: activities ?? null,
      notes: notes ?? null,
      rating: rating ?? null,
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
