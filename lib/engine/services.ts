import { prisma } from "@/lib/prisma";
import { SceneGenerationPayload } from "./types";
import { MockAudioBedProvider, MockClipComposer, MockExporter, MockLipSyncProvider, MockVisualGenerationProvider, MockVoiceGenerationProvider } from "./providers/mockProviders";

export class SceneValidationService {
  validate(payload: SceneGenerationPayload) {
    if (!payload.characters.length) throw new Error("Scene requires at least one character.");
    if (!payload.dialogue.length) throw new Error("Scene requires at least one dialogue line.");
    if (!payload.location || !payload.mood) throw new Error("Scene location and mood are required.");
    return true;
  }
}

export class ScenePromptBuilderService {
  build(scene: SceneGenerationPayload) {
    return {
      visualPrompt: `${scene.visualStyle}; ${scene.location}; mood: ${scene.mood}; camera: ${scene.cameraNotes}`,
      voicePrompt: scene.dialogue.map((d) => `${d.speakerName} (${d.emotion}): ${d.lineText}`).join("\n"),
      ambiencePrompt: scene.audioNotes,
    };
  }
}

export class CharacterConsistencyService {
  enforce(scene: SceneGenerationPayload) {
    return {
      ...scene,
      characters: scene.characters.map((c) => ({ ...c, stylePreset: c.stylePreset || "studio-default" })),
    };
  }
}

export class JobStatusService {
  async setProcessing(jobId: string) {
    await prisma.generationJob.update({ where: { id: jobId }, data: { status: "PROCESSING", startedAt: new Date() } });
  }

  async setCompleted(jobId: string, outputJson: string) {
    await prisma.generationJob.update({ where: { id: jobId }, data: { status: "COMPLETED", outputJson, completedAt: new Date() } });
  }

  async setFailed(jobId: string, errorText: string) {
    await prisma.generationJob.update({ where: { id: jobId }, data: { status: "FAILED", errorText, completedAt: new Date() } });
  }
}

export class ExportService {
  private exporter = new MockExporter();

  async export(compositionId: string) {
    return this.exporter.exportClip(compositionId);
  }
}

export class ClipComposerService {
  private composer = new MockClipComposer();

  async compose(assets: Parameters<MockClipComposer["composeClip"]>[0], timelineOptions: Parameters<MockClipComposer["composeClip"]>[1]) {
    return this.composer.composeClip(assets, timelineOptions);
  }
}

export class GenerationOrchestrator {
  private validator = new SceneValidationService();
  private promptBuilder = new ScenePromptBuilderService();
  private consistency = new CharacterConsistencyService();
  private visualProvider = new MockVisualGenerationProvider();
  private voiceProvider = new MockVoiceGenerationProvider();
  private lipSyncProvider = new MockLipSyncProvider();
  private audioBedProvider = new MockAudioBedProvider();
  private composer = new ClipComposerService();
  private exportService = new ExportService();
  private statusService = new JobStatusService();

  async run(jobId: string, payload: SceneGenerationPayload) {
    try {
      await this.statusService.setProcessing(jobId);
      this.validator.validate(payload);
      const consistentPayload = this.consistency.enforce(payload);
      const prompts = this.promptBuilder.build(consistentPayload);

      const visual = await this.visualProvider.generateVisual(consistentPayload);
      const voice = await this.voiceProvider.generateVoice({ ...consistentPayload, audioNotes: prompts.voicePrompt });
      const lipSync = await this.lipSyncProvider.generateLipSync(visual, voice);
      const audioBed = await this.audioBedProvider.generateAudioBed(prompts.ambiencePrompt);
      const composed = await this.composer.compose({ visual, voice, lipSync, audioBed }, { targetDuration: payload.durationTargetSeconds, mood: payload.mood });
      const exported = await this.exportService.export(composed.compositionId);

      await prisma.mediaAsset.createMany({
        data: [
          { projectId: payload.projectId, sceneId: payload.sceneId, type: "VIDEO_CLIP", path: composed.clipPath, mimeType: "application/json", metadataJson: JSON.stringify(composed.metadata) },
          { projectId: payload.projectId, sceneId: payload.sceneId, type: "AUDIO_TRACK", path: voice.path, mimeType: "application/json", metadataJson: JSON.stringify(voice.metadata) },
          { projectId: payload.projectId, sceneId: payload.sceneId, type: "SUBTITLE", path: composed.transcriptPath, mimeType: "text/plain", metadataJson: JSON.stringify({ source: "mock" }) },
          { projectId: payload.projectId, sceneId: payload.sceneId, type: "EXPORT", path: exported.exportPath, mimeType: "application/json", metadataJson: JSON.stringify(exported.metadata) },
        ],
      });

      await prisma.scene.update({ where: { id: payload.sceneId }, data: { status: "GENERATED" } });
      await this.statusService.setCompleted(jobId, JSON.stringify({ prompts, visual, voice, lipSync, audioBed, composed, exported }));
    } catch (error) {
      await prisma.scene.update({ where: { id: payload.sceneId }, data: { status: "FAILED" } });
      await this.statusService.setFailed(jobId, error instanceof Error ? error.message : "Unknown generation error");
    }
  }
}
