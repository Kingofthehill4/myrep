import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { AudioBedProvider, ClipComposer, ClipExporter, LipSyncProvider, VisualGenerationProvider, VoiceGenerationProvider } from "./interfaces";
import { ComposedClip, ExportResult, SceneGenerationPayload, VisualAsset, VoiceAsset } from "../types";

const storageRoot = path.join(process.cwd(), "storage");

async function writeMockFile(relativePath: string, contents: string) {
  const fullPath = path.join(storageRoot, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, contents, "utf8");
  return `storage/${relativePath}`;
}

export class MockVisualGenerationProvider implements VisualGenerationProvider {
  async generateVisual(scenePayload: SceneGenerationPayload): Promise<VisualAsset> {
    const assetId = randomUUID();
    const filePath = await writeMockFile(`clips/${assetId}.json`, JSON.stringify({ kind: "visual", scenePayload }, null, 2));
    return { assetId, path: filePath, duration: scenePayload.durationTargetSeconds, metadata: { provider: "mock-visual-v1", promptSeed: scenePayload.mood } };
  }
}

export class MockVoiceGenerationProvider implements VoiceGenerationProvider {
  async generateVoice(scenePayload: SceneGenerationPayload): Promise<VoiceAsset> {
    const assetId = randomUUID();
    const filePath = await writeMockFile(`audio/${assetId}.json`, JSON.stringify({ kind: "voice", lines: scenePayload.dialogue }, null, 2));
    return { assetId, path: filePath, metadata: { provider: "mock-voice-v1", lineCount: scenePayload.dialogue.length } };
  }
}

export class MockLipSyncProvider implements LipSyncProvider {
  async generateLipSync(videoAsset: VisualAsset, voiceAsset: VoiceAsset) {
    const assetId = randomUUID();
    const filePath = await writeMockFile(`clips/${assetId}-lipsync.json`, JSON.stringify({ kind: "lip-sync", videoAsset, voiceAsset }, null, 2));
    return { assetId, path: filePath, metadata: { provider: "mock-lipsync-v1" } };
  }
}

export class MockAudioBedProvider implements AudioBedProvider {
  async generateAudioBed(audioNotes: string) {
    const assetId = randomUUID();
    const filePath = await writeMockFile(`audio/${assetId}-bed.json`, JSON.stringify({ kind: "audio-bed", audioNotes }, null, 2));
    return { assetId, path: filePath, metadata: { provider: "mock-bed-v1" } };
  }
}

export class MockClipComposer implements ClipComposer {
  async composeClip(assets: { visual: VisualAsset; voice: VoiceAsset; lipSync: { path: string }; audioBed: { path: string } }, timelineOptions: { targetDuration: number; mood: string }): Promise<ComposedClip> {
    const compositionId = randomUUID();
    const clipPath = await writeMockFile(`clips/${compositionId}-composed.json`, JSON.stringify({ kind: "composition", assets, timelineOptions }, null, 2));
    const transcriptPath = await writeMockFile(`clips/${compositionId}-transcript.srt`, `1\n00:00:00,000 --> 00:00:04,000\nMood: ${timelineOptions.mood}\n`);
    return { compositionId, clipPath, transcriptPath, metadata: { provider: "mock-composer-v1" } };
  }
}

export class MockExporter implements ClipExporter {
  async exportClip(compositionId: string): Promise<ExportResult> {
    const exportId = randomUUID();
    const exportPath = await writeMockFile(`exports/${exportId}.json`, JSON.stringify({ kind: "export", compositionId }, null, 2));
    return { exportId, exportPath, metadata: { provider: "mock-export-v1" } };
  }
}
