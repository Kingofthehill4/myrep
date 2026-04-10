export type SceneGenerationPayload = {
  sceneId: string;
  projectId: string;
  title: string;
  location: string;
  mood: string;
  durationTargetSeconds: number;
  visualStyle: string;
  cameraNotes: string;
  audioNotes: string;
  characters: Array<{ id: string; name: string; appearancePrompt: string; voiceProfile: string; stylePreset: string }>;
  dialogue: Array<{ speakerName: string; lineText: string; emotion: string }>;
};

export type VisualAsset = { assetId: string; path: string; duration: number; metadata: Record<string, unknown> };
export type VoiceAsset = { assetId: string; path: string; metadata: Record<string, unknown> };
export type LipSyncAsset = { assetId: string; path: string; metadata: Record<string, unknown> };
export type AudioBedAsset = { assetId: string; path: string; metadata: Record<string, unknown> };
export type ComposedClip = { compositionId: string; clipPath: string; transcriptPath: string; metadata: Record<string, unknown> };
export type ExportResult = { exportId: string; exportPath: string; metadata: Record<string, unknown> };
