import { prisma } from "@/lib/prisma";

type AssetLite = { id: string; type: string; path: string };

export default async function ProjectAssetsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assets = (await prisma.mediaAsset.findMany({ where: { projectId: id }, orderBy: { createdAt: "desc" } })) as AssetLite[];
  return (
    <div className="grid gap-2">
      <h1 className="text-2xl">Media Library</h1>
      {assets.map((asset: AssetLite) => <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded p-3 text-sm">{asset.type} · {asset.path}</div>)}
    </div>
  );
}
