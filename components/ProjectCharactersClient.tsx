"use client";

import { useCallback, useEffect, useState } from "react";
import { CharacterForm } from "@/components/CharacterForm";

type Character = { id: string; name: string; voiceProfile: string; stylePreset: string };

export function ProjectCharactersClient({ projectId }: { projectId: string }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const load = useCallback(async () => {
    const res = await fetch(`/api/characters?projectId=${projectId}`);
    setCharacters(await res.json());
  }, [projectId]);
  useEffect(() => { void load(); }, [load]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl">Character Manager</h1>
      <CharacterForm projectId={projectId} onCreated={load} />
      <div className="grid gap-2">
        {characters.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded p-3">
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-slate-400">{c.voiceProfile} · {c.stylePreset}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
