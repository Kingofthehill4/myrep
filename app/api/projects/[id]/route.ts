import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { projectInputSchema } from "@/lib/types";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.project.findUnique({ where: { id } });
  return NextResponse.json(item);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = projectInputSchema.partial().parse(await request.json());
  const item = await prisma.project.update({ where: { id }, data: payload });
  return NextResponse.json(item);
}
