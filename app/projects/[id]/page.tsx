import Link from "next/link";
import { prisma } from "@/lib/prisma";

type ProjectDetail = {
  title: string;
  description: string;
  scenes: Array<{ id: string; orderIndex: number; title: string; status: string }>;
  jobs: Array<{ id: string; status: string; provider: string }>;
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = (await prisma.project.findUnique({
    where: { id },
    include: {
      characters: true,
      scenes: { orderBy: { orderIndex: "asc" } },
      jobs: { orderBy: { createdAt: "desc" }, take: 10 },
      assets: { orderBy: { createdAt: "desc" }, take: 10 },
      assemblies: { orderBy: { updatedAt: "desc" }, take: 10 },
    },
  })) as ProjectDetail | null;

  if (!project) return <p>Project not found.</p>;

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p className="text-slate-300">{project.description}</p>
      <div className="flex gap-2">
        <Link href={`/projects/${id}/characters`} className="bg-slate-800">Characters</Link>
        <Link href={`/projects/${id}/scenes/new`} className="bg-slate-800">New Scene</Link>
        <Link href={`/projects/${id}/jobs`} className="bg-slate-800">Jobs</Link>
        <Link href={`/projects/${id}/assets`} className="bg-slate-800">Assets</Link>
        <Link href={`/projects/${id}/assembly`} className="bg-slate-800">Assembly</Link>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2>Scenes</h2>
        {project.scenes.map((scene) => (
          <Link key={scene.id} href={`/projects/${id}/scenes/${scene.id}`} className="block py-1 text-sm hover:text-cyan-300">#{scene.orderIndex} {scene.title} · {scene.status}</Link>
        ))}
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded p-4">
        <h2>Recent Jobs</h2>
        {project.jobs.map((job) => <p key={job.id} className="text-sm">{job.status} · {job.provider}</p>)}
      </section>
    </div>
  );
}
