import { z } from "zod";

export const dialogueLineSchema = z.object({
  id: z.string().optional(),
  characterId: z.string().nullable().optional(),
  speakerName: z.string().min(1),
  lineText: z.string().min(1),
  emotion: z.string().default("neutral"),
  sortOrder: z.number().int().nonnegative(),
});

export const sceneInputSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  orderIndex: z.number().int().nonnegative(),
  durationTargetSeconds: z.number().int().positive(),
  location: z.string().min(1),
  mood: z.string().min(1),
  cameraNotes: z.string().min(1),
  audioNotes: z.string().min(1),
  visualStyle: z.string().min(1),
  status: z.enum(["DRAFT", "READY", "GENERATING", "GENERATED", "FAILED"]).default("DRAFT"),
  sceneCharacterIds: z.array(z.string()).default([]),
  dialogueLines: z.array(dialogueLineSchema).default([]),
});

export const projectInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["MOVIE", "SERIES", "SHORT"]),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).default("DRAFT"),
});

export const characterInputSchema = z.object({
  projectId: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  appearancePrompt: z.string().min(1),
  personalityNotes: z.string().min(1),
  voiceProfile: z.string().min(1),
  referenceImagePath: z.string().min(1),
  stylePreset: z.string().min(1),
});

export const assemblyInputSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(["DRAFT", "READY", "EXPORTED"]).default("DRAFT"),
  timelineJson: z.string().min(2),
});

export type SceneInput = z.infer<typeof sceneInputSchema>;
