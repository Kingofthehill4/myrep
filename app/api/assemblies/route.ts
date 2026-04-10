import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assemblyInputSchema } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") ?? undefined;
  const items = await prisma.episodeAssembly.findMany({ where: { projectId }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const payload = assemblyInputSchema.parse(await request.json());
  const item = await prisma.episodeAssembly.create({ data: payload });
  return NextResponse.json(item);
}
