import Link from "next/link";
import { ReactNode } from "react";

const nav = [
  ["Dashboard", "/"],
  ["Projects", "/projects"],
  ["Jobs", "/jobs"],
  ["Media", "/media"],
];

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-cyan-400 font-semibold">AmyCore</p>
          <p className="text-xs text-slate-400">Internal AI-assisted production studio</p>
        </div>
        <nav className="flex gap-2">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-400">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
