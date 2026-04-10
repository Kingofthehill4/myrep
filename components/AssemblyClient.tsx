"use client";

import { useEffect, useState } from "react";

type Clip = { id: string; path: string };

export function AssemblyClient({ projectId }: { projectId: string }) {
  const [clips, setClips] = useState<Clip[]>([]);
  const [title, setTitle] = useState("Episode Cut");
  const [description, setDescription] = useState("Rough assembly");
  useEffect(() => {
    fetch(`/api/media?projectId=${projectId}&type=VIDEO_CLIP`).then((r) => r.json()).then(setClips);
  }, [projectId]);

  async function save() {
    const timelineJson = JSON.stringify(clips.map((c, idx) => ({ index: idx, assetId: c.id, path: c.path })));
    await fetch("/api/assemblies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, title, description, status: "DRAFT", timelineJson }) });
  }

  return (
    <div className="grid gap-3">
      <h1 className="text-2xl">Episode/Movie Assembly</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid gap-2">
        {clips.map((clip, idx) => (
          <div key={clip.id} className="bg-slate-900 border border-slate-800 rounded p-3 flex justify-between">
            <span>{idx + 1}. {clip.path}</span>
            <div className="flex gap-1">
              <button className="bg-slate-700" onClick={() => idx > 0 && setClips((c) => { const n=[...c]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; return n; })}>↑</button>
              <button className="bg-slate-700" onClick={() => idx < clips.length-1 && setClips((c) => { const n=[...c]; [n[idx+1], n[idx]] = [n[idx], n[idx+1]]; return n; })}>↓</button>
            </div>
          </div>
        ))}
      </div>
      <button className="bg-cyan-600" onClick={save}>Save Assembly Timeline</button>
    </div>
  );
}
