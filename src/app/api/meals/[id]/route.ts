import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { meals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await db
    .select()
    .from(meals)
    .where(eq(meals.id, Number(id)))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: "Meal not found" }, { status: 404 });
  }

  const result = await db
    .update(meals)
    .set(body)
    .where(eq(meals.id, Number(id)))
    .returning();

  return NextResponse.json(result[0]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await db
    .select()
    .from(meals)
    .where(eq(meals.id, Number(id)))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: "Meal not found" }, { status: 404 });
  }

  await db.delete(meals).where(eq(meals.id, Number(id)));

  return NextResponse.json({ success: true });
}
