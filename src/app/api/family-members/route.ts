import { NextResponse } from "next/server";
import { db } from "@/db";
import { familyMembers } from "@/db/schema";

export async function GET() {
  const result = await db
    .select()
    .from(familyMembers)
    .orderBy(familyMembers.id);

  return NextResponse.json(result);
}
