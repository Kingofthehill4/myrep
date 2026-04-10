"use client";

import { useState } from "react";

export function CharacterForm({ projectId, onCreated }: { projectId: string; onCreated: () => void }) {
  const [form, setForm] = useState({
    projectId,
    name: "",
    slug: "",
    description: "",
    appearancePrompt: "",
    personalityNotes: "",
    voiceProfile: "",
    referenceImagePath: "",
    stylePreset: "",
  });
  async function submit() {
    await fetch("/api/characters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    onCreated();
  }
  return (
    <div className="grid grid-cols-2 gap-2 p-4 bg-slate-900 rounded border border-slate-800">
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Slug" onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea placeholder="Description" className="col-span-2" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <textarea placeholder="Appearance prompt" className="col-span-2" onChange={(e) => setForm({ ...form, appearancePrompt: e.target.value })} />
      <textarea placeholder="Personality notes" className="col-span-2" onChange={(e) => setForm({ ...form, personalityNotes: e.target.value })} />
      <input placeholder="Voice profile" onChange={(e) => setForm({ ...form, voiceProfile: e.target.value })} />
      <input placeholder="Reference image path" onChange={(e) => setForm({ ...form, referenceImagePath: e.target.value })} />
      <input placeholder="Style preset" className="col-span-2" onChange={(e) => setForm({ ...form, stylePreset: e.target.value })} />
      <button className="bg-cyan-600 col-span-2" onClick={submit}>Add Character</button>
    </div>
  );
}
