import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildScenePayload } from "@/lib/api";
import { GenerationOrchestrator } from "@/lib/engine/services";

export async function POST(request: Request) {
  const body = await request.json();
  const sceneId = body.sceneId as string;
  const payload = await buildScenePayload(sceneId);

  const job = await prisma.generationJob.create({
    data: {
      projectId: payload.projectId,
      sceneId: payload.sceneId,
      type: "SCENE_CLIP",
      status: "QUEUED",
      provider: "amycore-video-mock",
      inputJson: JSON.stringify(payload),
    },
  });

  await prisma.scene.update({ where: { id: sceneId }, data: { status: "GENERATING" } });
  await new GenerationOrchestrator().run(job.id, payload);

  return NextResponse.json({ jobId: job.id, status: "started" });
}
