import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const statuses = ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"] as const;

type JobStatus = (typeof statuses)[number];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status = statusParam && statuses.includes(statusParam as JobStatus) ? (statusParam as JobStatus) : undefined;
  const items = await prisma.generationJob.findMany({ where: { status }, include: { scene: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}
