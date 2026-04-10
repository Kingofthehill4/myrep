import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sceneInputSchema } from "@/lib/types";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = sceneInputSchema.parse(await request.json());
  const { dialogueLines, sceneCharacterIds, ...sceneData } = payload;

  const item = await prisma.scene.update({
    where: { id },
    data: {
      ...sceneData,
      dialogueLines: {
        deleteMany: {},
        create: dialogueLines.map((d) => ({ ...d, characterId: d.characterId ?? null })),
      },
      sceneCharacters: {
        deleteMany: {},
        create: sceneCharacterIds.map((characterId) => ({ characterId })),
      },
    },
    include: { dialogueLines: true, sceneCharacters: true },
  });
  return NextResponse.json(item);
}
