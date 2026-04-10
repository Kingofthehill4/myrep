import { prisma } from "./prisma";
import { SceneGenerationPayload } from "./engine/types";

export async function buildScenePayload(sceneId: string): Promise<SceneGenerationPayload> {
  const scene = await prisma.scene.findUnique({
    where: { id: sceneId },
    include: {
      sceneCharacters: { include: { character: true } },
      dialogueLines: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!scene) throw new Error("Scene not found");

  return {
    sceneId: scene.id,
    projectId: scene.projectId,
    title: scene.title,
    location: scene.location,
    mood: scene.mood,
    durationTargetSeconds: scene.durationTargetSeconds,
    visualStyle: scene.visualStyle,
    cameraNotes: scene.cameraNotes,
    audioNotes: scene.audioNotes,
    characters: scene.sceneCharacters.map((link) => ({
      id: link.character.id,
      name: link.character.name,
      appearancePrompt: link.character.appearancePrompt,
      voiceProfile: link.character.voiceProfile,
      stylePreset: link.character.stylePreset,
    })),
    dialogue: scene.dialogueLines.map((line) => ({
      speakerName: line.speakerName,
      lineText: line.lineText,
      emotion: line.emotion,
    })),
  };
}
