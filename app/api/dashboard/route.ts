import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [projects, scenes, jobs, media] = await Promise.all([
    prisma.project.count(),
    prisma.scene.count(),
    prisma.generationJob.count(),
    prisma.mediaAsset.count(),
  ]);
  return NextResponse.json({ projects, scenes, jobs, media });
}
