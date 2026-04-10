import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const assetTypes = ["VIDEO_CLIP", "AUDIO_TRACK", "SUBTITLE", "IMAGE", "EXPORT"] as const;
type AssetType = (typeof assetTypes)[number];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") ?? undefined;
  const typeParam = searchParams.get("type");
  const type = typeParam && assetTypes.includes(typeParam as AssetType) ? (typeParam as AssetType) : undefined;
  const items = await prisma.mediaAsset.findMany({ where: { projectId, type }, include: { project: true, scene: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}
