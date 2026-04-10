import Link from "next/link";
import { prisma } from "@/lib/prisma";

type JobLite = { id: string; status: string; type: string; provider: string };

export default async function DashboardPage() {
  const [projects, scenes, jobs, media] = await Promise.all([
    prisma.project.count(),
    prisma.scene.count(),
    prisma.generationJob.findMany({ orderBy: { createdAt: "desc" }, take: 5 }) as Promise<JobLite[]>,
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Studio Dashboard</h1>
      <div className="grid grid-cols-4 gap-3">
        {[ ["Projects", projects], ["Scenes", scenes], ["Jobs", jobs.length], ["Recent Assets", media.length] ].map(([l,v]) => (
          <div key={String(l)} className="bg-slate-900 border border-slate-800 rounded p-4"><p className="text-sm text-slate-400">{String(l)}</p><p className="text-2xl">{String(v)}</p></div>
        ))}
      </div>
      <section className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2 className="mb-2">Recent Generation Jobs</h2>
        {jobs.map((job: JobLite) => <p key={job.id} className="text-sm">{job.status} · {job.type} · {job.provider}</p>)}
      </section>
      <Link href="/projects" className="bg-cyan-600 inline-flex w-fit px-4 py-2 rounded">Open Projects</Link>
    </div>
  );
}
