import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sceneInputSchema } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") ?? undefined;
  const items = await prisma.scene.findMany({ where: { projectId }, include: { dialogueLines: true, sceneCharacters: true }, orderBy: { orderIndex: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const payload = sceneInputSchema.parse(await request.json());
  const { dialogueLines, sceneCharacterIds, ...sceneData } = payload;
  const item = await prisma.scene.create({
    data: {
      ...sceneData,
      dialogueLines: { create: dialogueLines.map((d) => ({ ...d, characterId: d.characterId ?? null })) },
      sceneCharacters: { create: sceneCharacterIds.map((characterId) => ({ characterId })) },
    },
    include: { dialogueLines: true, sceneCharacters: true },
  });
  return NextResponse.json(item);
}
