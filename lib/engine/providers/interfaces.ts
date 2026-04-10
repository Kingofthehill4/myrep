import { AudioBedAsset, ComposedClip, ExportResult, LipSyncAsset, SceneGenerationPayload, VisualAsset, VoiceAsset } from "../types";

export interface VisualGenerationProvider {
  generateVisual(scenePayload: SceneGenerationPayload): Promise<VisualAsset>;
}

export interface VoiceGenerationProvider {
  generateVoice(scenePayload: SceneGenerationPayload): Promise<VoiceAsset>;
}

export interface LipSyncProvider {
  generateLipSync(videoAsset: VisualAsset, voiceAsset: VoiceAsset): Promise<LipSyncAsset>;
}

export interface AudioBedProvider {
  generateAudioBed(audioNotes: string): Promise<AudioBedAsset>;
}

export interface ClipComposer {
  composeClip(
    assets: { visual: VisualAsset; voice: VoiceAsset; lipSync: LipSyncAsset; audioBed: AudioBedAsset },
    timelineOptions: { targetDuration: number; mood: string },
  ): Promise<ComposedClip>;
}

export interface ClipExporter {
  exportClip(compositionId: string): Promise<ExportResult>;
}
