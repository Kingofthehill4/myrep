import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { characterInputSchema } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") ?? undefined;
  const items = await prisma.character.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const payload = characterInputSchema.parse(await request.json());
  const item = await prisma.character.create({ data: payload });
  return NextResponse.json(item);
}
