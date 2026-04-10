import { prisma } from "@/lib/prisma";

type JobLite = { id: string; status: string; type: string; provider: string };

export default async function ProjectJobsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobs = (await prisma.generationJob.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } })) as JobLite[];
  return <div><h1 className="text-2xl mb-3">Generation Jobs</h1><div className="grid gap-2">{jobs.map((job: JobLite) => <div key={job.id} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">{job.status} · {job.type} · {job.provider}</div>)}</div></div>;
}
