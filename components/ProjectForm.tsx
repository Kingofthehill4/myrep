"use client";

import { useState } from "react";

export function ProjectForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ title: "", slug: "", description: "", type: "SERIES" });

  async function submit() {
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", slug: "", description: "", type: "SERIES" });
    onCreated();
  }

  return (
    <div className="grid gap-2 p-4 bg-slate-900 rounded border border-slate-800">
      <h3 className="font-medium">Create Project</h3>
      <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
        <option value="MOVIE">Movie</option>
        <option value="SERIES">Series</option>
        <option value="SHORT">Short</option>
      </select>
      <button className="bg-cyan-600" onClick={submit}>Save Project</button>
    </div>
  );
}
