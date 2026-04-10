import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectInputSchema } from "@/lib/types";

export async function GET() {
  const items = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const payload = projectInputSchema.parse(await request.json());
  const item = await prisma.project.create({ data: payload });
  return NextResponse.json(item);
}
