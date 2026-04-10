"use client";

import { useMemo, useState } from "react";

type Character = { id: string; name: string };
type Dialogue = { speakerName: string; lineText: string; emotion: string; sortOrder: number; characterId?: string | null };
type SceneRecord = {
  id: string;
  title: string;
  orderIndex: number;
  durationTargetSeconds: number;
  location: string;
  mood: string;
  cameraNotes: string;
  audioNotes: string;
  visualStyle: string;
  status: string;
  sceneCharacters: Array<{ characterId: string }>;
  dialogueLines: Dialogue[];
};

export function SceneEditor({ projectId, scene, characters, onSaved }: { projectId: string; scene?: SceneRecord; characters: Character[]; onSaved: () => void }) {
  const [form, setForm] = useState({
    projectId,
    title: scene?.title ?? "",
    orderIndex: scene?.orderIndex ?? 0,
    durationTargetSeconds: scene?.durationTargetSeconds ?? 20,
    location: scene?.location ?? "",
    mood: scene?.mood ?? "",
    cameraNotes: scene?.cameraNotes ?? "",
    audioNotes: scene?.audioNotes ?? "",
    visualStyle: scene?.visualStyle ?? "",
    status: scene?.status ?? "DRAFT",
    sceneCharacterIds: scene?.sceneCharacters?.map((c) => c.characterId) ?? [],
    dialogueLines: scene?.dialogueLines ?? ([] as Dialogue[]),
  });

  const payloadPreview = useMemo(() => JSON.stringify(form, null, 2), [form]);

  const addLine = () => setForm({ ...form, dialogueLines: [...form.dialogueLines, { speakerName: "", lineText: "", emotion: "neutral", sortOrder: form.dialogueLines.length }] });

  async function save() {
    const url = scene ? `/api/scenes/${scene.id}` : "/api/scenes";
    const method = scene ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    onSaved();
  }

  async function generate() {
    if (!scene?.id) return;
    await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sceneId: scene.id }) });
    onSaved();
  }

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 bg-slate-900 border border-slate-800 rounded p-4">
        <input placeholder="Scene title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input type="number" placeholder="Order index" value={form.orderIndex} onChange={(e) => setForm({ ...form, orderIndex: Number(e.target.value) })} />
        <input type="number" placeholder="Duration target (sec)" value={form.durationTargetSeconds} onChange={(e) => setForm({ ...form, durationTargetSeconds: Number(e.target.value) })} />
        <input placeholder="Mood" value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Visual style" value={form.visualStyle} onChange={(e) => setForm({ ...form, visualStyle: e.target.value })} />
        <textarea className="col-span-2" placeholder="Camera notes" value={form.cameraNotes} onChange={(e) => setForm({ ...form, cameraNotes: e.target.value })} />
        <textarea className="col-span-2" placeholder="Audio notes" value={form.audioNotes} onChange={(e) => setForm({ ...form, audioNotes: e.target.value })} />
        <div className="col-span-2">
          <p className="text-sm mb-1">Characters in scene</p>
          <div className="grid grid-cols-3 gap-2">
            {characters.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.sceneCharacterIds.includes(c.id)}
                  onChange={(e) => setForm({ ...form, sceneCharacterIds: e.target.checked ? [...form.sceneCharacterIds, c.id] : form.sceneCharacterIds.filter((id) => id !== c.id) })}
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex justify-between mb-2">
          <h3>Dialogue Blueprint</h3>
          <button className="bg-slate-700" onClick={addLine}>Add line</button>
        </div>
        <div className="grid gap-2">
          {form.dialogueLines.map((line, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <input placeholder="Speaker" value={line.speakerName} onChange={(e) => { const next=[...form.dialogueLines]; next[i].speakerName=e.target.value; setForm({ ...form, dialogueLines: next }); }} />
              <input placeholder="Emotion" value={line.emotion} onChange={(e) => { const next=[...form.dialogueLines]; next[i].emotion=e.target.value; setForm({ ...form, dialogueLines: next }); }} />
              <input className="col-span-2" placeholder="Line text" value={line.lineText} onChange={(e) => { const next=[...form.dialogueLines]; next[i].lineText=e.target.value; setForm({ ...form, dialogueLines: next }); }} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <h3 className="mb-2">Structured JSON Preview</h3>
          <pre className="text-xs overflow-auto max-h-72">{payloadPreview}</pre>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col gap-2">
          <button className="bg-cyan-600" onClick={save}>Save Scene Blueprint</button>
          {scene?.id && <button className="bg-purple-600" onClick={generate}>Generate Clip</button>}
        </div>
      </div>
    </div>
  );
}
