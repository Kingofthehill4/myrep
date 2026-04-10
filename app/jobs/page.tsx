"use client";
import { useCallback, useEffect, useState } from "react";

type Job = { id: string; status: string; provider: string; sceneId: string | null; scene: { title: string } | null };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [status, setStatus] = useState("");
  const load = useCallback(async (nextStatus = status) => {
    const res = await fetch(`/api/jobs${nextStatus ? `?status=${nextStatus}` : ""}`);
    setJobs(await res.json());
  }, [status]);
  useEffect(() => { void load(); }, [load]);
  async function retry(sceneId: string) {
    await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sceneId }) });
    void load();
  }

  return <div className="grid gap-3"><h1 className="text-2xl">Generation Jobs</h1><select value={status} onChange={(e) => { setStatus(e.target.value); void load(e.target.value); }}><option value="">All</option><option value="QUEUED">Queued</option><option value="PROCESSING">Processing</option><option value="COMPLETED">Completed</option><option value="FAILED">Failed</option></select>{jobs.map((job) => <div key={job.id} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm flex justify-between"><span>{job.status} · {job.provider} · {job.scene?.title ?? "No Scene"}</span>{job.status === "FAILED" && job.sceneId && <button className="bg-red-600" onClick={() => retry(job.sceneId!)}>Retry</button>}</div>)}</div>;
}
