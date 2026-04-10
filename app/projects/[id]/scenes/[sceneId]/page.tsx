import { prisma } from "@/lib/prisma";
import { SceneEditor } from "@/components/SceneEditor";

export default async function SceneDetailPage({ params }: { params: Promise<{ id: string; sceneId: string }> }) {
  const { id, sceneId } = await params;
  const [scene, characters] = await Promise.all([
    prisma.scene.findUnique({ where: { id: sceneId }, include: { sceneCharacters: true, dialogueLines: { orderBy: { sortOrder: "asc" } } } }),
    prisma.character.findMany({ where: { projectId: id }, select: { id: true, name: true } }),
  ]);
  if (!scene) return <p>Scene missing.</p>;

  return (
    <div className="grid gap-3">
      <h1 className="text-2xl">Scene Editor · {scene.title}</h1>
      <SceneEditor projectId={id} scene={scene} characters={characters} onSaved={() => {}} />
    </div>
  );
}
