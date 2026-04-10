"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProjectForm } from "@/components/ProjectForm";

type Project = { id: string; title: string; description: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  async function load() {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
  }
  useEffect(() => { void load(); }, []);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ProjectForm onCreated={load} />
      <div className="grid gap-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="bg-slate-900 border border-slate-800 rounded p-3 hover:border-cyan-400">
            <p className="font-medium">{project.title}</p>
            <p className="text-sm text-slate-400">{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
