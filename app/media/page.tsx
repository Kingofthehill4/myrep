"use client";
import { useEffect, useState } from "react";

type Asset = { id: string; type: string; path: string; project: { title: string } | null; scene: { title: string } | null };

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  useEffect(() => { fetch("/api/media").then((r) => r.json()).then(setAssets); }, []);

  return <div className="grid gap-3"><h1 className="text-2xl">Media/Clip Library</h1>{assets.map((asset) => <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded p-3"><p>{asset.type} · {asset.path}</p><p className="text-xs text-slate-400">Project: {asset.project?.title} Scene: {asset.scene?.title ?? "n/a"}</p></div>)}</div>;
}
