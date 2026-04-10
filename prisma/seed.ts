import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.mediaAsset.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.sceneDialogueLine.deleteMany();
  await prisma.sceneCharacter.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.character.deleteMany();
  await prisma.episodeAssembly.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({ data: { email: "owner@amycore.local", role: "OWNER" } });

  const project = await prisma.project.create({
    data: {
      title: "Neon Velvet Casefiles",
      slug: "neon-velvet-casefiles",
      description: "Noir detective anthology built for KSM and YouTube.",
      type: "SERIES",
      status: "ACTIVE",
    },
  });

  const [characterA, characterB] = await Promise.all([
    prisma.character.create({
      data: {
        projectId: project.id,
        name: "Detective Mara Quinn",
        slug: "mara-quinn",
        description: "A relentless detective with cybernetic intuition.",
        appearancePrompt: "Trench coat, neon reflections, tired but sharp eyes.",
        personalityNotes: "Precise, stubborn, dry humor under pressure.",
        voiceProfile: "husky-mid-female",
        referenceImagePath: "storage/reference/mara.png",
        stylePreset: "neo-noir-high-contrast",
      },
    }),
    prisma.character.create({
      data: {
        projectId: project.id,
        name: "Silas Vex",
        slug: "silas-vex",
        description: "Fixer with polished lies and perfect timing.",
        appearancePrompt: "Black suit, silver tie pin, always in half-shadow.",
        personalityNotes: "Charming, evasive, manipulative.",
        voiceProfile: "smooth-baritone",
        referenceImagePath: "storage/reference/silas.png",
        stylePreset: "neo-noir-smoke",
      },
    }),
  ]);

  const scene1 = await prisma.scene.create({ data: { projectId: project.id, title: "Rooftop Exchange", orderIndex: 1, durationTargetSeconds: 35, location: "Rain-soaked downtown rooftop", mood: "tense", cameraNotes: "Slow dolly-in, hard rim light.", audioNotes: "Distant sirens, rain hiss, low bass pulse.", visualStyle: "stylized neo-noir", status: "GENERATED" } });
  const scene2 = await prisma.scene.create({ data: { projectId: project.id, title: "Interrogation Booth", orderIndex: 2, durationTargetSeconds: 28, location: "Neon-lit diner booth", mood: "suspicious", cameraNotes: "Alternating over-shoulder shots.", audioNotes: "Muffled jukebox ambience.", visualStyle: "gritty noir realism", status: "READY" } });
  const scene3 = await prisma.scene.create({ data: { projectId: project.id, title: "Tunnel Reveal", orderIndex: 3, durationTargetSeconds: 42, location: "Subway maintenance tunnel", mood: "ominous", cameraNotes: "Handheld sway, close-up reveals.", audioNotes: "Dripping water, metallic echoes.", visualStyle: "cold desaturated noir", status: "DRAFT" } });

  for (const scene of [scene1, scene2, scene3]) {
    await prisma.sceneCharacter.createMany({ data: [{ sceneId: scene.id, characterId: characterA.id }, { sceneId: scene.id, characterId: characterB.id }] });
  }

  await prisma.sceneDialogueLine.createMany({
    data: [
      { sceneId: scene1.id, characterId: characterA.id, speakerName: characterA.name, lineText: "Drop the drive, Silas. End of road.", emotion: "firm", sortOrder: 0 },
      { sceneId: scene1.id, characterId: characterB.id, speakerName: characterB.name, lineText: "Roads only end for people who run out of options.", emotion: "cool", sortOrder: 1 },
      { sceneId: scene2.id, characterId: characterA.id, speakerName: characterA.name, lineText: "Who paid you to wipe the footage?", emotion: "controlled anger", sortOrder: 0 },
      { sceneId: scene2.id, characterId: characterB.id, speakerName: characterB.name, lineText: "Ask the shadows. They sign all the checks.", emotion: "taunting", sortOrder: 1 },
    ],
  });

  const job = await prisma.generationJob.create({
    data: {
      projectId: project.id,
      sceneId: scene1.id,
      type: "SCENE_CLIP",
      status: "COMPLETED",
      provider: "amycore-video-mock",
      inputJson: JSON.stringify({ seed: true }),
      outputJson: JSON.stringify({ clip: "storage/clips/mock-scene1.json" }),
      startedAt: new Date(),
      completedAt: new Date(),
    },
  });

  await prisma.mediaAsset.create({
    data: {
      projectId: project.id,
      sceneId: scene1.id,
      type: "VIDEO_CLIP",
      path: "storage/clips/mock-scene1.json",
      mimeType: "application/json",
      metadataJson: JSON.stringify({ sourceJobId: job.id, duration: 35 }),
    },
  });

  await prisma.episodeAssembly.create({
    data: {
      projectId: project.id,
      title: "Episode 01 Rough Cut",
      description: "Initial noir assembly timeline",
      timelineJson: JSON.stringify([{ order: 1, sceneId: scene1.id, assetPath: "storage/clips/mock-scene1.json" }]),
      status: "DRAFT",
    },
  });
}

main().finally(async () => prisma.$disconnect());
